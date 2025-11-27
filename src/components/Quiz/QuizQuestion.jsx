/**
 * Quiz Question Component
 * Single quiz question with answer options
 */

import { useState } from 'react';

export default function QuizQuestion({ question, selectedAnswer, onAnswer }) {
  const [hoveredOption, setHoveredOption] = useState(null);

  return (
    <div className="animate-fadeIn">
      {/* Question */}
      <h2 className="font-display text-2xl text-wood-dark mb-6 text-center leading-relaxed">
        {question.question}
      </h2>

      {/* Category badge */}
      <div className="flex justify-center mb-6">
        <span className="bg-sage/20 text-forest text-xs px-3 py-1 rounded-full uppercase tracking-wider font-semibold">
          {question.category}
        </span>
      </div>

      {/* Options */}
      <div className="space-y-3">
        {question.options.map((option, index) => {
          const isSelected = selectedAnswer === option.id;
          const isHovered = hoveredOption === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => onAnswer(option.id)}
              onMouseEnter={() => setHoveredOption(option.id)}
              onMouseLeave={() => setHoveredOption(null)}
              className={`
                w-full text-left p-4 rounded-xl transition-all duration-200
                border-2 
                ${isSelected 
                  ? 'border-wood bg-wood/10 shadow-md' 
                  : isHovered 
                    ? 'border-wood-light bg-parchment/50' 
                    : 'border-transparent bg-cream hover:bg-parchment/30'
                }
              `}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              <div className="flex items-center gap-4">
                {/* Selection indicator */}
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  transition-all duration-200
                  ${isSelected 
                    ? 'border-wood bg-wood' 
                    : 'border-wood-light'
                  }
                `}>
                  {isSelected && (
                    <span className="text-cream text-sm">✓</span>
                  )}
                </div>
                
                {/* Option text */}
                <span className={`
                  flex-1 font-medium
                  ${isSelected ? 'text-wood-dark' : 'text-bark'}
                `}>
                  {option.text}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
