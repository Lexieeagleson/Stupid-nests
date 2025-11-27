/**
 * Quiz Container Component
 * Manages quiz state and progression
 */

import { useState, useEffect, useCallback } from 'react';
import QuizQuestion from './QuizQuestion';
import { LoadingSpinner, ErrorMessage } from '../Common';
import { generateQuizQuestions } from '../../utils/aiService';
import { saveQuizQuestions, saveQuizAnswers, saveUserPreferences } from '../../utils/storage';

export default function Quiz({ onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const currentQuestion = questions[currentIndex];
  const progress = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;
  const isComplete = currentIndex >= questions.length - 1 && answers[currentQuestion?.id];

  // Fetch quiz questions on mount
  useEffect(() => {
    async function fetchQuestions() {
      try {
        setIsLoading(true);
        setError(null);
        const generatedQuestions = await generateQuizQuestions();
        setQuestions(generatedQuestions);
        saveQuizQuestions(generatedQuestions);
      } catch (err) {
        console.error('Failed to generate quiz questions:', err);
        setError('Failed to generate quiz questions. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }

    fetchQuestions();
  }, []);

  const handleAnswer = useCallback((answerId) => {
    const questionId = currentQuestion.id;
    const newAnswers = {
      ...answers,
      [questionId]: {
        questionId,
        question: currentQuestion.question,
        category: currentQuestion.category,
        answerId,
        answerText: currentQuestion.options.find(o => o.id === answerId)?.text,
      },
    };
    setAnswers(newAnswers);
    saveQuizAnswers(newAnswers);
  }, [answers, currentQuestion]);

  const handleNext = useCallback(() => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  }, [currentIndex, questions.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const handleComplete = useCallback(() => {
    // Compute user preferences from answers
    const preferences = Object.values(answers).reduce((acc, answer) => {
      if (!acc[answer.category]) {
        acc[answer.category] = [];
      }
      acc[answer.category].push(answer.answerText);
      return acc;
    }, {});

    saveUserPreferences(preferences);
    onComplete(answers, preferences);
  }, [answers, onComplete]);

  const handleRetry = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedQuestions = await generateQuizQuestions();
      setQuestions(generatedQuestions);
      setCurrentIndex(0);
      setAnswers({});
      saveQuizQuestions(generatedQuestions);
    } catch (err) {
      setError('Failed to generate quiz questions. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  if (isLoading) {
    return <LoadingSpinner message="Creating your personalized quiz... 📝" />;
  }

  if (error) {
    return <ErrorMessage title="Oops!" message={error} onRetry={handleRetry} />;
  }

  if (!currentQuestion) {
    return <ErrorMessage title="No questions available" onRetry={handleRetry} />;
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="font-display text-3xl text-wood-dark mb-2">
          Reading Preferences Quiz 📚
        </h1>
        <p className="text-warm-gray">
          Let's discover your perfect books!
        </p>
      </div>

      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex justify-between text-sm text-warm-gray mb-2">
          <span>Question {currentIndex + 1} of {questions.length}</span>
          <span>{Math.round(progress)}% complete</span>
        </div>
        <div className="h-2 bg-parchment rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-wood-light to-wood rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Question */}
      <div className="card-cozy p-6 mb-6">
        <QuizQuestion
          question={currentQuestion}
          selectedAnswer={answers[currentQuestion.id]?.answerId}
          onAnswer={handleAnswer}
        />
      </div>

      {/* Navigation */}
      <div className="flex justify-between gap-4">
        <button
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
            transition-all duration-200
            ${currentIndex === 0 
              ? 'bg-parchment/50 text-warm-gray/50 cursor-not-allowed' 
              : 'btn-secondary'
            }
          `}
        >
          ← Back
        </button>

        {isComplete ? (
          <button
            onClick={handleComplete}
            className="btn-primary flex items-center gap-2 px-6 py-3"
          >
            Get My Recommendations! 🎉
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!answers[currentQuestion.id]}
            className={`
              flex items-center gap-2 px-6 py-3 rounded-lg font-semibold
              transition-all duration-200
              ${!answers[currentQuestion.id]
                ? 'bg-parchment/50 text-warm-gray/50 cursor-not-allowed'
                : 'btn-primary'
              }
            `}
          >
            Next →
          </button>
        )}
      </div>
    </div>
  );
}
