import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const { message, language } = await request.json();

    if (!message) {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
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

    const prompt = `You are an expert agricultural assistant helping farmers in India. ${langInstruction}
    
    Important: You must respond in the requested language. Focus on Indian farming practices, crops common in India, and local agricultural conditions. Be concise but informative.

    Farmer's question: ${message}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ 
      response: text,
      timestamp: new Date().toISOString(),
      language: language || 'en'
    });

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json(
      { error: 'Failed to get response from AI assistant' },
      { status: 500 }
    );
  }
}
