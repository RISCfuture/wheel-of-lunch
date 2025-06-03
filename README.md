# 🍽️ Wheel of Lunch

A fun and interactive web application that helps you decide where to eat lunch by spinning a roulette wheel filled with nearby restaurants!

## Features

- **🗺️ Geolocation**: Automatically detects your current location
- **🔍 Smart Restaurant Discovery**: Finds nearby restaurants that are:
  - Within walking distance (≤1km)
  - Currently open (prioritized)
  - Affordable ($$ or less price level)
- **🎯 Interactive Roulette Wheel**: 
  - Canvas-based rendering for smooth performance
  - Mouse drag mechanics - spin velocity matches your drag speed and distance
  - Audio feedback with "ding" sounds as the pointer crosses sections
- **🎲 Random Selection**: Spin to randomly choose from up to 10 restaurants
- **📱 Responsive Design**: Works on desktop and mobile devices

## Technology Stack

- **Framework**: Next.js 15 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Animation**: Framer Motion
- **Icons**: Lucide React
- **API**: Google Places API (with mock data fallback)
- **Package Manager**: Yarn

## Getting Started

### Prerequisites

- Node.js 18+ 
- Yarn package manager

### Installation

1. Clone or download this repository
2. Install dependencies:
   ```bash
   yarn install
   ```

3. (Optional) Set up Google Places API:
   - Copy `.env.local.example` to `.env.local`
   - Get a Google Places API key from [Google Cloud Console](https://console.cloud.google.com/)
   - Add your API key to `.env.local`:
     ```
     GOOGLE_PLACES_API_KEY=your_api_key_here
     ```
   - Note: Without an API key, the app will use mock restaurant data

4. Start the development server:
   ```bash
   yarn dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

### Building for Production

```bash
yarn build
yarn start
```

## How to Use

1. **Allow Location Access**: Click "Find Nearby Restaurants" and grant location permission
2. **Spin the Wheel**: 
   - Drag the wheel with your mouse to spin (faster/longer drags = faster spins)
   - Or click "Spin the Wheel!" for a random spin
3. **Discover Your Lunch**: The wheel will slow down and select a restaurant
4. **Get Details**: See the winner with rating, price level, distance, and open status

## API Integration

The app uses Google Places API to find real restaurants. The API integration includes:

- **Nearby Search**: Finds restaurants within 1km radius
- **Place Details**: Gets opening hours for each restaurant
- **Filtering**: Only shows restaurants that are ≤$$ price level and prioritizes open venues
- **Distance Calculation**: Uses Haversine formula for accurate walking distances

## Performance Features

- **Canvas Rendering**: Smooth wheel graphics and animations
- **Optimized API Calls**: Efficient batching and filtering of restaurant data
- **Progressive Enhancement**: Works without API key using mock data
- **Audio Context**: Web Audio API for responsive sound effects

## Browser Compatibility

- Modern browsers with Geolocation API support
- Canvas 2D rendering support
- Web Audio API for sound effects
- Pointer Events API for touch/mouse interaction

## License

This project is open source and available under the MIT License.