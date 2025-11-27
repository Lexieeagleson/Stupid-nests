/**
 * Book Carousel Component
 * Swipeable carousel for book recommendations
 */

import { useState, useCallback } from 'react';
import { useSwipe } from '../../hooks';
import { BookCard } from '../BookCard';

export default function BookCarousel({ books, onComplete }) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [swipeDirection, setSwipeDirection] = useState(null);

  const currentBook = books[currentIndex];
  const hasNext = currentIndex < books.length - 1;
  const hasPrev = currentIndex > 0;

  const goToNext = useCallback(() => {
    if (hasNext) {
      setSwipeDirection('left');
      setTimeout(() => {
        setCurrentIndex(prev => prev + 1);
        setSwipeDirection(null);
      }, 300);
    } else if (onComplete) {
      onComplete();
    }
  }, [hasNext, onComplete]);

  const goToPrev = useCallback(() => {
    if (hasPrev) {
      setSwipeDirection('right');
      setTimeout(() => {
        setCurrentIndex(prev => prev - 1);
        setSwipeDirection(null);
      }, 300);
    }
  }, [hasPrev]);

  const { handlers, isDragging, dragOffset } = useSwipe({
    onSwipeLeft: goToNext,
    onSwipeRight: goToPrev,
    threshold: 80,
  });

  const getCardStyle = () => {
    if (swipeDirection === 'left') {
      return { transform: 'translateX(-120%) rotate(-15deg)', opacity: 0, transition: 'all 0.3s ease-out' };
    }
    if (swipeDirection === 'right') {
      return { transform: 'translateX(120%) rotate(15deg)', opacity: 0, transition: 'all 0.3s ease-out' };
    }
    if (isDragging) {
      const rotation = dragOffset * 0.05;
      return { 
        transform: `translateX(${dragOffset}px) rotate(${rotation}deg)`,
        transition: 'none',
      };
    }
    return { transform: 'translateX(0) rotate(0)', transition: 'all 0.3s ease-out' };
  };

  if (!currentBook) {
    return null;
  }

  return (
    <div className="relative">
      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2 mb-6">
        {books.map((_, index) => (
          <div
            key={index}
            className={`
              h-2 rounded-full transition-all duration-300
              ${index === currentIndex ? 'w-8 bg-wood' : 'w-2 bg-wood-light/40'}
            `}
          />
        ))}
      </div>

      {/* Card counter */}
      <p className="text-center text-warm-gray mb-4 text-sm">
        {currentIndex + 1} of {books.length} books
      </p>

      {/* Carousel container */}
      <div 
        className="relative overflow-hidden"
        {...handlers}
      >
        <div 
          style={getCardStyle()}
          className="cursor-grab active:cursor-grabbing"
        >
          <BookCard book={currentBook} showFullDetails />
        </div>

        {/* Swipe hints */}
        <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 flex justify-between pointer-events-none px-2">
          {hasPrev && (
            <div className="bg-cream/80 rounded-full p-2 shadow-md animate-pulse">
              <span className="text-2xl">👈</span>
            </div>
          )}
          {!hasPrev && <div />}
          {hasNext && (
            <div className="bg-cream/80 rounded-full p-2 shadow-md animate-pulse">
              <span className="text-2xl">👉</span>
            </div>
          )}
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={goToPrev}
          disabled={!hasPrev}
          className={`
            flex items-center gap-2 px-4 py-2 rounded-lg font-semibold
            transition-all duration-200
            ${hasPrev 
              ? 'btn-secondary' 
              : 'bg-parchment/50 text-warm-gray/50 cursor-not-allowed'
            }
          `}
        >
          ← Previous
        </button>
        
        <button
          onClick={goToNext}
          className="btn-primary flex items-center gap-2"
        >
          {hasNext ? 'Next Book →' : 'Done! 🎉'}
        </button>
      </div>

      {/* Swipe instruction */}
      <p className="text-center text-xs text-warm-gray/60 mt-4">
        Swipe or drag the card to navigate
      </p>
    </div>
  );
}
