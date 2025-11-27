/**
 * Cozy Library Treehouse - Main App Component
 * A book recommendation app with a warm, cozy theme
 */

import { useState, useCallback } from 'react';
import { Navigation } from './components/Navigation';
import { Bookshelf } from './components/Bookshelf';
import { Social } from './components/Social';
import Home from './components/Home';
import FindBooks from './components/FindBooks';
import { getBookshelf } from './utils/storage';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [bookshelfCount, setBookshelfCount] = useState(getBookshelf().length);

  const handleNavigate = useCallback((page) => {
    setCurrentPage(page);
    // Refresh bookshelf count when navigating
    setBookshelfCount(getBookshelf().length);
  }, []);

  const handleStartQuiz = useCallback(() => {
    setCurrentPage('find');
  }, []);

  const handleFindBooks = useCallback(() => {
    setCurrentPage('find');
  }, []);

  const refreshBookshelfCount = useCallback(() => {
    setBookshelfCount(getBookshelf().length);
  }, []);

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <Home onStartQuiz={handleStartQuiz} />;
      case 'bookshelf':
        return <Bookshelf onFindBooks={handleFindBooks} />;
      case 'find':
        return <FindBooks onComplete={refreshBookshelfCount} />;
      case 'social':
        return <Social />;
      default:
        return <Home onStartQuiz={handleStartQuiz} />;
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Navigation sidebar */}
      <Navigation 
        currentPage={currentPage} 
        onNavigate={handleNavigate}
        bookshelfCount={bookshelfCount}
      />

      {/* Main content area */}
      <main className="flex-1 min-h-screen lg:ml-0 pt-16 lg:pt-0">
        <div className="p-4 md:p-8 max-w-4xl mx-auto">
          {renderPage()}
        </div>

        {/* Footer */}
        <footer className="border-t border-wood-light/20 mt-auto py-6 text-center">
          <p className="text-warm-gray text-sm">
            Made with 📚 and ☕ in a cozy treehouse
          </p>
        </footer>
      </main>
    </div>
  );
}

export default App;
