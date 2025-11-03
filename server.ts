import express from 'express';
import http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { Game, Character } from './types';
import path from 'path';
import { fileURLToPath } from 'url';

// Fix: Define __dirname in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

const games = new Map<string, Game>();
const clients = new Map<string, Set<WebSocket>>();
// Fix: Replaced `NodeJS.Timeout` with `ReturnType<typeof setInterval>` to resolve "Cannot find namespace 'NodeJS'" error.
const pollingIntervals = new Map<string, ReturnType<typeof setInterval>>(); // To store polling timers for each game


const generateGameCode = (): string => {
  let code: string;
  do {
    code = Math.random().toString(36).substring(2, 8).toUpperCase();
  } while (games.has(code)); // Ensure code is unique
  return code;
};

// Simple broadcast function to send data to all clients in a game
const broadcast = (gameCode: string, data: object) => {
    const gameClients = clients.get(gameCode.toUpperCase());
    if (gameClients) {
        gameClients.forEach(client => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(JSON.stringify(data));
            }
        });
    }
};

const setupGamePolling = (gameCode: string, interval: number) => {
    gameCode = gameCode.toUpperCase();
    // Clear existing poller if any
    if (pollingIntervals.has(gameCode)) {
        clearInterval(pollingIntervals.get(gameCode)!);
    }
    
    // Don't set up polling if interval is 0 or less (e.g. to disable it)
    if (interval <= 0) {
        pollingIntervals.delete(gameCode);
        return;
    }

    // Set up new poller
    const timer = setInterval(() => {
        const game = games.get(gameCode);
        if (game) {
            broadcast(gameCode, { type: 'GAME_STATE', payload: game });
        } else {
            // Game doesn't exist anymore, clean up poller
            clearInterval(timer);
            pollingIntervals.delete(gameCode);
        }
    }, interval);

    pollingIntervals.set(gameCode, timer);
};

app.use(express.json());

// CORS Middleware
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

const apiRouter = express.Router();

// API endpoint to create a new game
apiRouter.post('/game/create', (req, res) => {
    const gameCode = generateGameCode();
    const newGame: Game = {
        id: gameCode,
        characters: [],
        currentTurnPlayerId: null,
        isCombatActive: false,
    };
    games.set(gameCode, newGame);
    clients.set(gameCode, new Set());
    setupGamePolling(gameCode, 2000); // Set default polling to 2 seconds
    console.log(`Game created with code: ${gameCode}`);
    res.status(201).json(newGame);
});

// API endpoint to get game details (or just check existence)
apiRouter.get('/game/:gameCode', (req, res) => {
    const gameCode = req.params.gameCode.toUpperCase();
    const game = games.get(gameCode);
    if (game) {
        res.status(200).json(game);
    } else {
        res.status(404).json({ message: 'Game not found.' });
    }
});

app.use('/api', apiRouter);


wss.on('connection', (ws) => {
    let currentGameCode: string | null = null;

    ws.on('message', (message) => {
        try {
            const data = JSON.parse(message.toString());
            const { type, payload } = data;

            switch (type) {
                case 'JOIN_GAME': {
                    const { gameCode } = payload;
                    if (games.has(gameCode.toUpperCase())) {
                        currentGameCode = gameCode.toUpperCase();
                        const gameClients = clients.get(currentGameCode);
                        if (gameClients) {
                           gameClients.add(ws);
                        }
                        
                        console.log(`Client joined game: ${currentGameCode}`);

                        // Send current game state to the new client
                        const gameState = games.get(currentGameCode);
                        ws.send(JSON.stringify({ type: 'GAME_STATE', payload: gameState }));
                    } else {
                        ws.send(JSON.stringify({ type: 'ERROR', payload: 'Game not found' }));
                    }
                    break;
                }
                case 'UPDATE_GAME': {
                    const updatedGame: Game = payload;
                    if (updatedGame && games.has(updatedGame.id.toUpperCase())) {
                        games.set(updatedGame.id.toUpperCase(), updatedGame);
                        // Broadcast the update to all clients in that game
                        broadcast(updatedGame.id, { type: 'GAME_STATE', payload: updatedGame });
                    }
                    break;
                }
                case 'CONFIGURE_POLLING': {
                    const { gameCode, interval } = payload;
                    if (games.has(gameCode.toUpperCase())) {
                        console.log(`Setting polling for ${gameCode} to ${interval}ms`);
                        setupGamePolling(gameCode, interval);
                    }
                    break;
                }
            }
        } catch (error) {
            console.error('Failed to parse message or handle client request:', error);
        }
    });

    ws.on('close', () => {
        if (currentGameCode) {
            const gameClients = clients.get(currentGameCode);
            if (gameClients) {
                gameClients.delete(ws);
                console.log(`Client left game: ${currentGameCode}`);
                
                // Optional: clean up game if no clients are left
                if (gameClients.size === 0) {
                    console.log(`Game ${currentGameCode} is now empty. Removing.`);
                    games.delete(currentGameCode);
                    clients.delete(currentGameCode);
                    
                    // Also clean up poller
                    if (pollingIntervals.has(currentGameCode)) {
                        clearInterval(pollingIntervals.get(currentGameCode)!);
                        pollingIntervals.delete(currentGameCode);
                    }
                }
            }
        }
    });
    
    ws.on('error', (error) => {
        console.error('WebSocket error:', error);
    });
});

const staticPath = path.resolve(__dirname);
app.use(express.static(staticPath));

// For SPA routing, serve index.html for any route not handled by static middleware or API
app.get('*', (req, res) => {
    res.sendFile(path.resolve(staticPath, 'index.html'));
});


const PORT = process.env.PORT || 8080;
server.listen(PORT, () => {
    console.log(`Server is listening on http://localhost:${PORT}`);
});