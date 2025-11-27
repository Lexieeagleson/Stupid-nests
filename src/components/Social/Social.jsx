/**
 * Social Component
 * Send book recommendations to friends
 */

import { useState, useCallback } from 'react';
import { EmptyState } from '../Common';
import { getBookshelf, saveSocialMessage, getSocialMessages } from '../../utils/storage';

export default function Social() {
  const [view, setView] = useState('send'); // 'send' | 'sent' | 'received'
  const [selectedBook, setSelectedBook] = useState(null);
  const [friendUsername, setFriendUsername] = useState('');
  const [note, setNote] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  
  const bookshelf = getBookshelf();
  const sentMessages = getSocialMessages().filter(m => m.fromUser === 'me');

  const handleSend = useCallback(() => {
    if (!selectedBook || !friendUsername.trim()) return;
    
    setIsSending(true);
    
    // Simulate sending (in real app, this would be an API call)
    setTimeout(() => {
      saveSocialMessage({
        fromUser: 'me',
        toUser: friendUsername.trim(),
        book: {
          id: selectedBook.id,
          title: selectedBook.title,
          author: selectedBook.author,
          coverUrl: selectedBook.coverUrl,
        },
        note: note.trim(),
      });
      
      setIsSending(false);
      setSentSuccess(true);
      
      // Reset form after delay
      setTimeout(() => {
        setSelectedBook(null);
        setFriendUsername('');
        setNote('');
        setSentSuccess(false);
      }, 2000);
    }, 1000);
  }, [selectedBook, friendUsername, note]);

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-wood-dark mb-2">
          Share the Love 💌
        </h1>
        <p className="text-warm-gray">
          Send a book recommendation to a friend
        </p>
      </div>

      {/* Tab navigation */}
      <div className="flex justify-center gap-2 mb-8">
        <button
          onClick={() => setView('send')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            view === 'send' ? 'bg-wood text-cream' : 'bg-parchment text-bark'
          }`}
        >
          Send a Book
        </button>
        <button
          onClick={() => setView('sent')}
          className={`px-4 py-2 rounded-lg font-medium transition-all ${
            view === 'sent' ? 'bg-wood text-cream' : 'bg-parchment text-bark'
          }`}
        >
          Sent ({sentMessages.length})
        </button>
      </div>

      {view === 'send' ? (
        <div className="card-cozy p-6">
          {bookshelf.length === 0 ? (
            <EmptyState
              icon="📚"
              title="No books to share yet"
              message="Add some books to your bookshelf first, then come back to share them!"
            />
          ) : sentSuccess ? (
            <div className="text-center py-8 animate-fadeIn">
              <span className="text-6xl mb-4 block">🎉</span>
              <h3 className="font-display text-2xl text-wood-dark mb-2">
                Recommendation Sent!
              </h3>
              <p className="text-warm-gray">
                Your friend will love this book!
              </p>
            </div>
          ) : (
            <>
              {/* Step 1: Select a book */}
              <div className="mb-6">
                <h3 className="font-semibold text-wood-dark mb-3">
                  1. Pick a book from your shelf
                </h3>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                  {bookshelf.map((book) => (
                    <button
                      key={book.id}
                      onClick={() => setSelectedBook(book)}
                      className={`
                        relative p-2 rounded-lg transition-all
                        ${selectedBook?.id === book.id 
                          ? 'bg-wood/10 ring-2 ring-wood' 
                          : 'bg-parchment/30 hover:bg-parchment/50'
                        }
                      `}
                    >
                      <img
                        src={book.coverUrl || 'https://via.placeholder.com/60x90?text=📖'}
                        alt={book.title}
                        className="w-full h-auto rounded shadow-sm"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml,' + encodeURIComponent(`
                            <svg xmlns="http://www.w3.org/2000/svg" width="60" height="90" viewBox="0 0 60 90">
                              <rect fill="#D4A373" width="60" height="90"/>
                              <rect fill="#6B4E31" x="3" y="3" width="54" height="84" rx="2"/>
                              <text x="30" y="45" fill="#F5E6C4" font-size="18" text-anchor="middle">📚</text>
                            </svg>
                          `);
                        }}
                      />
                      {selectedBook?.id === book.id && (
                        <div className="absolute top-1 right-1 bg-wood text-cream w-5 h-5 rounded-full flex items-center justify-center text-xs">
                          ✓
                        </div>
                      )}
                    </button>
                  ))}
                </div>
                {selectedBook && (
                  <p className="mt-2 text-sm text-warm-gray">
                    Selected: <span className="font-medium text-wood-dark">{selectedBook.title}</span>
                  </p>
                )}
              </div>

              {/* Step 2: Enter friend's username */}
              <div className="mb-6">
                <h3 className="font-semibold text-wood-dark mb-3">
                  2. Enter your friend's username or email
                </h3>
                <input
                  type="text"
                  value={friendUsername}
                  onChange={(e) => setFriendUsername(e.target.value)}
                  placeholder="username or email@example.com"
                  className="w-full px-4 py-3 rounded-lg border-2 border-wood-light/30 bg-cream focus:border-wood focus:outline-none transition-colors"
                />
              </div>

              {/* Step 3: Add a note */}
              <div className="mb-6">
                <h3 className="font-semibold text-wood-dark mb-3">
                  3. Add a personal note (optional)
                </h3>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="I thought you'd love this book because..."
                  rows={3}
                  className="w-full px-4 py-3 rounded-lg border-2 border-wood-light/30 bg-cream focus:border-wood focus:outline-none transition-colors resize-none"
                />
              </div>

              {/* Send button */}
              <button
                onClick={handleSend}
                disabled={!selectedBook || !friendUsername.trim() || isSending}
                className={`
                  w-full py-3 rounded-lg font-semibold transition-all
                  ${!selectedBook || !friendUsername.trim() || isSending
                    ? 'bg-parchment text-warm-gray/50 cursor-not-allowed'
                    : 'btn-primary'
                  }
                `}
              >
                {isSending ? 'Sending...' : 'Send Recommendation 💌'}
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="card-cozy p-6">
          {sentMessages.length === 0 ? (
            <EmptyState
              icon="💌"
              title="No recommendations sent yet"
              message="Share the joy of reading with your friends!"
            />
          ) : (
            <div className="space-y-4">
              {sentMessages.map((message) => (
                <div 
                  key={message.id}
                  className="flex gap-4 p-4 bg-parchment/30 rounded-lg"
                >
                  <img
                    src={message.book.coverUrl || 'https://via.placeholder.com/50x75?text=📖'}
                    alt={message.book.title}
                    className="w-12 h-18 object-cover rounded shadow-sm"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml,' + encodeURIComponent(`
                        <svg xmlns="http://www.w3.org/2000/svg" width="50" height="75" viewBox="0 0 50 75">
                          <rect fill="#D4A373" width="50" height="75"/>
                          <text x="25" y="40" fill="#F5E6C4" font-size="16" text-anchor="middle">📚</text>
                        </svg>
                      `);
                    }}
                  />
                  <div className="flex-1">
                    <p className="font-medium text-wood-dark">
                      {message.book.title}
                    </p>
                    <p className="text-sm text-warm-gray">
                      Sent to: {message.toUser}
                    </p>
                    {message.note && (
                      <p className="text-sm text-bark mt-1 italic">
                        "{message.note}"
                      </p>
                    )}
                    <p className="text-xs text-warm-gray/60 mt-2">
                      {new Date(message.sentAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
