# 🌾 Farmer Support App

A comprehensive Next.js web application designed to empower farmers with AI-powered insights, real-time market prices, weather alerts, crop disease detection, and information about government schemes.

## ✨ Features

### 1. **AI Chatbot Assistant** 🤖
- Powered by Google Gemini Pro AI
- Instant answers about crops, weather, farming techniques
- Available 24/7 for farming-related queries

### 2. **Live Mandi Prices** 📈
- Real-time market prices from Data.gov.in
- Filter by state, district, and commodity
- Price comparison across different markets

### 3. **Weather Alerts** 🌤️
- 5-day weather forecast
- Agricultural weather alerts
- Location-based weather information

### 4. **Crop Disease Detection** 📸
- AI-powered image analysis using Gemini Vision
- Upload photos of crops for instant diagnosis
- Treatment recommendations and prevention measures

### 5. **Government Schemes** 📋
- Comprehensive list of farmer welfare schemes
- Eligibility criteria and application process
- Direct links to official websites

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- API keys for Gemini Pro, Data.gov.in, and OpenWeatherMap

### Installation

1. **Install dependencies:**
```bash
npm install
```

2. **Set up environment variables:**
Update `.env.local` file with your API keys:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATA_GOV_API_KEY=your_data_gov_api_key_here
WEATHER_API_KEY=your_openweathermap_api_key_here
```

3. **Run the development server:**
```bash
npm run dev
```

4. **Open your browser:**
Navigate to [http://localhost:3000](http://localhost:3000)

## 📦 Deploy on Vercel

### Method 1: One-Click Deploy
[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

### Method 2: Manual Deploy

1. **Install Vercel CLI:**
```bash
npm install -g vercel
```

2. **Deploy:**
```bash
vercel
```

3. **Set environment variables in Vercel Dashboard:**
- Go to your project settings
- Navigate to Environment Variables
- Add your API keys

## 🔑 Getting API Keys

### Google Gemini Pro
- Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
- Sign in and generate API key

### Data.gov.in
- Register at [Data.gov.in](https://data.gov.in)
- Generate API key from your account

### OpenWeatherMap
- Sign up at [OpenWeatherMap](https://openweathermap.org/api)
- Get your free API key

## 🛠️ Tech Stack
- **Framework:** Next.js 14
- **Styling:** Tailwind CSS
- **Language:** TypeScript
- **AI:** Google Gemini Pro
- **Deployment:** Vercel

## 📄 License
MIT License

---
Built with ❤️ for farmers | Powered by Next.js and Vercel
