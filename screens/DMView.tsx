import React, { useState, useEffect } from 'react';
import { subscribeToGame, updateGame, configurePolling } from '../services/gameService';
import { Game, Character } from '../types';
import DMCharacterCard from '../components/DMCharacterCard';
import ConditionGlossary from '../components/ConditionGlossary';

interface DMViewProps {
  gameCode: string;
  onLeave: () => void;
}

const DMView: React.FC<DMViewProps> = ({ gameCode, onLeave }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [draggedCharacterId, setDraggedCharacterId] = useState<string | null>(null);
  const [pollingInterval, setPollingInterval] = useState('2'); // In seconds

  useEffect(() => {
    // Subscribe to game updates. The callback will update our state.
    const unsubscribe = subscribeToGame(gameCode, (gameData) => {
      if (gameData) {
        setGame(gameData);
        setError(null);
      } else {
        setError(`Game with code ${gameCode} not found or has been removed.`);
        setGame(null);
      }
    });

    // Cleanup subscription on component unmount
    return () => unsubscribe();
  }, [gameCode]);

  const handleSetPolling = (e: React.FormEvent) => {
    e.preventDefault();
    const intervalSeconds = parseFloat(pollingInterval);
    if (!isNaN(intervalSeconds) && intervalSeconds > 0) {
        configurePolling(gameCode, intervalSeconds * 1000);
    } else if (intervalSeconds === 0) {
        // Allow disabling by setting to 0
        configurePolling(gameCode, 0);
    }
  };


  const handleUpdateCharacter = (characterId: string, updates: Partial<Character>) => {
    if (!game) return;
    const updatedCharacters = game.characters.map(c => 
      c.id === characterId ? { ...c, ...updates } : c
    );
    updateGame({ ...game, characters: updatedCharacters });
  };
  
  const handleRemoveCharacter = (characterId: string) => {
    if (!game) return;
    const updatedCharacters = game.characters.filter(c => c.id !== characterId);
    updateGame({ ...game, characters: updatedCharacters });
  }

  const handleSetCurrentTurn = (characterId: string | null) => {
    if (!game) return;
    updateGame({ ...game, currentTurnPlayerId: characterId });
  };

  const handleSortByInitiative = () => {
    if (!game) return;
    const sorted = [...game.characters].sort((a, b) => b.initiative - a.initiative);
    updateGame({ ...game, characters: sorted });
  };

  const handleDragStart = (characterId: string) => {
    setDraggedCharacterId(characterId);
  };

  const handleDrop = (targetCharacterId: string) => {
    if (!draggedCharacterId || !game || draggedCharacterId === targetCharacterId) {
      setDraggedCharacterId(null);
      return;
    };

    const currentCharacters = game.characters;
    const draggedIndex = currentCharacters.findIndex(c => c.id === draggedCharacterId);
    const targetIndex = currentCharacters.findIndex(c => c.id === targetCharacterId);

    if (draggedIndex === -1 || targetIndex === -1) return;

    const newCharacters = [...currentCharacters];
    const [draggedItem] = newCharacters.splice(draggedIndex, 1);
    newCharacters.splice(targetIndex, 0, draggedItem);

    updateGame({ ...game, characters: newCharacters });
    setDraggedCharacterId(null);
  };
  
  const handleStartCombat = () => {
      if (!game || game.characters.length === 0) return;
      const sorted = [...game.characters].sort((a, b) => b.initiative - a.initiative);
      const firstCharacterId = sorted.length > 0 ? sorted[0].id : null;
      updateGame({ ...game, characters: sorted, isCombatActive: true, currentTurnPlayerId: firstCharacterId });
  }
  
  const handleEndCombat = () => {
      if(!game) return;
      updateGame({ ...game, isCombatActive: false, currentTurnPlayerId: null });
  }
  
  const handleNextTurn = () => {
      if(!game || !game.currentTurnPlayerId || game.characters.length === 0) return;
      
      const currentIndex = game.characters.findIndex(c => c.id === game.currentTurnPlayerId);
      const nextIndex = (currentIndex + 1) % game.characters.length;
      const nextPlayerId = game.characters[nextIndex].id;
      
      updateGame({ ...game, currentTurnPlayerId: nextPlayerId });
  }

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  if (!game) {
    return <div className="text-center p-8">Loading game...</div>;
  }

  const activeConditions = Array.from(
    new Set(game.characters.flatMap(c => c.conditions))
  ).sort();
  
  return (
    <div className="container mx-auto p-4 md:p-8">
      <header className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white">Dungeon Master View</h1>
            <div className="mt-2 flex items-center gap-4 text-lg text-gray-400">
                <span>Game Code:</span> 
                <span className="font-mono bg-gray-700 text-red-400 py-1 px-3 rounded-md tracking-widest">{gameCode}</span>
                 <span className={`py-1 px-3 rounded-full text-sm font-semibold ${game.isCombatActive ? 'bg-red-900 text-red-300' : 'bg-green-900 text-green-300'}`}>
                    Combat: {game.isCombatActive ? 'Active' : 'Inactive'}
                </span>
            </div>
        </div>
        <div className="flex items-center space-x-2">
             {game.isCombatActive ? (
                <>
                    <button onClick={handleNextTurn} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        Next Turn
                    </button>
                    <button onClick={handleEndCombat} className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                        End Combat
                    </button>
                </>
            ) : (
                <button onClick={handleStartCombat} disabled={game.characters.length === 0} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300 disabled:bg-gray-500 disabled:cursor-not-allowed">
                    Start Combat
                </button>
            )}
            <button onClick={handleSortByInitiative} className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                Sort by Initiative
            </button>
            <button onClick={onLeave} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
                End Game
            </button>
        </div>
      </header>
      
      <div className="mb-6 bg-gray-800 p-4 rounded-lg border border-gray-700 flex items-center justify-between flex-wrap gap-4">
            <h2 className="text-lg font-semibold text-white">Game Settings</h2>
            <form onSubmit={handleSetPolling} className="flex items-center gap-2">
                <label htmlFor="pollingInterval" className="text-sm text-gray-400">Sync Interval (s):</label>
                <input 
                    id="pollingInterval"
                    type="number"
                    value={pollingInterval}
                    onChange={(e) => setPollingInterval(e.target.value)}
                    min="0.5"
                    step="0.5"
                    className="w-20 bg-gray-700 text-white text-center rounded-md p-1 border border-gray-600"
                    aria-label="Sync interval in seconds"
                />
                <button type="submit" className="text-sm bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-1 px-3 rounded-md">Set</button>
            </form>
        </div>

      {game.characters.length === 0 ? (
        <div className="text-center bg-gray-800 border border-gray-700 rounded-lg p-12">
            <h2 className="text-2xl font-semibold text-white">The battlefield is empty...</h2>
            <p className="text-gray-400 mt-2">Share the game code with your players to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {game.characters.map(character => (
            <DMCharacterCard
              key={character.id}
              character={character}
              isCurrentTurn={game.currentTurnPlayerId === character.id}
              onUpdateCharacter={handleUpdateCharacter}
              onRemoveCharacter={handleRemoveCharacter}
              onSetCurrentTurn={handleSetCurrentTurn}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
              isCombatActive={game.isCombatActive}
            />
          ))}
        </div>
      )}
      <ConditionGlossary activeConditions={activeConditions} />
    </div>
  );
};

export default DMView;