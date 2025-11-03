import React from 'react';

interface ConditionBadgeProps {
  condition: string;
  onRemove?: (condition: string) => void;
}

const ConditionBadge: React.FC<ConditionBadgeProps> = ({ condition, onRemove }) => {
  return (
    <div className="flex items-center bg-purple-800 text-purple-100 text-xs font-semibold px-2.5 py-1 rounded-full">
      <span>{condition}</span>
      {onRemove && (
        <button
          onClick={() => onRemove(condition)}
          className="ml-2 text-purple-200 hover:text-white focus:outline-none"
          aria-label={`Remove ${condition} condition`}
        >
          &times;
        </button>
      )}
    </div>
  );
};

export default ConditionBadge;