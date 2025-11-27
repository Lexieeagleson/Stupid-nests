/**
 * Emoji Rating Component
 * 5-option emoji rating bar for books
 */

import { useState } from 'react';

const RATINGS = [
  { value: 5, emoji: '😍', label: 'Love it!' },
  { value: 4, emoji: '🙂', label: 'Like it' },
  { value: 3, emoji: '😐', label: 'Neutral' },
  { value: 2, emoji: '😕', label: 'Meh' },
  { value: 1, emoji: '💩', label: 'Hate it' },
];

export default function EmojiRating({ currentRating, onRate, size = 'medium' }) {
  const [hoveredRating, setHoveredRating] = useState(null);
  
  const sizeClasses = {
    small: 'text-xl gap-2',
    medium: 'text-2xl gap-3',
    large: 'text-3xl gap-4',
  };

  return (
    <div className="flex flex-col items-center">
      <div className={`flex items-center ${sizeClasses[size]}`}>
        {RATINGS.map(({ value, emoji, label }) => {
          const isSelected = currentRating === value;
          const isHovered = hoveredRating === value;
          
          return (
            <button
              key={value}
              onClick={() => onRate(value)}
              onMouseEnter={() => setHoveredRating(value)}
              onMouseLeave={() => setHoveredRating(null)}
              className={`
                transition-all duration-200 transform
                ${isSelected ? 'scale-125 drop-shadow-lg' : 'hover:scale-110'}
                ${!isSelected && !isHovered ? 'grayscale-[30%] opacity-70' : ''}
                focus:outline-none focus:ring-2 focus:ring-amber rounded-full p-1
              `}
              aria-label={label}
              title={label}
            >
              {emoji}
            </button>
          );
        })}
      </div>
      
      {/* Show label for hovered or selected rating */}
      <p className="text-sm text-warm-gray mt-2 h-5 transition-opacity">
        {(hoveredRating || currentRating) && 
          RATINGS.find(r => r.value === (hoveredRating || currentRating))?.label
        }
      </p>
    </div>
  );
}

export { RATINGS };
