
import React from 'react';

interface ShieldIconProps {
  ac: number;
  size?: 'sm' | 'lg';
}

const ShieldIcon: React.FC<ShieldIconProps> = ({ ac, size = 'sm' }) => {
  const styles = {
    sm: {
      container: 'w-12 h-12',
      text: 'text-lg',
    },
    lg: {
      container: 'w-16 h-16',
      text: 'text-2xl',
    },
  };

  const currentStyle = styles[size];

  return (
    <div className={`relative flex items-center justify-center ${currentStyle.container}`}>
      <svg className="absolute text-gray-700 w-full h-full" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
        <path d="M12 2L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-3z" />
      </svg>
      <span className={`relative font-bold text-white z-10 ${currentStyle.text}`}>{ac}</span>
    </div>
  );
};

export default ShieldIcon;
