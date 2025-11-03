import React, { useState, useEffect } from 'react';
import { subscribeToGame, addCharacterToGame, updateGame } from '../services/gameService';
import { Game, Character } from '../types';
import PlayerCharacterCard from '../components/PlayerCharacterCard';
import CreateCharacterForm from '../components/CreateCharacterForm';
import ConditionGlossary from '../components/ConditionGlossary';

interface PlayerViewProps {
  gameCode: string;
  playerId: string | null;
  setPlayerId: (id: string) => void;
  onLeave: () => void;
}

const PlayerView: React.FC<PlayerViewProps> = ({ gameCode, playerId, setPlayerId, onLeave }) => {
  const [game, setGame] = useState<Game | null>(null);
  const [character, setCharacter] = useState<Character | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = subscribeToGame(gameCode, (gameData) => {
      if (gameData) {
        setGame(gameData);
        if (playerId) {
          const myCharacter = gameData.characters.find(c => c.id === playerId);
          setCharacter(myCharacter || null);
        } else {
            // If player has joined but not created a character, their character will be null
            setCharacter(null);
        }
        setError(null);
      } else {
        setError(`Disconnected from game ${gameCode}.`);
        setGame(null);
        setCharacter(null);
      }
    });

    return () => unsubscribe();
  }, [gameCode, playerId]);

  const handleCreateCharacter = (charData: Omit<Character, 'id'>) => {
    if(!game) {
        setError("Cannot create character, not connected to game.");
        return;
    }
    const newCharacter = addCharacterToGame(gameCode, charData);
    setPlayerId(newCharacter.id);

    const updatedGame = {
      ...game,
      characters: [...game.characters, newCharacter].sort((a,b) => b.initiative - a.initiative)
    };
    updateGame(updatedGame);
  };
  
  const handleUpdateCharacter = (updates: Partial<Character>) => {
    if (!game || !character) return;
    
    const updatedCharacter = {...character, ...updates};
    const updatedCharacters = game.characters.map(c => 
      c.id === character.id ? updatedCharacter : c
    );

    const updatedGame = { ...game, characters: updatedCharacters };
    updateGame(updatedGame);
  };

  if (error) {
    return <div className="text-center text-red-500 p-8">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4 md:p-8 flex flex-col items-center">
      <header className="w-full max-w-4xl flex justify-between items-center mb-8">
        <h1 className="text-3xl md:text-4xl font-bold text-white">Player View</h1>
        <button onClick={onLeave} className="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition duration-300">
            Leave Game
        </button>
      </header>

      {!playerId || !character ? (
        <CreateCharacterForm onCreate={handleCreateCharacter} />
      ) : game ? (
         <>
          <PlayerCharacterCard 
              character={character} 
              isCurrentTurn={game.currentTurnPlayerId === character.id}
              onUpdate={handleUpdateCharacter}
          />
          <ConditionGlossary activeConditions={character.conditions} />
         </>
      ) : (
         <div className="text-center p-8">Loading character...</div>
      )}
    </div>
  );
};

export default PlayerView;