/**
 * AI Configuration for Cozy Library Treehouse
 * 
 * This file contains the configuration for AI integrations.
 * Replace the placeholder API keys with your own when deploying.
 */

// AI Provider Configuration
// Supported: 'openai', 'anthropic', 'custom'
export const AI_CONFIG = {
  provider: 'openai',
  
  // API Configuration - Replace with your API key
  apiKey: import.meta.env.VITE_AI_API_KEY || '',
  
  // API Endpoint - For custom providers
  apiEndpoint: import.meta.env.VITE_AI_API_ENDPOINT || 'https://api.openai.com/v1/chat/completions',
  
  // Model to use
  model: import.meta.env.VITE_AI_MODEL || 'gpt-3.5-turbo',
  
  // Temperature for generation (0-1, higher = more creative)
  temperature: 0.7,
  
  // Max tokens for responses
  maxTokens: 2000,
};

// Quiz Generation Prompt
export const QUIZ_GENERATION_PROMPT = `Generate 12 multiple-choice questions to learn someone's reading preferences. Include questions about:
1. Genre preferences (fantasy, sci-fi, romance, mystery, literary fiction, etc.)
2. Pacing preferences (fast-paced action vs slow contemplative)
3. Themes they enjoy (found family, redemption, coming-of-age, etc.)
4. Character types they prefer (morally gray, heroes, antiheroes, ensemble casts)
5. Emotional tone (dark and gritty, hopeful and uplifting, bittersweet)
6. Writing style (lyrical prose, straightforward, dialogue-heavy)
7. Favorite tropes (enemies to lovers, chosen one, unreliable narrator)
8. Dealbreakers (violence level, romance content, cliffhangers)

Each question should have 3-5 answer choices. Return as a JSON array with this structure:
[
  {
    "id": "q1",
    "question": "What genre do you find yourself reaching for most?",
    "category": "genre",
    "options": [
      {"id": "a", "text": "Epic Fantasy with rich world-building"},
      {"id": "b", "text": "Contemporary Fiction with real-world issues"},
      {"id": "c", "text": "Mystery/Thriller that keeps me guessing"},
      {"id": "d", "text": "Romance that makes my heart flutter"}
    ]
  }
]`;

// Book Recommendation Prompt Template
export const BOOK_RECOMMENDATION_PROMPT = (answers, ratingHistory) => `Based on the user's reading preferences and their rating history, recommend 10 books that they will love.

User's Quiz Answers:
${JSON.stringify(answers, null, 2)}

${ratingHistory.length > 0 ? `User's Previous Ratings:
${JSON.stringify(ratingHistory, null, 2)}` : ''}

For each book, provide:
1. title - The book title
2. author - The author's name
3. coverUrl - A placeholder URL (use format: https://covers.openlibrary.org/b/isbn/ISBN-M.jpg or leave as "placeholder")
4. summary - A 2-3 sentence plot summary (no spoilers!)
5. whyYoullLike - A 1-2 sentence personalized explanation of why this reader will enjoy this book based on their preferences

Return as a JSON array with this structure:
[
  {
    "id": "rec1",
    "title": "The Name of the Wind",
    "author": "Patrick Rothfuss",
    "coverUrl": "https://covers.openlibrary.org/b/isbn/0756404746-M.jpg",
    "summary": "A renowned wizard tells his life story from humble beginnings to legendary status. Part coming-of-age, part mystery, it's a masterfully told tale of a man who became a myth.",
    "whyYoullLike": "Based on your love of fantasy with deep world-building and complex characters, this lyrical narrative will sweep you away."
  }
]`;

// More Books Prompt (uses existing preferences)
export const MORE_BOOKS_PROMPT = (preferences, ratingHistory, previousRecommendations) => `Generate 10 NEW book recommendations based on the user's preferences. Avoid recommending books they've already seen.

User Preferences Summary:
${JSON.stringify(preferences, null, 2)}

Rating History:
${JSON.stringify(ratingHistory, null, 2)}

Previously Recommended (DO NOT include these):
${previousRecommendations.map(b => b.title).join(', ')}

Return recommendations in the same JSON format as before.`;

export default AI_CONFIG;
