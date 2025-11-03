import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useParams, useNavigate } from 'react-router-dom';
import HomeScreen from './screens/HomeScreen';
import DMView from './screens/DMView';
import PlayerView from './screens/PlayerView';
import ConfigScreen from './screens/ConfigScreen';
import { setServerConfig } from './services/gameService';

// Wrapper to handle routing after server configuration
const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<HomeScreen />} />
      <Route path="/dm/:gameCode" element={<DMRouteWrapper />} />
      <Route path="/pc/:gameCode" element={<PlayerRouteWrapper />} />
    </Routes>
  );
};

const DMRouteWrapper = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const navigate = useNavigate();
  if (!gameCode) {
    navigate('/');
    return null;
  }
  return <DMView gameCode={gameCode.toUpperCase()} onLeave={() => navigate('/')} />;
};

const PlayerRouteWrapper = () => {
  const { gameCode } = useParams<{ gameCode: string }>();
  const navigate = useNavigate();
  const upperCaseGameCode = gameCode?.toUpperCase();

  // Player ID is stored in sessionStorage per game code
  const [playerId, setPlayerId] = useState<string | null>(() => 
    upperCaseGameCode ? sessionStorage.getItem(`dnd-playerId-${upperCaseGameCode}`) : null
  );

  useEffect(() => {
    if (upperCaseGameCode) {
        const storedPlayerId = sessionStorage.getItem(`dnd-playerId-${upperCaseGameCode}`);
        if(storedPlayerId !== playerId) {
            setPlayerId(storedPlayerId);
        }
    }
  }, [upperCaseGameCode]);

  const handleSetPlayerId = (id: string) => {
    setPlayerId(id);
    if (upperCaseGameCode) {
      sessionStorage.setItem(`dnd-playerId-${upperCaseGameCode}`, id);
    }
  };

  const handleLeave = () => {
    if (upperCaseGameCode) {
      sessionStorage.removeItem(`dnd-playerId-${upperCaseGameCode}`);
    }
    navigate('/');
  };

  if (!gameCode) {
    navigate('/');
    return null;
  }

  return <PlayerView gameCode={gameCode.toUpperCase()} playerId={playerId} setPlayerId={handleSetPlayerId} onLeave={handleLeave} />;
};

const App: React.FC = () => {
  const [serverUrl, setServerUrl] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  
  useEffect(() => {
    const savedServerUrl = localStorage.getItem('dnd-serverUrl');
    if (savedServerUrl) {
      try {
        setServerConfig(savedServerUrl);
        setServerUrl(savedServerUrl);
      } catch (e) {
        console.error("Invalid saved server URL", e);
        localStorage.removeItem('dnd-serverUrl');
      }
    }
    setIsInitialized(true);
  }, []);

  const handleSetServerUrl = (url: string) => {
    try {
      setServerConfig(url);
      setServerUrl(url);
      localStorage.setItem('dnd-serverUrl', url);
    } catch (e) {
      // Error will be displayed by ConfigScreen
      console.error("Failed to set server config:", e);
      throw e;
    }
  };

  const handleClearServerUrl = () => {
    localStorage.removeItem('dnd-serverUrl');
    setServerUrl(null);
  };
  
  const renderContent = () => {
      if (!isInitialized) {
          return null; // or a loading spinner
      }
      if (!serverUrl) {
          return <ConfigScreen onConnect={handleSetServerUrl} />;
      }
      return (
          <BrowserRouter>
            <div className="absolute top-4 right-4 z-10">
                <button onClick={handleClearServerUrl} className="text-gray-500 hover:text-gray-300 text-sm underline transition-colors duration-300">
                  Change Server
                </button>
            </div>
            <AppRoutes />
          </BrowserRouter>
      );
  }

  return (
    <div className="bg-gray-900 text-white min-h-screen font-sans">
      {renderContent()}
    </div>
  );
};

export default App;
