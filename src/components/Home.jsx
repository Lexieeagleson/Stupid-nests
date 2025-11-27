/**
 * Home Page Component
 * Welcome page with call to action
 */

export default function Home({ onStartQuiz }) {
  return (
    <div className="max-w-2xl mx-auto text-center py-8">
      {/* Hero section */}
      <div className="mb-12 animate-fadeIn">
        <span className="text-8xl mb-6 block">🌳📚</span>
        <h1 className="font-display text-4xl md:text-5xl text-wood-dark mb-4 leading-tight">
          Welcome to Your
          <br />
          <span className="text-amber">Cozy Library Treehouse</span>
        </h1>
        <p className="text-xl text-warm-gray max-w-lg mx-auto leading-relaxed">
          Nestled among the branches, discover your next favorite read with personalized book recommendations.
        </p>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6 mb-12">
        <div className="card-cozy p-6 animate-fadeIn" style={{ animationDelay: '100ms' }}>
          <span className="text-4xl mb-3 block">📝</span>
          <h3 className="font-display text-lg text-wood-dark mb-2">Take a Quiz</h3>
          <p className="text-warm-gray text-sm">
            Answer fun questions about your reading preferences
          </p>
        </div>
        
        <div className="card-cozy p-6 animate-fadeIn" style={{ animationDelay: '200ms' }}>
          <span className="text-4xl mb-3 block">✨</span>
          <h3 className="font-display text-lg text-wood-dark mb-2">Get Recommendations</h3>
          <p className="text-warm-gray text-sm">
            Discover 10 books perfectly matched to your taste
          </p>
        </div>
        
        <div className="card-cozy p-6 animate-fadeIn" style={{ animationDelay: '300ms' }}>
          <span className="text-4xl mb-3 block">❤️</span>
          <h3 className="font-display text-lg text-wood-dark mb-2">Build Your Shelf</h3>
          <p className="text-warm-gray text-sm">
            Save favorites and share with friends
          </p>
        </div>
      </div>

      {/* CTA */}
      <div className="animate-fadeIn" style={{ animationDelay: '400ms' }}>
        <button
          onClick={onStartQuiz}
          className="btn-primary text-lg px-8 py-4 animate-pulse"
        >
          Start the Quiz 🌿
        </button>
        <p className="text-warm-gray text-sm mt-4">
          Takes about 2 minutes • Completely free
        </p>
      </div>

      {/* Decorative elements */}
      <div className="mt-16 flex justify-center gap-8 text-5xl opacity-30">
        <span>🍃</span>
        <span>📖</span>
        <span>☕</span>
        <span>🌙</span>
        <span>🍂</span>
      </div>
    </div>
  );
}
