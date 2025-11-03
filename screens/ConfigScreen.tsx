import React, { useState } from 'react';

interface ConfigScreenProps {
  onConnect: (url: string) => void;
}

const DragonIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-red-500 mb-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-3.04 0-5.5 2.46-5.5 5.5 0 1.5.6 2.85 1.5 3.85-.9 1-1.5 2.35-1.5 3.85C6.5 19.54 9.04 22 12 22s5.5-2.46 5.5-5.5c0-1.5-.6-2.85-1.5-3.85.9-1 1.5-2.35 1.5-3.85C17.5 5.46 14.96 3 12 3zm0 2c1.38 0 2.5 1.12 2.5 2.5S13.38 10 12 10s-2.5-1.12-2.5-2.5S10.62 5 12 5zm-4.44 6.15c.3.1.6.2.9.3.3.1.6.2.9.3m6.1 0c.3-.1.6-.2.9-.3.3-.1.6-.2.9-.3m-8.91 3.7c.3.1.6.2.9.3.3.1.6.2.9.3m4.3 0c.3-.1.6-.2.9-.3.3-.1.6-.2.9-.3" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

const ConfigScreen: React.FC<ConfigScreenProps> = ({ onConnect }) => {
  const [url, setUrl] = useState('http://localhost:8080');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) {
      setError('Server URL cannot be empty.');
      return;
    }
    setIsLoading(true);
    // Use a try-catch block to validate URL format
    try {
        new URL(url);
        setError('');
        // Simulate a small delay for user feedback
        setTimeout(() => {
            onConnect(url);
            setIsLoading(false);
        }, 500);
    } catch (err) {
        setError('Invalid URL. Please include http:// or https://');
        setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
      <div className="w-full max-w-md bg-gray-800 rounded-2xl shadow-lg p-8 border border-gray-700">
        <div className="flex flex-col items-center mb-8">
          <DragonIcon />
          <h1 className="text-3xl font-bold text-white tracking-wider">Connect to Server</h1>
          <p className="text-gray-400 mt-2">Enter the URL of your game server.</p>
        </div>

        <form onSubmit={handleSubmit}>
          <label htmlFor="serverUrl" className="block text-sm font-medium text-gray-300 mb-2">
            Server URL
          </label>
          <input
            id="serverUrl"
            type="text"
            value={url}
            onChange={(e) => {
              setError('');
              setUrl(e.target.value);
            }}
            placeholder="e.g., http://localhost:8080"
            className="w-full bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
          />
          {error && <p className="text-red-400 text-sm mt-2">{error}</p>}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-6 bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 disabled:bg-gray-500 disabled:cursor-wait"
          >
            {isLoading ? 'Connecting...' : 'Connect'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ConfigScreen;
