import { Game, Character, ClientMessage, ServerMessage } from '../types';

let apiBaseUrl: string | null = null;
let wsUrl: string | null = null;

export const setServerConfig = (baseUrl: string) => {
    try {
        const url = new URL(baseUrl);
        apiBaseUrl = url.origin;

        const wsProtocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        wsUrl = `${wsProtocol}//${url.host}`;
        console.log(`Server configured. API: ${apiBaseUrl}, WebSocket: ${wsUrl}`);
    } catch (error) {
        console.error("Invalid server URL provided:", baseUrl);
        throw new Error("Invalid server URL format. Please include http:// or https://");
    }
};

const getApiUrl = () => {
    if (!apiBaseUrl) throw new Error("Server URL not configured.");
    return apiBaseUrl;
}

const getWsUrl = () => {
    if (!wsUrl) throw new Error("Server URL not configured.");
    return wsUrl;
}

type Listener = (game: Game | null) => void;
const listeners = new Map<string, Set<Listener>>();
let webSocket: WebSocket | null = null;
let activeGameCode: string | null = null;
let connectionPromise: Promise<void> | null = null;

const notify = (gameCode: string, game: Game | null) => {
    const gameListeners = listeners.get(gameCode.toUpperCase());
    if (gameListeners) {
        gameListeners.forEach(listener => listener(game));
    }
};

const connectWebSocket = (gameCode: string): Promise<void> => {
    if (webSocket && webSocket.readyState === WebSocket.OPEN && activeGameCode === gameCode) {
        return Promise.resolve();
    }
    
    if (webSocket) {
        webSocket.close();
    }

    activeGameCode = gameCode;
    webSocket = new WebSocket(getWsUrl());

    connectionPromise = new Promise((resolve, reject) => {
        webSocket!.onopen = () => {
            console.log('WebSocket connected');
            const joinMessage: ClientMessage = { type: 'JOIN_GAME', payload: { gameCode } };
            webSocket!.send(JSON.stringify(joinMessage));
            resolve();
        };

        webSocket!.onmessage = (event) => {
            const message: ServerMessage = JSON.parse(event.data);
            if (message.type === 'GAME_STATE' && activeGameCode) {
                notify(activeGameCode, message.payload);
            } else if (message.type === 'ERROR') {
                console.error('Server error:', message.payload);
                // Optionally notify listeners of an error state
            }
        };

        webSocket!.onerror = (error) => {
            console.error('WebSocket error:', error);
            reject(error);
        };

        webSocket!.onclose = () => {
            console.log('WebSocket disconnected');
            webSocket = null;
            activeGameCode = null;
            connectionPromise = null;
            // Notify all listeners that the game is no longer available
            listeners.forEach((_, code) => notify(code, null));
        };
    });

    return connectionPromise;
};


export const subscribeToGame = (gameCode: string, callback: Listener): (() => void) => {
    const code = gameCode.toUpperCase();
    connectWebSocket(code).then(() => {
         // After connection, the server will send the initial game state,
         // which will trigger the `onmessage` handler and notify the new subscriber.
    }).catch(err => {
        console.error("Failed to connect to game session.", err);
        callback(null);
    });

    if (!listeners.has(code)) {
        listeners.set(code, new Set());
    }
    const gameListeners = listeners.get(code)!;
    gameListeners.add(callback);
    
    return () => {
        gameListeners.delete(callback);
        if (gameListeners.size === 0) {
            listeners.delete(code);
            // If this was the last listener for this game, consider closing the WebSocket.
            if (webSocket && activeGameCode === code) {
                webSocket.close();
            }
        }
    };
};

export const createGame = async (): Promise<Game> => {
  const response = await fetch(`${getApiUrl()}/api/game/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
  });
  if (!response.ok) {
      throw new Error('Failed to create game');
  }
  return response.json();
};

export const getGame = async (gameCode: string): Promise<Game | null> => {
  try {
    const response = await fetch(`${getApiUrl()}/api/game/${gameCode.toUpperCase()}`);
    if (response.ok) {
        return response.json();
    }
    return null;
  } catch (error) {
    console.error("Failed to fetch game:", error);
    return null;
  }
};

export const updateGame = async (updatedGame: Game): Promise<void> => {
    if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not connected.');
        await connectWebSocket(updatedGame.id);
    }
    
    if (connectionPromise) {
        await connectionPromise;
    }

    const message: ClientMessage = { type: 'UPDATE_GAME', payload: updatedGame };
    webSocket!.send(JSON.stringify(message));
};

export const configurePolling = async (gameCode: string, interval: number): Promise<void> => {
    if (!webSocket || webSocket.readyState !== WebSocket.OPEN) {
        console.error('WebSocket is not connected.');
        await connectWebSocket(gameCode);
    }

    if (connectionPromise) {
        await connectionPromise;
    }

    const message: ClientMessage = { type: 'CONFIGURE_POLLING', payload: { gameCode, interval } };
    webSocket!.send(JSON.stringify(message));
};

export const addCharacterToGame = (gameCode: string, character: Omit<Character, 'id'>): Character => {
  // This function is now mostly a wrapper. The component will get the game state,
  // add the character, and then call updateGame.
  // We keep it to maintain a similar API for the component, but it no longer directly updates storage.
  const newCharacter: Character = {
    ...character,
    id: `char-${Date.now()}`,
  };
  return newCharacter;
};