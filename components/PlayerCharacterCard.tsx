import React, { useState } from 'react';
import { Character } from '../types';
import ConditionBadge from './EffectBadge';
import ShieldIcon from './ShieldIcon';

interface PlayerCharacterCardProps {
  character: Character;
  isCurrentTurn: boolean;
  onUpdate: (updates: Partial<Character>) => void;
}

const HealthBar = ({ hp, maxHp }: { hp: number; maxHp: number }) => {
    const percentage = maxHp > 0 ? (hp / maxHp) * 100 : 0;
    const color = percentage > 50 ? 'bg-green-500' : percentage > 25 ? 'bg-yellow-500' : 'bg-red-600';

    return (
        <div className="w-full bg-gray-600 rounded-full h-4 my-2">
            <div className={`${color} h-4 rounded-full transition-all duration-500`} style={{ width: `${percentage}%` }}></div>
        </div>
    );
};

const PlayerCharacterCard: React.FC<PlayerCharacterCardProps> = ({ character, isCurrentTurn, onUpdate }) => {
  const [editing, setEditing] = useState(false);
  const [tempHpInput, setTempHpInput] = useState<string>('');
  const [formData, setFormData] = useState({
      armorClass: character.armorClass,
      initiative: character.initiative,
      maxHitPoints: character.maxHitPoints,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData(prev => ({...prev, [name]: parseInt(value, 10) || 0}));
  }

  const handleSave = () => {
      onUpdate(formData);
      setEditing(false);
  }
  
  const handleSetTempHp = () => {
    const newValue = parseInt(tempHpInput, 10);
    // If input is empty or not a number, set to 0 to clear temp HP
    onUpdate({ temporaryHitPoints: isNaN(newValue) ? 0 : newValue });
    setTempHpInput('');
  };

  const borderClass = isCurrentTurn ? 'border-4 border-yellow-400 shadow-lg shadow-yellow-400/30' : 'border-2 border-gray-700';

  return (
    <div className={`w-full max-w-md bg-gray-800 rounded-lg p-6 shadow-xl transition-all duration-300 ${borderClass}`}>
      {isCurrentTurn && <div className="text-center text-yellow-400 font-bold text-lg mb-4 animate-pulse">IT'S YOUR TURN!</div>}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-3xl font-bold text-white">{character.name}</h3>
          <p className="text-md text-gray-400">Initiative: {character.initiative}</p>
        </div>
        <div className="flex flex-col items-center">
          <ShieldIcon ac={character.armorClass} size="lg" />
          <span className="text-xs text-gray-400">AC</span>
        </div>
      </div>

      <div className="my-6">
        <div className="flex justify-between items-center text-white">
          <span className="font-bold text-2xl">
            {character.hitPoints} 
            {character.temporaryHitPoints > 0 && <span className="text-cyan-400"> +{character.temporaryHitPoints}</span>}
             / {character.maxHitPoints}
          </span>
          <span className="text-md text-gray-400">HP</span>
        </div>
        <HealthBar hp={character.hitPoints} maxHp={character.maxHitPoints} />
      </div>

      <div className="mt-4 pt-4 border-t border-gray-700">
        <h4 className="text-lg font-semibold text-gray-300 mb-2">Temporary Hit Points</h4>
        <div className="flex items-center space-x-2">
            <input
                type="number"
                value={tempHpInput}
                onChange={(e) => setTempHpInput(e.target.value)}
                placeholder={`Current: ${character.temporaryHitPoints}`}
                className="flex-grow bg-gray-700 text-white placeholder-gray-500 border border-gray-600 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <button
                onClick={handleSetTempHp}
                className="bg-cyan-600 hover:bg-cyan-700 text-white font-bold py-2 px-4 rounded-lg transition"
            >
                Set
            </button>
        </div>
      </div>

      <div className="mt-4">
        <h4 className="text-lg font-semibold text-gray-300 mb-2">Status Conditions</h4>
        <div className="flex flex-wrap gap-2 min-h-[36px]">
          {character.conditions.length > 0 ? character.conditions.map(cond => <ConditionBadge key={cond} condition={cond} />) : <p className="text-gray-500 text-sm">None</p>}
        </div>
      </div>
      
      {editing ? (
        <div className="mt-6 pt-4 border-t border-gray-700 space-y-4">
            <div>
                <label className="text-sm text-gray-400">Armor Class</label>
                <input type="number" name="armorClass" value={formData.armorClass} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-md"/>
            </div>
            <div>
                <label className="text-sm text-gray-400">Max HP</label>
                <input type="number" name="maxHitPoints" value={formData.maxHitPoints} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-md"/>
            </div>
             <div>
                <label className="text-sm text-gray-400">Initiative</label>
                <input type="number" name="initiative" value={formData.initiative} onChange={handleInputChange} className="w-full bg-gray-700 p-2 rounded-md"/>
            </div>
            <div className="flex space-x-2">
                <button onClick={handleSave} className="flex-1 bg-green-600 hover:bg-green-700 text-white font-bold py-2 rounded-lg">Save</button>
                <button onClick={() => setEditing(false)} className="flex-1 bg-gray-600 hover:bg-gray-500 text-white font-bold py-2 rounded-lg">Cancel</button>
            </div>
        </div>
      ) : (
        <div className="mt-6 pt-4 border-t border-gray-700">
            <button onClick={() => setEditing(true)} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 rounded-lg">Edit Stats</button>
        </div>
      )}

    </div>
  );
};

export default PlayerCharacterCard;