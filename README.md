# 🌳📚 Cozy Library Treehouse

A cozy, personalized book recommendation app with a warm treehouse theme. Take a quiz to discover your reading preferences, get AI-powered book recommendations, and build your personal bookshelf!

![Cozy Library Treehouse](https://img.shields.io/badge/Made%20with-React-61DAFB?style=flat-square&logo=react)
![Vite](https://img.shields.io/badge/Built%20with-Vite-646CFF?style=flat-square&logo=vite)

## ✨ Features

- **📝 Dynamic Quiz**: Take a personalized quiz about your reading preferences
- **✨ AI-Powered Recommendations**: Get 10 tailored book recommendations
- **📚 Your Bookshelf**: Save your favorite books with double-tap
- **⭐ Emoji Rating System**: Rate books with fun emoji reactions
- **💌 Social Sharing**: Send book recommendations to friends
- **🎨 Cozy Theme**: Warm wood textures, soft colors, and gentle animations

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/Lexieeagleson/Stupid-nests.git
cd Stupid-nests

# Install dependencies
npm install

# Start development server
npm run dev
```

### Building for Production

```bash
# Create production build
npm run build

# Preview production build locally
npm run preview
```

## 🤖 AI Configuration

The app supports AI-powered quiz generation and book recommendations. To enable AI features:

### Option 1: Environment Variables

Create a `.env` file in the root directory:

```env
VITE_AI_API_KEY=your_api_key_here
VITE_AI_API_ENDPOINT=https://api.openai.com/v1/chat/completions
VITE_AI_MODEL=gpt-3.5-turbo
```

### Option 2: Configuration File

Edit `src/config/ai.js` to customize AI settings:

```javascript
export const AI_CONFIG = {
  provider: 'openai',
  apiKey: 'your_api_key_here',
  apiEndpoint: 'https://api.openai.com/v1/chat/completions',
  model: 'gpt-3.5-turbo',
  temperature: 0.7,
  maxTokens: 2000,
};
```

### Mock Mode

If no API key is configured, the app will use built-in mock data for quiz questions and book recommendations, so you can still explore all features without an API key.

## 🌐 GitHub Pages Deployment

### Automatic Deployment

1. Go to your repository Settings → Pages
2. Set Source to "GitHub Actions"
3. The app will deploy automatically on push to main

### Manual Deployment

```bash
# Build the app
npm run build

# The dist/ folder contains the static files
# Deploy these to any static hosting service
```

## 📁 Project Structure

```
src/
├── components/
│   ├── BookCard/       # Book card with cover, summary, rating
│   ├── Bookshelf/      # Saved books display
│   ├── Carousel/       # Swipeable book carousel
│   ├── Common/         # Loading, Empty, Error states
│   ├── Navigation/     # Side menu navigation
│   ├── Quiz/           # Quiz questions and flow
│   ├── Rating/         # Emoji rating system
│   └── Social/         # Send-a-book feature
├── config/
│   └── ai.js           # AI configuration and prompts
├── hooks/
│   ├── useSwipe.js     # Touch/mouse swipe gestures
│   └── useDoubleTap.js # Double-tap detection
├── utils/
│   ├── aiService.js    # AI API integration
│   └── storage.js      # LocalStorage utilities
├── App.jsx             # Main app component
└── index.css           # Cozy treehouse theme styles
```

## 🎨 Theme Customization

The cozy treehouse theme uses CSS custom properties. Edit `src/index.css` to customize:

```css
@theme {
  --color-wood-light: #8B7355;
  --color-wood: #6B4E31;
  --color-wood-dark: #4A3520;
  --color-parchment: #F5E6C4;
  --color-cream: #FDF8E8;
  --color-sage: #7D8B6F;
  --color-amber: #D4A373;
}
```

## 📱 Mobile Support

The app is fully responsive with:
- Touch-friendly swipe gestures
- Collapsible side navigation
- Mobile-optimized card layouts

## 🛠️ Development

```bash
# Run development server
npm run dev

# Run linter
npm run lint

# Build for production
npm run build
```

## 📄 License

This project is licensed under the Apache License 2.0 - see the [LICENSE](LICENSE) file for details.

---

Made with 📚 and ☕ in a cozy treehouse 🌳
