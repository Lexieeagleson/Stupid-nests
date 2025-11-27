/**
 * Book Card Component
 * Displays book information with cover, summary, and rating
 */

import { useState, useCallback } from 'react';
import { useDoubleTap } from '../../hooks';
import { EmojiRating } from '../Rating';
import { saveToBookshelf, isBookOnShelf, saveRating, getRatingForBook } from '../../utils/storage';

export default function BookCard({ book, onBookshelfAdd, onRate, showFullDetails = false }) {
  const [isOnShelf, setIsOnShelf] = useState(isBookOnShelf(book.id));
  const [rating, setRating] = useState(getRatingForBook(book.id));
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);
  const [imageError, setImageError] = useState(false);

  const handleDoubleTap = useCallback(() => {
    if (!isOnShelf) {
      const updatedShelf = saveToBookshelf(book);
      setIsOnShelf(true);
      setShowHeartAnimation(true);
      
      setTimeout(() => setShowHeartAnimation(false), 1000);
      
      if (onBookshelfAdd) {
        onBookshelfAdd(book, updatedShelf);
      }
    }
  }, [book, isOnShelf, onBookshelfAdd]);

  const doubleTapHandler = useDoubleTap(handleDoubleTap);

  const handleRating = (value) => {
    setRating(value);
    saveRating(book.id, value, { title: book.title, author: book.author });
    
    if (onRate) {
      onRate(book.id, value);
    }
  };

  const placeholderCover = 'data:image/svg+xml,' + encodeURIComponent(`
    <svg xmlns="http://www.w3.org/2000/svg" width="200" height="300" viewBox="0 0 200 300">
      <rect fill="#D4A373" width="200" height="300"/>
      <rect fill="#6B4E31" x="10" y="10" width="180" height="280" rx="5"/>
      <text x="100" y="140" fill="#F5E6C4" font-size="40" text-anchor="middle">📚</text>
      <text x="100" y="180" fill="#F5E6C4" font-size="12" text-anchor="middle" font-family="serif">Book Cover</text>
    </svg>
  `);

  return (
    <div 
      className={`
        card-cozy relative overflow-hidden select-none
        ${showFullDetails ? 'p-6' : 'p-4'}
      `}
      onClick={doubleTapHandler}
    >
      {/* Heart animation on double-tap */}
      {showHeartAnimation && (
        <div className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none">
          <span className="text-6xl animate-ping">❤️</span>
        </div>
      )}

      {/* Bookshelf badge */}
      {isOnShelf && (
        <div className="absolute top-3 right-3 z-10">
          <span className="bg-amber text-white text-xs px-2 py-1 rounded-full font-semibold shadow-md">
            📚 On Shelf
          </span>
        </div>
      )}

      {/* Book Cover */}
      <div className="flex justify-center mb-4">
        <div className="relative">
          <img
            src={imageError ? placeholderCover : (book.coverUrl || placeholderCover)}
            alt={`Cover of ${book.title}`}
            className="w-48 h-72 object-cover rounded-lg shadow-lg"
            onError={() => setImageError(true)}
          />
          {/* Book spine effect */}
          <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/20 to-transparent rounded-l-lg" />
        </div>
      </div>

      {/* Book Title and Author */}
      <div className="text-center mb-4">
        <h3 className="font-display text-xl text-wood-dark mb-1 leading-tight">
          {book.title}
        </h3>
        <p className="text-warm-gray font-medium">
          by {book.author}
        </p>
      </div>

      {/* Plot Summary */}
      <div className="mb-4">
        <p className="text-bark leading-relaxed text-sm">
          {book.summary}
        </p>
      </div>

      {/* Why You'll Like This */}
      <div className="bg-parchment/50 rounded-lg p-3 mb-4">
        <p className="text-xs uppercase tracking-wider text-warm-gray mb-1 font-semibold">
          Why you'll love this ✨
        </p>
        <p className="text-wood-dark text-sm italic">
          "{book.whyYoullLike}"
        </p>
      </div>

      {/* Rating Section */}
      <div className="border-t border-wood-light/20 pt-4">
        <p className="text-xs uppercase tracking-wider text-warm-gray mb-2 text-center font-semibold">
          Rate this book
        </p>
        <EmojiRating 
          currentRating={rating} 
          onRate={handleRating} 
          size="medium"
        />
      </div>

      {/* Double-tap hint */}
      {!isOnShelf && (
        <p className="text-xs text-center text-warm-gray/60 mt-3">
          Double-tap to add to your bookshelf ❤️
        </p>
      )}
    </div>
  );
}
