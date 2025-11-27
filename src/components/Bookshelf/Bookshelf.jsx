/**
 * Bookshelf Component
 * Displays saved books with ratings and management options
 */

import { useState, useCallback } from 'react';
import { EmptyState } from '../Common';
import { EmojiRating, RATINGS } from '../Rating';
import { getBookshelf, removeFromBookshelf, getRatingForBook, saveRating } from '../../utils/storage';

export default function Bookshelf({ onFindBooks }) {
  const [books, setBooks] = useState(getBookshelf());
  const [confirmDelete, setConfirmDelete] = useState(null);

  const handleRemove = useCallback((bookId) => {
    const updatedBooks = removeFromBookshelf(bookId);
    setBooks(updatedBooks);
    setConfirmDelete(null);
  }, []);

  const handleRating = useCallback((bookId, rating, bookDetails) => {
    saveRating(bookId, rating, bookDetails);
    // Force re-render
    setBooks([...getBookshelf()]);
  }, []);

  if (books.length === 0) {
    return (
      <EmptyState
        icon="📚"
        title="Your bookshelf is feeling empty..."
        message="Let's fill it with some amazing reads! Take the quiz to discover books you'll love. 🌿"
        action={onFindBooks}
        actionLabel="Find Books"
      />
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-wood-dark mb-2">
          Your Bookshelf 📚
        </h1>
        <p className="text-warm-gray">
          {books.length} book{books.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {/* Books grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {books.map((book, index) => {
          const rating = getRatingForBook(book.id);
          const ratingLabel = RATINGS.find(r => r.value === rating);
          
          return (
            <div 
              key={book.id}
              className="card-cozy p-4 animate-fadeIn"
              style={{ animationDelay: `${index * 50}ms` }}
            >
              <div className="flex gap-4">
                {/* Book cover */}
                <div className="flex-shrink-0">
                  <img
                    src={book.coverUrl || 'https://via.placeholder.com/80x120?text=📖'}
                    alt={book.title}
                    className="w-20 h-30 object-cover rounded-lg shadow-md"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="80" height="120" viewBox="0 0 80 120">
                          <rect fill="#D4A373" width="80" height="120"/>
                          <rect fill="#6B4E31" x="4" y="4" width="72" height="112" rx="2"/>
                          <text x="40" y="60" fill="#F5E6C4" font-size="24" text-anchor="middle">📚</text>
                        </svg>
                      `);
                    }}
                  />
                </div>

                {/* Book info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-display text-lg text-wood-dark leading-tight mb-1 truncate">
                    {book.title}
                  </h3>
                  <p className="text-warm-gray text-sm mb-2">
                    by {book.author}
                  </p>

                  {/* Rating */}
                  <div className="mb-3">
                    {rating ? (
                      <span className="text-sm text-warm-gray">
                        Your rating: {ratingLabel?.emoji} {ratingLabel?.label}
                      </span>
                    ) : (
                      <div className="transform scale-75 origin-left -ml-2">
                        <EmojiRating
                          currentRating={rating}
                          onRate={(value) => handleRating(book.id, value, { title: book.title, author: book.author })}
                          size="small"
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    {confirmDelete === book.id ? (
                      <>
                        <button
                          onClick={() => handleRemove(book.id)}
                          className="text-xs px-3 py-1 rounded bg-sunset text-white"
                        >
                          Confirm Remove
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="text-xs px-3 py-1 rounded bg-parchment text-bark"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(book.id)}
                        className="text-xs px-3 py-1 rounded bg-parchment/50 text-warm-gray hover:bg-parchment transition-colors"
                      >
                        Remove from shelf
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Saved date */}
              <p className="text-xs text-warm-gray/60 mt-3 text-right">
                Added {new Date(book.savedAt).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Find more books button */}
      <div className="mt-8 text-center">
        <button onClick={onFindBooks} className="btn-primary">
          Find More Books 📖
        </button>
      </div>
    </div>
  );
}
