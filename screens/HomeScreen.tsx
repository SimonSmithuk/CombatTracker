import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createGame, getGame } from '../services/gameService';

interface HomeScreenProps {
}

const DiceIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-6" viewBox="0 0 20 20" fill="currentColor">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM5.5 8a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm5 5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zm4.5-5a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" clipRule="evenodd" />
        <path d="M10 11a1.5 1.5 0 100-3 1.5 1.5 0 000 3z" />
    </svg>
);


const HomeScreen: React.FC<HomeScreenProps> = () => {
  const [gameCode, setGameCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleCreate = async () => {
    setIsLoading(true);
    setError(null);
    try {
        const newGame = await createGame();
        navigate(`/dm/${newGame.id}`);
    } catch(err) {
        setError('Failed to create game. Please try again.');
        setIsLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (gameCode.trim().length !== 6) {
      setError('Game code must be 6 characters long.');
      return;
    }
    setIsLoading(true);
    setError(null);
    try {
        const game = await getGame(gameCode.toUpperCase());
        if (game) {
          navigate(`/pc/${game.id}`);
        } else {
          setError('Game not found. Please check the code and try again.');
          setIsLoading(false);
        }
    } catch(err) {
        setError('Could not connect to server. Please try again.');
        setIsLoading(false);
    }
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    setGameCode(e.target.value);
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
        <div className="flex flex-col items-center mb-8">
            <DiceIcon />
            <h1 className="text-4xl font-bold text-white tracking-wider">Combat Tracker</h1>
            <p className="text-gray-400 mt-2">For Dungeon Masters & Players</p>
        </div>

        <div className="mb-6">
            <button
                onClick={handleCreate}
                disabled={isLoading}
                className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:bg-gray-500 disabled:cursor-wait"
            >
                {isLoading ? 'Creating...' : 'Create New Game'}
            </button>
        </div>

        <div className="relative flex py-5 items-center">
            <div className="flex-grow border-t border-gray-600"></div>
            <span className="flex-shrink mx-4 text-gray-400">OR</span>
            <div className="flex-grow border-t border-gray-600"></div>
        </div>

        <form onSubmit={handleJoin}>
            <label htmlFor="gameCode" className="block text-sm font-medium text-gray-300 mb-2">
                Join an Existing Game
            </label>
            <input
                id="gameCode"
                type="text"
                value={gameCode}
                onChange={handleInputChange}
                maxLength={6}
                placeholder="Enter 6-character code"
                className="w-full bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500 uppercase tracking-widest text-center"
            />
            {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
            <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-4 bg-gray-600 hover:bg-gray-500 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400 focus:ring-opacity-50 disabled:bg-gray-500 disabled:cursor-wait"
            >
                 {isLoading ? 'Joining...' : 'Join Game'}
            </button>
        </form>
      </div>
       <div className="mt-6 text-center h-5">
       {/* Placeholder for layout consistency */}
      </div>
    </div>
  );
};

export default HomeScreen;
