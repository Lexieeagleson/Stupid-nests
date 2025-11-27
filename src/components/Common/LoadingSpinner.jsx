/**
 * Loading Spinner Component
 * Cozy treehouse themed loading animation
 */

export default function LoadingSpinner({ message = 'Loading...' }) {
  return (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="relative">
        {/* Book stack animation */}
        <div className="flex flex-col items-center animate-pulse">
          <div className="w-12 h-2 bg-wood-light rounded-sm mb-1 animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-14 h-2 bg-wood rounded-sm mb-1 animate-bounce" style={{ animationDelay: '100ms' }} />
          <div className="w-16 h-2 bg-wood-dark rounded-sm mb-1 animate-bounce" style={{ animationDelay: '200ms' }} />
          <div className="w-14 h-2 bg-sage rounded-sm mb-1 animate-bounce" style={{ animationDelay: '300ms' }} />
          <div className="w-12 h-2 bg-moss rounded-sm animate-bounce" style={{ animationDelay: '400ms' }} />
        </div>
        
        {/* Decorative leaves */}
        <span className="absolute -left-4 -top-2 text-2xl animate-bounce" style={{ animationDelay: '500ms' }}>🌿</span>
        <span className="absolute -right-4 -bottom-2 text-2xl animate-bounce" style={{ animationDelay: '700ms' }}>🍃</span>
      </div>
      
      <p className="mt-6 text-warm-gray font-body text-lg animate-pulse">
        {message}
      </p>
    </div>
  );
}
