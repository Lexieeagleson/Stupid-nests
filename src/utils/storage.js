/**
 * Local Storage Utility for Cozy Library Treehouse
 * 
 * Handles all data persistence using localStorage with IndexedDB fallback.
 */

const STORAGE_KEYS = {
  QUIZ_QUESTIONS: 'cozy_treehouse_quiz_questions',
  QUIZ_ANSWERS: 'cozy_treehouse_quiz_answers',
  RECOMMENDATIONS: 'cozy_treehouse_recommendations',
  BOOKSHELF: 'cozy_treehouse_bookshelf',
  RATINGS: 'cozy_treehouse_ratings',
  USER_PREFERENCES: 'cozy_treehouse_preferences',
  SOCIAL_MESSAGES: 'cozy_treehouse_social',
  ALL_SEEN_BOOKS: 'cozy_treehouse_seen_books',
};

/**
 * Generic storage wrapper with error handling
 */
const storage = {
  get: (key) => {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error(`Error reading from storage (${key}):`, error);
      return null;
    }
  },
  
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (error) {
      console.error(`Error writing to storage (${key}):`, error);
      return false;
    }
  },
  
  remove: (key) => {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      console.error(`Error removing from storage (${key}):`, error);
      return false;
    }
  },
  
  clear: () => {
    try {
      Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
      return true;
    } catch (error) {
      console.error('Error clearing storage:', error);
      return false;
    }
  },
};

// Quiz Questions
export const saveQuizQuestions = (questions) => 
  storage.set(STORAGE_KEYS.QUIZ_QUESTIONS, questions);

export const getQuizQuestions = () => 
  storage.get(STORAGE_KEYS.QUIZ_QUESTIONS) || [];

// Quiz Answers
export const saveQuizAnswers = (answers) => 
  storage.set(STORAGE_KEYS.QUIZ_ANSWERS, answers);

export const getQuizAnswers = () => 
  storage.get(STORAGE_KEYS.QUIZ_ANSWERS) || {};

// User Preferences (computed from quiz answers)
export const saveUserPreferences = (preferences) => 
  storage.set(STORAGE_KEYS.USER_PREFERENCES, preferences);

export const getUserPreferences = () => 
  storage.get(STORAGE_KEYS.USER_PREFERENCES) || null;

// Book Recommendations
export const saveRecommendations = (recommendations) => {
  // Also track seen books
  const seenBooks = getSeenBooks();
  const newSeen = recommendations.map(book => ({
    id: book.id,
    title: book.title,
    author: book.author,
  }));
  saveSeenBooks([...seenBooks, ...newSeen]);
  
  return storage.set(STORAGE_KEYS.RECOMMENDATIONS, recommendations);
};

export const getRecommendations = () => 
  storage.get(STORAGE_KEYS.RECOMMENDATIONS) || [];

export const clearRecommendations = () => 
  storage.remove(STORAGE_KEYS.RECOMMENDATIONS);

// Seen Books (to avoid duplicates)
export const saveSeenBooks = (books) => 
  storage.set(STORAGE_KEYS.ALL_SEEN_BOOKS, books);

export const getSeenBooks = () => 
  storage.get(STORAGE_KEYS.ALL_SEEN_BOOKS) || [];

// Bookshelf (liked/saved books)
export const saveToBookshelf = (book) => {
  const bookshelf = getBookshelf();
  const exists = bookshelf.some(b => b.id === book.id);
  if (!exists) {
    const updatedBookshelf = [...bookshelf, { ...book, savedAt: Date.now() }];
    storage.set(STORAGE_KEYS.BOOKSHELF, updatedBookshelf);
    return updatedBookshelf;
  }
  return bookshelf;
};

export const removeFromBookshelf = (bookId) => {
  const bookshelf = getBookshelf();
  const updatedBookshelf = bookshelf.filter(book => book.id !== bookId);
  storage.set(STORAGE_KEYS.BOOKSHELF, updatedBookshelf);
  return updatedBookshelf;
};

export const getBookshelf = () => 
  storage.get(STORAGE_KEYS.BOOKSHELF) || [];

export const isBookOnShelf = (bookId) => {
  const bookshelf = getBookshelf();
  return bookshelf.some(book => book.id === bookId);
};

// Ratings
export const saveRating = (bookId, rating, bookDetails) => {
  const ratings = getRatings();
  const updatedRatings = {
    ...ratings,
    [bookId]: {
      rating,
      ratedAt: Date.now(),
      book: bookDetails,
    },
  };
  storage.set(STORAGE_KEYS.RATINGS, updatedRatings);
  return updatedRatings;
};

export const getRatings = () => 
  storage.get(STORAGE_KEYS.RATINGS) || {};

export const getRatingForBook = (bookId) => {
  const ratings = getRatings();
  return ratings[bookId]?.rating || null;
};

export const getRatingHistory = () => {
  const ratings = getRatings();
  return Object.entries(ratings).map(([bookId, data]) => ({
    bookId,
    ...data,
  }));
};

// Social Messages
export const saveSocialMessage = (message) => {
  const messages = getSocialMessages();
  const newMessage = {
    ...message,
    id: `msg_${Date.now()}`,
    sentAt: Date.now(),
  };
  const updatedMessages = [...messages, newMessage];
  storage.set(STORAGE_KEYS.SOCIAL_MESSAGES, updatedMessages);
  return updatedMessages;
};

export const getSocialMessages = () => 
  storage.get(STORAGE_KEYS.SOCIAL_MESSAGES) || [];

export const getReceivedMessages = (username) => {
  const messages = getSocialMessages();
  return messages.filter(msg => msg.toUser === username);
};

// Export all storage utilities
export default {
  ...storage,
  STORAGE_KEYS,
  // Quiz
  saveQuizQuestions,
  getQuizQuestions,
  saveQuizAnswers,
  getQuizAnswers,
  // Preferences
  saveUserPreferences,
  getUserPreferences,
  // Recommendations
  saveRecommendations,
  getRecommendations,
  clearRecommendations,
  // Seen Books
  saveSeenBooks,
  getSeenBooks,
  // Bookshelf
  saveToBookshelf,
  removeFromBookshelf,
  getBookshelf,
  isBookOnShelf,
  // Ratings
  saveRating,
  getRatings,
  getRatingForBook,
  getRatingHistory,
  // Social
  saveSocialMessage,
  getSocialMessages,
  getReceivedMessages,
};
