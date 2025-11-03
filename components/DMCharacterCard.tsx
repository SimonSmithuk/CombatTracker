import React, { useState } from 'react';
import { Character } from '../types';
import ConditionBadge from './EffectBadge';
import { DND_CONDITIONS } from '../constants/dndConstants';
import ShieldIcon from './ShieldIcon';

interface DMCharacterCardProps {
  character: Character;
  isCurrentTurn: boolean;
  onUpdateCharacter: (characterId: string, updates: Partial<Character>) => void;
  onRemoveCharacter: (characterId: string) => void;
  onSetCurrentTurn: (characterId: string | null) => void;
  onDragStart: (characterId: string) => void;
  onDrop: (characterId: string) => void;
  isCombatActive: boolean;
}

const HealthBar = ({ hp, maxHp }: { hp: number; maxHp: number }) => {
    const percentage = maxHp > 0 ? (hp / maxHp) * 100 : 0;
    const color = percentage > 50 ? 'bg-green-500' : percentage > 25 ? 'bg-yellow-500' : 'bg-red-600';

    return (
        <div className="w-full bg-gray-600 rounded-full h-2.5 my-2">
            <div className={`${color} h-2.5 rounded-full`} style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

const DMCharacterCard: React.FC<DMCharacterCardProps> = ({ character, isCurrentTurn, onUpdateCharacter, onRemoveCharacter, onSetCurrentTurn, onDragStart, onDrop, isCombatActive }) => {
  const [hpChange, setHpChange] = useState<string>('1');
  const [tempHpInput, setTempHpInput] = useState<string>('');
  const [isDraggedOver, setIsDraggedOver] = useState(false);

  const handleHpChange = (amount: number) => {
    const currentTempHp = character.temporaryHitPoints || 0;

    if (amount < 0) { // Taking damage
        const damage = Math.abs(amount);
        
        if (damage <= currentTempHp) {
            // Damage is fully absorbed by temp HP
            onUpdateCharacter(character.id, { temporaryHitPoints: currentTempHp - damage });
        } else {
            // Temp HP is depleted, remaining damage goes to regular HP
            const remainingDamage = damage - currentTempHp;
            const newHp = Math.max(0, character.hitPoints - remainingDamage);
            onUpdateCharacter(character.id, { temporaryHitPoints: 0, hitPoints: newHp });
        }
    } else { // Healing - does not affect Temp HP
        const newHp = Math.min(character.maxHitPoints, character.hitPoints + amount);
        onUpdateCharacter(character.id, { hitPoints: newHp });
    }
  };

  const handleSetTempHp = () => {
    const newValue = parseInt(tempHpInput, 10);
    onUpdateCharacter(character.id, { temporaryHitPoints: isNaN(newValue) ? 0 : newValue });
    setTempHpInput('');
  }

  const handleAddCommonCondition = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedCondition = e.target.value;
    if (selectedCondition && !character.conditions.includes(selectedCondition)) {
      onUpdateCharacter(character.id, { conditions: [...character.conditions, selectedCondition] });
    }
    e.target.value = ""; // Reset dropdown
  };

  const handleRemoveCondition = (conditionToRemove: string) => {
    onUpdateCharacter(character.id, { conditions: character.conditions.filter(c => c !== conditionToRemove) });
  };
  
  const handleSetMaxHp = () => {
    onUpdateCharacter(character.id, { hitPoints: character.maxHitPoints });
  }

  const handleDragStart = (e: React.DragEvent<HTMLDivElement>) => {
    e.dataTransfer.effectAllowed = 'move';
    onDragStart(character.id);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault(); // This is necessary to allow dropping
    if (!isDraggedOver) {
        setIsDraggedOver(true);
    }
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDraggedOver(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    onDrop(character.id);
    setIsDraggedOver(false);
  };

  const borderClass = isCurrentTurn ? 'border-4 border-yellow-400 shadow-yellow-400/30' : 'border-2 border-gray-700';
  const dragOverClass = isDraggedOver ? 'ring-2 ring-blue-500 ring-offset-2 ring-offset-gray-900 scale-105' : '';

  return (
    <div 
        className={`bg-gray-800 rounded-lg p-4 shadow-lg transition-all duration-300 ${borderClass} ${dragOverClass}`} 
        draggable="true" 
        onDragStart={handleDragStart} 
        onDragOver={handleDragOver} 
        onDragLeave={handleDragLeave} 
        onDrop={handleDrop}
        style={{ cursor: 'move' }}
    >
      <div className="flex justify-between items-start">
        <div>
          <h3 className="text-xl font-bold text-white">{character.name}</h3>
          <p className="text-sm text-gray-400">Initiative: {character.initiative}</p>
        </div>
        <div className="flex flex-col items-center">
          <ShieldIcon ac={character.armorClass} size="sm" />
          <span className="text-xs text-gray-400">AC</span>
        </div>
      </div>

      <div className="my-4">
        <div className="flex justify-between items-center text-white">
          <span className="font-bold text-lg">
            {character.hitPoints} 
            {character.temporaryHitPoints > 0 && <span className="text-cyan-400 font-normal text-base"> +{character.temporaryHitPoints}</span>}
             / {character.maxHitPoints}
          </span>
          <span className="text-sm text-gray-400">HP</span>
        </div>
        <HealthBar hp={character.hitPoints} maxHp={character.maxHitPoints} />
      </div>

      <div className="flex items-center space-x-2">
        <button onClick={() => handleHpChange(-parseInt(hpChange, 10) || -1)} className="bg-red-600 hover:bg-red-700 text-white font-bold h-8 w-8 rounded-full flex items-center justify-center">-</button>
        <input 
          type="number"
          value={hpChange}
          onChange={(e) => setHpChange(e.target.value)}
          className="w-16 bg-gray-700 text-white text-center rounded-md p-1 border border-gray-600"
        />
        <button onClick={() => handleHpChange(parseInt(hpChange, 10) || 1)} className="bg-green-600 hover:bg-green-700 text-white font-bold h-8 w-8 rounded-full flex items-center justify-center">+</button>
        <button onClick={handleSetMaxHp} className="text-xs bg-blue-600 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded-md">Max</button>
      </div>

       <div className="mt-2 flex items-center space-x-2">
        <input
            type="number"
            value={tempHpInput}
            onChange={(e) => setTempHpInput(e.target.value)}
            placeholder="Temp HP"
            className="w-full bg-gray-700 text-white placeholder-gray-500 text-sm border border-gray-600 rounded-md p-1 focus:outline-none focus:ring-1 focus:ring-cyan-500"
        />
        <button
            onClick={handleSetTempHp}
            className="text-xs bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-1 px-2 rounded-md"
        >
            Set
        </button>
      </div>

      <div className="mt-4">
        <select 
            onChange={handleAddCommonCondition} 
            className="w-full bg-gray-700 text-white text-sm rounded-md p-2 border border-gray-600 focus:ring-purple-500 focus:border-purple-500"
            defaultValue=""
            aria-label="Add a common condition"
        >
            <option value="" disabled>-- Add Condition --</option>
            {DND_CONDITIONS
                .filter(cc => !character.conditions.includes(cc))
                .map(cc => (
                    <option key={cc} value={cc}>{cc}</option>
            ))}
        </select>
        
        <div className="flex flex-wrap gap-2 mt-3 min-h-[28px]">
          {character.conditions.map(cond => <ConditionBadge key={cond} condition={cond} onRemove={handleRemoveCondition} />)}
        </div>
      </div>
      
      <div className="mt-4 pt-4 border-t border-gray-700 flex flex-col space-y-2">
         {isCombatActive && (
             <button onClick={() => onSetCurrentTurn(isCurrentTurn ? null : character.id)} className={`w-full py-2 rounded-lg text-sm font-semibold transition ${isCurrentTurn ? 'bg-yellow-500 hover:bg-yellow-600 text-gray-900' : 'bg-gray-600 hover:bg-gray-500 text-white'}`}>
              {isCurrentTurn ? 'End Turn' : 'Set as Current Turn'}
            </button>
         )}
         <button onClick={() => onRemoveCharacter(character.id)} className="w-full py-2 bg-gray-700 hover:bg-red-800 text-gray-300 hover:text-white rounded-lg text-sm font-semibold transition">
            Remove
        </button>
      </div>
    </div>
  );
};

export default DMCharacterCard;