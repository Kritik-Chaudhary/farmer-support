import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this crop/plant image and provide a CONCISE agricultural assessment. Keep each section to 2-3 short sentences maximum. Please include:

1. Plant/Crop Identification: What type of plant or crop is this? (1 sentence)
2. Health Assessment: Is the plant healthy or showing disease? (1 sentence)
3. Disease/Problem Identification: If there are issues, what specific disease/pest? (1-2 sentences max)
4. Symptoms Description: Main visible symptoms only (2-3 sentences max)
5. Probable Causes: Key causes only (2-3 sentences max)
6. Treatment Recommendations: Essential treatments only (3-4 sentences max)
7. Prevention Measures: Main prevention steps only (3-4 sentences max)
8. Urgency Level: Rate as Low/Medium/High (1 word)

BE CONCISE - Focus on the most important information only. Each section should be brief and actionable for Indian farmers.`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: image.type,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const text = response.text();

    // Parse the response to structure it better
    const analysis = {
      plantType: extractSection(text, 'Plant/Crop Identification'),
      healthStatus: extractSection(text, 'Health Assessment'),
      diseaseIdentification: extractSection(text, 'Disease/Problem Identification'),
      symptoms: extractSection(text, 'Symptoms Description'),
      causes: extractSection(text, 'Probable Causes'),
      treatment: extractSection(text, 'Treatment Recommendations'),
      prevention: extractSection(text, 'Prevention Measures'),
      urgency: extractSection(text, 'Urgency Level'),
      fullAnalysis: text
    };

    return NextResponse.json({
      success: true,
      analysis,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Crop detection API error:', error);
    
    // Return mock analysis if API fails
    const mockAnalysis = {
      plantType: 'Tomato',
      healthStatus: 'Diseased',
      diseaseIdentification: 'Early Blight disease detected.',
      symptoms: 'Brown circular spots on leaves. Yellowing starts from bottom leaves. Some wilting during hot weather.',
      causes: 'High humidity and warm weather. Poor air circulation. Overhead watering wets leaves.',
      treatment: 'Apply copper fungicide immediately. Remove infected leaves. Improve plant spacing and drainage.',
      prevention: 'Rotate crops every 2 years. Water at plant base only. Use disease-resistant varieties.',
      urgency: 'High',
      fullAnalysis: 'Early Blight disease needs immediate treatment to prevent spread.'
    };

    return NextResponse.json({
      success: false,
      analysis: mockAnalysis,
      timestamp: new Date().toISOString(),
      note: 'AI analysis unavailable - showing general guidance'
    });
  }
}

function extractSection(text: string, sectionName: string): string {
  const regex = new RegExp(`${sectionName}:?\\s*([^\\n]+(?:\\n(?!\\d+\\.).*)*)`);
  const match = text.match(regex);
  return match ? match[1].trim() : 'Information not available';
}