/**
 * Error Message Component
 * Friendly error display
 */

export default function ErrorMessage({ 
  title = 'Oops! Something went wrong',
  message,
  onRetry,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
      <span className="text-5xl mb-4">😅</span>
      
      <h3 className="text-xl font-display text-wood-dark mb-2">
        {title}
      </h3>
      
      {message && (
        <p className="text-warm-gray max-w-sm mb-6">
          {message}
        </p>
      )}
      
      {onRetry && (
        <button 
          onClick={onRetry}
          className="btn-secondary"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
