/**
 * Navigation Component
 * Side menu with navigation options
 */

import { useState } from 'react';

const MENU_ITEMS = [
  { id: 'home', label: 'Home', icon: '🏠', description: 'Welcome page' },
  { id: 'bookshelf', label: 'Your Bookshelf', icon: '📚', description: 'Saved books' },
  { id: 'find', label: 'Find Books', icon: '🔍', description: 'Discover new reads' },
  { id: 'social', label: 'Social', icon: '💌', description: 'Share with friends' },
];

export default function Navigation({ currentPage, onNavigate, bookshelfCount = 0 }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleNavigate = (pageId) => {
    onNavigate(pageId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile hamburger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 left-4 z-40 p-2 bg-cream rounded-lg shadow-md lg:hidden"
        aria-label="Open menu"
      >
        <svg className="w-6 h-6 text-wood-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Overlay for mobile */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/30 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-72 bg-cream z-50
        transform transition-transform duration-300 ease-out
        lg:translate-x-0 lg:static lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        shadow-xl lg:shadow-none
        border-r border-wood-light/20
      `}>
        {/* Header */}
        <div className="p-6 border-b border-wood-light/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🌳</span>
              <div>
                <h1 className="font-display text-xl text-wood-dark leading-tight">
                  Cozy Library
                </h1>
                <p className="text-xs text-warm-gray">Treehouse</p>
              </div>
            </div>
            
            {/* Close button for mobile */}
            <button
              onClick={() => setIsOpen(false)}
              className="lg:hidden p-1 rounded-full hover:bg-parchment"
              aria-label="Close menu"
            >
              <svg className="w-5 h-5 text-warm-gray" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Navigation items */}
        <nav className="p-4">
          <ul className="space-y-2">
            {MENU_ITEMS.map((item) => {
              const isActive = currentPage === item.id;
              const showBadge = item.id === 'bookshelf' && bookshelfCount > 0;
              
              return (
                <li key={item.id}>
                  <button
                    onClick={() => handleNavigate(item.id)}
                    className={`
                      w-full flex items-center gap-3 p-3 rounded-xl
                      transition-all duration-200
                      ${isActive 
                        ? 'bg-wood/10 text-wood-dark' 
                        : 'text-bark hover:bg-parchment/50'
                      }
                    `}
                  >
                    <span className="text-2xl">{item.icon}</span>
                    <div className="flex-1 text-left">
                      <p className={`font-medium ${isActive ? 'text-wood-dark' : ''}`}>
                        {item.label}
                      </p>
                      <p className="text-xs text-warm-gray">
                        {item.description}
                      </p>
                    </div>
                    {showBadge && (
                      <span className="bg-amber text-white text-xs px-2 py-0.5 rounded-full">
                        {bookshelfCount}
                      </span>
                    )}
                    {isActive && (
                      <div className="w-1 h-8 bg-wood rounded-full" />
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Decorative footer */}
        <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-wood-light/20">
          <div className="flex items-center gap-2 text-warm-gray text-sm">
            <span>🍃</span>
            <span>Happy reading!</span>
            <span>📖</span>
          </div>
        </div>
      </aside>
    </>
  );
}
