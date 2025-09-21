import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

interface MandiPrice {
  commodity: string;
  state: string;
  price: number;
  unit: string;
  date: string;
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, language } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Check if the query is about weather or mandi prices
    const weatherKeywords = [
      'weather', 'temperature', 'rain', 'humidity', 'wind', 'forecast', 
      'climate', 'hot', 'cold', 'sunny', 'cloudy', 'storm',
      'मौसम', 'तापमान', 'बारिश', 'नमी', 'हवा', 'पूर्वानुमान'
    ];
    
    const priceKeywords = [
      'price', 'mandi', 'market', 'rate', 'cost', 'sell', 'buy',
      'भाव', 'मंडी', 'बाजार', 'दर', 'कीमत', 'मूल्य'
    ];
    
    const isWeather = weatherKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
    
    const isPrice = priceKeywords.some(keyword => 
      message.toLowerCase().includes(keyword.toLowerCase())
    );
    
    let enhancedPrompt = '';
    let dataFetched = false;
    let weatherData = null;
    let priceData = null;

    // Fetch weather data if weather query
    if (isWeather) {
      try {
        console.log('Fetching weather data for chatbot...');
        const weatherResponse = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/weather`);
        weatherData = weatherResponse.data;
        
        if (weatherData && weatherData.current) {
          const current = weatherData.current;
          enhancedPrompt += `

REAL-TIME WEATHER DATA:
- Location: ${current.location}
- Temperature: ${current.temperature}°C (feels like ${current.feels_like}°C)
- Humidity: ${current.humidity}%
- Wind Speed: ${current.wind.speed} m/s
- Conditions: ${current.weather.description}

Use this actual weather data in your response and mention it's live/current data.`;
          dataFetched = true;
        }
      } catch (error) {
        console.log('Failed to fetch weather data:', error);
        enhancedPrompt += `

Note: This is a weather-related query. Provide helpful weather advice for farming and mention that users can check real-time weather data in the Weather section of this app.`;
      }
    }

    // Fetch mandi price data if price query
    if (isPrice) {
      try {
        console.log('Fetching mandi prices for chatbot...');
        
        // Extract commodity from the message
        const commodities = [
          'wheat', 'rice', 'maize', 'onion', 'potato', 'tomato', 'chilli', 'turmeric', 'mustard', 'soybean',
          'cotton', 'sugarcane', 'groundnut', 'sunflower', 'sesame', 'bajra', 'jowar', 'gram', 'arhar', 'moong',
          'urad', 'masur', 'banana', 'mango', 'coconut', 'apple', 'grapes', 'pomegranate', 'tea', 'coffee',
          'cardamom', 'black pepper', 'ginger', 'garlic', 'cauliflower', 'cabbage', 'brinjal', 'okra',
          'गेहूं', 'चावल', 'मक्का', 'प्याज', 'आलू', 'टमाटर', 'हल्दी', 'कपास'
        ];
        const commodity = commodities.find(c => message.toLowerCase().includes(c.toLowerCase()));
        
        // Extract state from the message
        const stateMap: Record<string, string> = {
          'punjab': 'PB', 'haryana': 'HR', 'uttar pradesh': 'UP', 'up': 'UP',
          'maharashtra': 'MH', 'gujarat': 'GJ', 'rajasthan': 'RJ', 'karnataka': 'KK',
          'tamil nadu': 'TN', 'andhra pradesh': 'AP', 'telangana': 'TL', 'west bengal': 'WB',
          'bihar': 'BI', 'madhya pradesh': 'MP', 'mp': 'MP', 'delhi': 'DL',
          'himachal pradesh': 'HP', 'himachal': 'HP', 'uttarakhand': 'UC', 
          'sikkim': 'SK', 'assam': 'AS', 'odisha': 'OR', 'jharkhand': 'JR',
          'chhattisgarh': 'CG', 'kerala': 'KL', 'goa': 'GO',
          'पंजाब': 'PB', 'हरियाणा': 'HR', 'उत्तर प्रदेश': 'UP',
          'महाराष्ट्र': 'MH', 'गुजरात': 'GJ', 'राजस्थान': 'RJ'
        };
        
        let stateCode = '';
        const lowerMessage = message.toLowerCase();
        for (const [stateName, code] of Object.entries(stateMap)) {
          if (lowerMessage.includes(stateName.toLowerCase())) {
            stateCode = code;
            break;
          }
        }
        
        let priceUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/mandi-prices`;
        const params = new URLSearchParams();
        if (commodity) params.append('commodity', commodity);
        
        // Default to Punjab if no state mentioned
        const finalStateCode = stateCode || 'PB';
        params.append('state', finalStateCode);
        
        priceUrl += `?${params.toString()}`;
        
        const priceResponse = await axios.get(priceUrl);
        priceData = priceResponse.data;
        
        if (priceData && priceData.data && priceData.data.length > 0) {
          const prices = priceData.data.slice(0, 5); // Top 5 results
          
          let priceText = `

CURRENT MARKET PRICES (${priceData.metadata?.state_searched || 'Selected State'}):`;
          
          prices.forEach((price: MandiPrice, index: number) => {
            priceText += `
${price.commodity}: ₹${price.price.toLocaleString()}/Quintal`;
          });
          
          priceText += `

DATA INSTRUCTIONS: Use this exact price data in your response. Give direct answers with specific prices. Don't ask users to check other sections - provide the information they need immediately. Keep responses concise and factual.`;
          
          enhancedPrompt += priceText;
          dataFetched = true;
        }
      } catch (error) {
        console.log('Failed to fetch mandi prices:', error);
        enhancedPrompt += `

Note: User is asking about prices. Provide specific price estimates and market trends. Give direct answers with typical price ranges. Be specific and actionable.`;
      }
    }

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Language-specific prompts
    const languageInstructions = {
      en: 'Please respond in English.',
      hi: 'कृपया हिंदी में उत्तर दें। Please respond entirely in Hindi using Devanagari script.',
      pa: 'ਕਿਰਪਾ ਕਰਕੇ ਪੰਜਾਬੀ ਵਿੱਚ ਜਵਾਬ ਦਿਓ। Please respond entirely in Punjabi using Gurmukhi script.',
      ta: 'தயவு செய்து தமிழில் பதிலளிக்கவும். Please respond entirely in Tamil.',
      te: 'దయచేసి తెలుగులో స్పందించండి. Please respond entirely in Telugu.',
      mr: 'कृपया मराठीत उत्तर द्या. Please respond entirely in Marathi.',
      gu: 'કૃપા કરીને ગુજરાતીમાં જવાબ આપો. Please respond entirely in Gujarati.',
      bn: 'দয়া করে বাংলায় উত্তর দিন। Please respond entirely in Bengali.'
    };

    const langInstruction = languageInstructions[language as keyof typeof languageInstructions] || languageInstructions.en;

    const prompt = `You are a direct, helpful agricultural assistant for Indian farmers. ${langInstruction}
    
    RESPONSE STYLE:
    • Give DIRECT, TO-THE-POINT answers
    • Provide specific numbers, prices, and facts
    • Keep responses SHORT and ACTIONABLE
    • Answer the exact question asked
    • Don't give unnecessary background information
    • Use bullet points for multiple items
    
    CRITICAL RULES:
    • If price data is provided above, use the EXACT prices and answer directly
    • Never redirect users to "check other sections" - give the answer NOW
    • Be factual and precise
    • Focus on what the farmer needs to know immediately${enhancedPrompt}

    Farmer's question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      response: text,
      timestamp: new Date().toISOString(),
      language: language || 'en',
      dataFetched,
      queryTypes: {
        weather: isWeather,
        prices: isPrice
      }
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI assistant' },
      { status: 500 }
    );
  }
}
