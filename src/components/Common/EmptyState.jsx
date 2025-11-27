/**
 * Empty State Component
 * Friendly messages when content is empty
 */

export default function EmptyState({ 
  icon = '📚', 
  title = 'Nothing here yet!',
  message = 'Let\'s fill this space with something wonderful.',
  action,
  actionLabel,
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
      <span className="text-6xl mb-6 animate-bounce">{icon}</span>
      
      <h3 className="text-2xl font-display text-wood-dark mb-3">
        {title}
      </h3>
      
      <p className="text-warm-gray max-w-sm mb-6">
        {message}
      </p>
      
      {action && (
        <button 
          onClick={action}
          className="btn-primary flex items-center gap-2"
        >
          {actionLabel || 'Get Started'}
          <span>🌿</span>
        </button>
      )}
    </div>
  );
}
