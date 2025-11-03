import React from 'react';
import { DND_CONDITION_DEFINITIONS } from '../constants/dndConstants';

interface ConditionGlossaryProps {
  activeConditions: string[];
}

const ConditionGlossary: React.FC<ConditionGlossaryProps> = ({ activeConditions }) => {
  if (activeConditions.length === 0) {
    return null;
  }

  return (
    <div className="mt-12 w-full max-w-4xl bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700">
      <h2 className="text-2xl font-bold text-white mb-4">Condition Glossary</h2>
      <div className="space-y-4">
        {activeConditions.map(condition => (
          <div key={condition}>
            <h3 className="font-bold text-lg text-purple-300">{condition}</h3>
            <ul className="list-disc list-inside text-sm text-gray-300 space-y-1 mt-1">
              {DND_CONDITION_DEFINITIONS[condition]?.map((definition, index) => (
                <li key={index}>{definition}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ConditionGlossary;
