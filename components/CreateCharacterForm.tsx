import React, { useState } from 'react';
import { Character } from '../types';

interface CreateCharacterFormProps {
  onCreate: (character: Omit<Character, 'id'>) => void;
}

const CreateCharacterForm: React.FC<CreateCharacterFormProps> = ({ onCreate }) => {
  const [formData, setFormData] = useState({
    name: 'Boric the Brave',
    armorClass: 16,
    hitPoints: 24,
    initiative: 14,
  });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'name' ? value : parseInt(value, 10) || 0,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('Character name is required.');
      return;
    }
    setError('');
    onCreate({
      name: formData.name,
      armorClass: formData.armorClass,
      hitPoints: formData.hitPoints,
      maxHitPoints: formData.hitPoints, // Max HP defaults to starting HP
      temporaryHitPoints: 0,
      initiative: formData.initiative,
      conditions: [],
    });
  };

  return (
    <div className="w-full max-w-lg bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-6 text-center">Create Your Character</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300">Character Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600 focus:ring-red-500 focus:border-red-500"
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="armorClass" className="block text-sm font-medium text-gray-300">Armor Class</label>
              <input type="number" id="armorClass" name="armorClass" value={formData.armorClass} onChange={handleChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600"/>
            </div>
            <div>
              <label htmlFor="hitPoints" className="block text-sm font-medium text-gray-300">Hit Points</label>
              <input type="number" id="hitPoints" name="hitPoints" value={formData.hitPoints} onChange={handleChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600"/>
            </div>
             <div>
              <label htmlFor="initiative" className="block text-sm font-medium text-gray-300">Initiative</label>
              <input type="number" id="initiative" name="initiative" value={formData.initiative} onChange={handleChange} className="mt-1 w-full bg-gray-700 text-white rounded-md p-2 border border-gray-600"/>
            </div>
        </div>

        {error && <p className="text-red-400 text-sm">{error}</p>}
        
        <button type="submit" className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-4 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 mt-6">
          Join the Fray
        </button>
      </form>
    </div>
  );
};

export default CreateCharacterForm;