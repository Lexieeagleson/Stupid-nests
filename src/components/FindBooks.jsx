/**
 * Find Books Page Component
 * Options to take a new quiz or generate more recommendations
 */

import { useState, useCallback } from 'react';
import { Quiz } from './Quiz';
import { BookCarousel } from './Carousel';
import { LoadingSpinner, ErrorMessage } from './Common';
import { generateBookRecommendations, generateMoreBooks } from '../utils/aiService';
import { 
  saveRecommendations, 
  getRecommendations, 
  getUserPreferences,
  getRatingHistory,
  getSeenBooks 
} from '../utils/storage';

export default function FindBooks({ onComplete }) {
  const [view, setView] = useState('menu'); // 'menu' | 'quiz' | 'loading' | 'carousel'
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState(null);

  const hasPreferences = getUserPreferences() !== null;
  const previousRecs = getRecommendations();

  const handleQuizComplete = useCallback(async (answers) => {
    setView('loading');
    setError(null);
    
    try {
      const ratingHistory = getRatingHistory();
      const books = await generateBookRecommendations(answers, ratingHistory);
      saveRecommendations(books);
      setRecommendations(books);
      setView('carousel');
    } catch (err) {
      console.error('Failed to generate recommendations:', err);
      setError('Failed to generate recommendations. Please try again.');
      setView('menu');
    }
  }, []);

  const handleMoreBooks = useCallback(async () => {
    setView('loading');
    setError(null);
    
    try {
      const preferences = getUserPreferences();
      const ratingHistory = getRatingHistory();
      const seenBooks = getSeenBooks();
      
      const books = await generateMoreBooks(preferences, ratingHistory, seenBooks);
      saveRecommendations(books);
      setRecommendations(books);
      setView('carousel');
    } catch (err) {
      console.error('Failed to generate more books:', err);
      setError('Failed to generate more books. Please try again.');
      setView('menu');
    }
  }, []);

  const handleCarouselComplete = useCallback(() => {
    // Go back to menu or navigate somewhere
    setView('menu');
    if (onComplete) {
      onComplete();
    }
  }, [onComplete]);

  if (view === 'quiz') {
    return (
      <div className="py-4">
        <button
          onClick={() => setView('menu')}
          className="mb-4 text-warm-gray hover:text-wood-dark transition-colors flex items-center gap-2"
        >
          ← Back to options
        </button>
        <Quiz onComplete={handleQuizComplete} />
      </div>
    );
  }

  if (view === 'loading') {
    return <LoadingSpinner message="Finding your perfect books... ✨" />;
  }

  if (view === 'carousel' && recommendations.length > 0) {
    return (
      <div className="py-4">
        <div className="text-center mb-6">
          <h1 className="font-display text-3xl text-wood-dark mb-2">
            Your Book Recommendations 📚
          </h1>
          <p className="text-warm-gray">
            Swipe through to discover your next great read!
          </p>
        </div>
        <BookCarousel books={recommendations} onComplete={handleCarouselComplete} />
      </div>
    );
  }

  if (error) {
    return (
      <ErrorMessage 
        title="Something went wrong" 
        message={error}
        onRetry={() => setView('menu')}
      />
    );
  }

  // Menu view
  return (
    <div className="max-w-xl mx-auto py-8">
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-wood-dark mb-2">
          Find Your Next Read 🔍
        </h1>
        <p className="text-warm-gray">
          Let's discover some books you'll love!
        </p>
      </div>

      <div className="space-y-4">
        {/* Take a New Quiz */}
        <button
          onClick={() => setView('quiz')}
          className="w-full card-cozy p-6 text-left transition-all hover:shadow-lg group"
        >
          <div className="flex items-center gap-4">
            <span className="text-4xl group-hover:animate-bounce">📝</span>
            <div className="flex-1">
              <h3 className="font-display text-xl text-wood-dark mb-1">
                Take a New Quiz
              </h3>
              <p className="text-warm-gray text-sm">
                {hasPreferences 
                  ? 'Start fresh with a new set of questions'
                  : 'Answer questions about your reading preferences'
                }
              </p>
            </div>
            <span className="text-wood-light group-hover:text-wood transition-colors">
              →
            </span>
          </div>
        </button>

        {/* Generate More Books (only if they have preferences) */}
        {hasPreferences && (
          <button
            onClick={handleMoreBooks}
            className="w-full card-cozy p-6 text-left transition-all hover:shadow-lg group"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl group-hover:animate-bounce">✨</span>
              <div className="flex-1">
                <h3 className="font-display text-xl text-wood-dark mb-1">
                  Generate More Books
                </h3>
                <p className="text-warm-gray text-sm">
                  Get new recommendations based on your preferences and ratings
                </p>
              </div>
              <span className="text-wood-light group-hover:text-wood transition-colors">
                →
              </span>
            </div>
          </button>
        )}

        {/* View Previous Recommendations */}
        {previousRecs.length > 0 && (
          <button
            onClick={() => {
              setRecommendations(previousRecs);
              setView('carousel');
            }}
            className="w-full card-cozy p-6 text-left transition-all hover:shadow-lg group"
          >
            <div className="flex items-center gap-4">
              <span className="text-4xl group-hover:animate-bounce">📚</span>
              <div className="flex-1">
                <h3 className="font-display text-xl text-wood-dark mb-1">
                  View Previous Recommendations
                </h3>
                <p className="text-warm-gray text-sm">
                  Review your last {previousRecs.length} book recommendations
                </p>
              </div>
              <span className="text-wood-light group-hover:text-wood transition-colors">
                →
              </span>
            </div>
          </button>
        )}
      </div>
    </div>
  );
}
