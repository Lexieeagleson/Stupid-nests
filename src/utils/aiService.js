/**
 * AI Service for Cozy Library Treehouse
 * 
 * This module handles all AI interactions for quiz generation and book recommendations.
 * It's designed to be pluggable - you can swap out the AI provider by modifying the config.
 */

import AI_CONFIG, { 
  QUIZ_GENERATION_PROMPT, 
  BOOK_RECOMMENDATION_PROMPT,
  MORE_BOOKS_PROMPT 
} from '../config/ai';

/**
 * Makes a request to the AI API
 * @param {string} prompt - The prompt to send
 * @returns {Promise<string>} - The AI's response
 */
async function callAI(prompt) {
  // If no API key is configured, use mock data
  if (!AI_CONFIG.apiKey) {
    console.warn('No AI API key configured. Using mock data.');
    return null;
  }

  try {
    const response = await fetch(AI_CONFIG.apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${AI_CONFIG.apiKey}`,
      },
      body: JSON.stringify({
        model: AI_CONFIG.model,
        messages: [
          {
            role: 'system',
            content: 'You are a helpful librarian assistant that specializes in book recommendations. Always respond with valid JSON when asked for structured data.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        temperature: AI_CONFIG.temperature,
        max_tokens: AI_CONFIG.maxTokens,
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API error: ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content || null;
  } catch (error) {
    console.error('AI API call failed:', error);
    return null;
  }
}

/**
 * Parses JSON from AI response, handling markdown code blocks
 * @param {string} response - Raw AI response
 * @returns {Object|Array|null} - Parsed JSON or null
 */
function parseAIResponse(response) {
  if (!response) return null;
  
  try {
    // Try direct parse first
    return JSON.parse(response);
  } catch {
    // Try to extract JSON from markdown code blocks
    const jsonMatch = response.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonMatch) {
      try {
        return JSON.parse(jsonMatch[1].trim());
      } catch {
        console.error('Failed to parse JSON from code block');
      }
    }
    
    // Try to find JSON array or object in the response
    const arrayMatch = response.match(/\[[\s\S]*\]/);
    const objectMatch = response.match(/\{[\s\S]*\}/);
    
    if (arrayMatch) {
      try {
        return JSON.parse(arrayMatch[0]);
      } catch {
        console.error('Failed to parse array from response');
      }
    }
    
    if (objectMatch) {
      try {
        return JSON.parse(objectMatch[0]);
      } catch {
        console.error('Failed to parse object from response');
      }
    }
    
    return null;
  }
}

/**
 * Mock quiz questions for when AI is not configured
 */
const MOCK_QUIZ_QUESTIONS = [
  {
    id: 'q1',
    question: 'What genre makes your heart sing? 📚',
    category: 'genre',
    options: [
      { id: 'a', text: 'Epic Fantasy with magic and adventure' },
      { id: 'b', text: 'Mystery/Thriller that keeps me guessing' },
      { id: 'c', text: 'Contemporary Fiction with real emotions' },
      { id: 'd', text: 'Romance that makes me swoon' },
      { id: 'e', text: 'Science Fiction exploring new worlds' },
    ],
  },
  {
    id: 'q2',
    question: 'How do you like your story\'s pace?',
    category: 'pacing',
    options: [
      { id: 'a', text: 'Fast and action-packed - I love a page-turner!' },
      { id: 'b', text: 'Slow and contemplative - let me savor each moment' },
      { id: 'c', text: 'A balanced mix of both' },
    ],
  },
  {
    id: 'q3',
    question: 'What themes resonate with you most?',
    category: 'themes',
    options: [
      { id: 'a', text: 'Found family and chosen bonds' },
      { id: 'b', text: 'Redemption and second chances' },
      { id: 'c', text: 'Self-discovery and coming-of-age' },
      { id: 'd', text: 'Good vs. Evil and moral dilemmas' },
      { id: 'e', text: 'Love conquers all' },
    ],
  },
  {
    id: 'q4',
    question: 'What kind of protagonists do you root for?',
    category: 'characters',
    options: [
      { id: 'a', text: 'Noble heroes with strong morals' },
      { id: 'b', text: 'Morally gray characters with depth' },
      { id: 'c', text: 'Underdog characters defying the odds' },
      { id: 'd', text: 'Ensemble casts with diverse perspectives' },
    ],
  },
  {
    id: 'q5',
    question: 'What emotional tone do you prefer in your reads?',
    category: 'tone',
    options: [
      { id: 'a', text: 'Dark and gritty - bring on the feels' },
      { id: 'b', text: 'Hopeful and uplifting' },
      { id: 'c', text: 'Bittersweet - the best of both' },
      { id: 'd', text: 'Light and humorous' },
    ],
  },
  {
    id: 'q6',
    question: 'What writing style draws you in?',
    category: 'style',
    options: [
      { id: 'a', text: 'Lyrical, beautiful prose I can get lost in' },
      { id: 'b', text: 'Straightforward and accessible' },
      { id: 'c', text: 'Dialogue-heavy with snappy banter' },
      { id: 'd', text: 'Atmospheric and descriptive' },
    ],
  },
  {
    id: 'q7',
    question: 'Which tropes make you excited? ✨',
    category: 'tropes',
    options: [
      { id: 'a', text: 'Enemies to lovers' },
      { id: 'b', text: 'Chosen one with a destiny' },
      { id: 'c', text: 'Unreliable narrator' },
      { id: 'd', text: 'Hidden identity or secrets' },
      { id: 'e', text: 'Time travel or parallel worlds' },
    ],
  },
  {
    id: 'q8',
    question: 'Any dealbreakers for you?',
    category: 'dealbreakers',
    options: [
      { id: 'a', text: 'Excessive violence or gore' },
      { id: 'b', text: 'Cliffhanger endings' },
      { id: 'c', text: 'Love triangles' },
      { id: 'd', text: 'Sad or tragic endings' },
      { id: 'e', text: 'None - I\'m open to anything!' },
    ],
  },
  {
    id: 'q9',
    question: 'How long do you like your books?',
    category: 'length',
    options: [
      { id: 'a', text: 'Short and sweet (under 300 pages)' },
      { id: 'b', text: 'Just right (300-500 pages)' },
      { id: 'c', text: 'Epic tomes (500+ pages)' },
      { id: 'd', text: 'Length doesn\'t matter if it\'s good!' },
    ],
  },
  {
    id: 'q10',
    question: 'What setting calls to you?',
    category: 'setting',
    options: [
      { id: 'a', text: 'Medieval kingdoms and castles' },
      { id: 'b', text: 'Modern day cities' },
      { id: 'c', text: 'Future worlds and space' },
      { id: 'd', text: 'Small towns with big secrets' },
      { id: 'e', text: 'Historical periods' },
    ],
  },
  {
    id: 'q11',
    question: 'Do you prefer standalone books or series?',
    category: 'format',
    options: [
      { id: 'a', text: 'Standalones - give me closure!' },
      { id: 'b', text: 'Series - I love getting invested' },
      { id: 'c', text: 'Both work for me!' },
    ],
  },
  {
    id: 'q12',
    question: 'What made you love your last favorite book?',
    category: 'favorites',
    options: [
      { id: 'a', text: 'The plot twists had me gasping' },
      { id: 'b', text: 'Characters felt like real friends' },
      { id: 'c', text: 'The beautiful writing style' },
      { id: 'd', text: 'It made me think deeply' },
      { id: 'e', text: 'Pure entertainment and escapism' },
    ],
  },
];

/**
 * Mock book recommendations for when AI is not configured
 */
const MOCK_RECOMMENDATIONS = [
  {
    id: 'rec1',
    title: 'The House in the Cerulean Sea',
    author: 'TJ Klune',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781250217288-M.jpg',
    summary: 'A magical story about a caseworker who discovers a group of magical children and the mysterious man who cares for them. It\'s a cozy, heartwarming tale about found family and acceptance.',
    whyYoullLike: 'This book perfectly blends warmth, humor, and magical elements - ideal for readers who love feel-good stories with depth.',
  },
  {
    id: 'rec2',
    title: 'Piranesi',
    author: 'Susanna Clarke',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781635575637-M.jpg',
    summary: 'Piranesi lives in a labyrinthine House filled with endless halls and statues. As he explores his world, secrets begin to unravel that challenge everything he knows.',
    whyYoullLike: 'A beautifully atmospheric and mysterious read that rewards thoughtful readers who love to piece together puzzles.',
  },
  {
    id: 'rec3',
    title: 'Circe',
    author: 'Madeline Miller',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780316556347-M.jpg',
    summary: 'The goddess Circe, daughter of Helios, is born with the power of witchcraft. Banished to a deserted island, she hones her craft through encounters with famous figures of Greek mythology.',
    whyYoullLike: 'Lyrical prose meets compelling character development - perfect for lovers of mythology retold through a fresh perspective.',
  },
  {
    id: 'rec4',
    title: 'The Invisible Life of Addie LaRue',
    author: 'V.E. Schwab',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780765387561-M.jpg',
    summary: 'Addie LaRue makes a Faustian bargain to live forever but is cursed to be forgotten by everyone she meets. Until one day, someone remembers.',
    whyYoullLike: 'A sweeping tale spanning centuries with romantic elements and beautiful prose that will stay with you.',
  },
  {
    id: 'rec5',
    title: 'Project Hail Mary',
    author: 'Andy Weir',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780593135204-M.jpg',
    summary: 'An astronaut wakes up alone on a spaceship with no memory of who he is or why he\'s there. Earth\'s fate depends on him solving an impossible problem.',
    whyYoullLike: 'A thrilling sci-fi adventure with humor and heart - perfect for readers who love smart problem-solving and unlikely friendships.',
  },
  {
    id: 'rec6',
    title: 'The Night Circus',
    author: 'Erin Morgenstern',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780385534635-M.jpg',
    summary: 'A mysterious circus that only appears at night becomes the venue for a competition between two young magicians. As their rivalry deepens, so does their connection.',
    whyYoullLike: 'Atmospheric, romantic, and magical - this is the perfect book to get lost in on a cozy evening.',
  },
  {
    id: 'rec7',
    title: 'Anxious People',
    author: 'Fredrik Backman',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781501160837-M.jpg',
    summary: 'A failed bank robber accidentally takes hostages during an apartment viewing. What follows is a hilariously heartwarming tale about human connection.',
    whyYoullLike: 'Backman masterfully blends humor with genuine emotion - you\'ll laugh and cry, sometimes on the same page.',
  },
  {
    id: 'rec8',
    title: 'The Starless Sea',
    author: 'Erin Morgenstern',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780385541213-M.jpg',
    summary: 'A graduate student discovers a mysterious book that tells a story about him. His search for answers leads to an underground world of lost libraries and infinite stories.',
    whyYoullLike: 'A love letter to books and readers - perfect for anyone who dreams of getting lost in a library forever.',
  },
  {
    id: 'rec9',
    title: 'A Gentleman in Moscow',
    author: 'Amor Towles',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9780670026197-M.jpg',
    summary: 'A Russian count is sentenced to house arrest in a luxury hotel for the rest of his life. Over decades, he discovers that a life well-lived can be found in the smallest spaces.',
    whyYoullLike: 'Elegant prose and a charming protagonist make this a sophisticated yet cozy read about finding joy in constraints.',
  },
  {
    id: 'rec10',
    title: 'Red, White & Royal Blue',
    author: 'Casey McQuiston',
    coverUrl: 'https://covers.openlibrary.org/b/isbn/9781250316776-M.jpg',
    summary: 'The First Son of the United States and the Prince of Wales start as rivals before an unexpected romance blooms. A modern fairy tale with wit and heart.',
    whyYoullLike: 'Fun, romantic, and thoroughly entertaining - perfect for readers who love enemies-to-lovers with political intrigue.',
  },
];

/**
 * Generates quiz questions using AI or returns mock data
 * @returns {Promise<Array>} - Array of quiz questions
 */
export async function generateQuizQuestions() {
  const response = await callAI(QUIZ_GENERATION_PROMPT);
  const questions = parseAIResponse(response);
  
  if (questions && Array.isArray(questions) && questions.length > 0) {
    return questions;
  }
  
  // Return mock data if AI is not available
  console.log('Using mock quiz questions');
  return MOCK_QUIZ_QUESTIONS;
}

/**
 * Generates book recommendations based on quiz answers
 * @param {Object} answers - User's quiz answers
 * @param {Array} ratingHistory - User's previous book ratings
 * @returns {Promise<Array>} - Array of book recommendations
 */
export async function generateBookRecommendations(answers, ratingHistory = []) {
  const prompt = BOOK_RECOMMENDATION_PROMPT(answers, ratingHistory);
  const response = await callAI(prompt);
  const recommendations = parseAIResponse(response);
  
  if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
    // Add IDs if not present
    return recommendations.map((book, index) => ({
      ...book,
      id: book.id || `rec_${Date.now()}_${index}`,
    }));
  }
  
  // Return mock data if AI is not available
  console.log('Using mock book recommendations');
  return MOCK_RECOMMENDATIONS.map(book => ({
    ...book,
    id: `rec_${Date.now()}_${book.id}`,
  }));
}

/**
 * Generates more book recommendations based on existing preferences
 * @param {Object} preferences - User's reading preferences
 * @param {Array} ratingHistory - User's previous book ratings
 * @param {Array} previousRecommendations - Previously recommended books
 * @returns {Promise<Array>} - Array of new book recommendations
 */
export async function generateMoreBooks(preferences, ratingHistory, previousRecommendations) {
  const prompt = MORE_BOOKS_PROMPT(preferences, ratingHistory, previousRecommendations);
  const response = await callAI(prompt);
  const recommendations = parseAIResponse(response);
  
  if (recommendations && Array.isArray(recommendations) && recommendations.length > 0) {
    return recommendations.map((book, index) => ({
      ...book,
      id: book.id || `rec_${Date.now()}_${index}`,
    }));
  }
  
  // Return shuffled mock data with different IDs
  console.log('Using shuffled mock recommendations');
  const shuffled = [...MOCK_RECOMMENDATIONS].sort(() => Math.random() - 0.5);
  return shuffled.map((book, index) => ({
    ...book,
    id: `rec_more_${Date.now()}_${index}`,
    title: book.title, // Keep same titles for demo
  }));
}

export default {
  generateQuizQuestions,
  generateBookRecommendations,
  generateMoreBooks,
};
