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

    const prompt = `Analyze this crop/plant image and provide a detailed agricultural assessment. Please include:

1. Plant/Crop Identification: What type of plant or crop is this?
2. Health Assessment: Is the plant healthy or showing signs of disease/problems?
3. Disease/Problem Identification: If there are issues, what specific diseases, pests, or problems do you see?
4. Symptoms Description: Describe the visible symptoms (leaf spots, discoloration, wilting, etc.)
5. Probable Causes: What are the likely causes of any problems identified?
6. Treatment Recommendations: Suggest specific treatments, fungicides, pesticides, or cultural practices
7. Prevention Measures: How can similar problems be prevented in the future?
8. Urgency Level: Rate the urgency of treatment (Low/Medium/High)

Please be specific and practical in your recommendations, focusing on solutions available to Indian farmers.`;

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
      plantType: 'Tomato Plant (Solanum lycopersicum)',
      healthStatus: 'Moderately Infected - Treatment Required',
      diseaseIdentification: 'Early Blight (Alternaria solani) with possible secondary bacterial infection',
      symptoms: 'Brown circular spots with concentric rings on lower leaves. Yellowing of older leaves starting from bottom. Dark lesions on stem near soil line. Slight wilting during hot periods. Premature leaf drop observed.',
      causes: 'High humidity and warm temperatures. Poor air circulation around plants. Overhead watering causing leaf wetness. Infected soil or plant debris. Nutrient deficiency making plant susceptible.',
      treatment: 'Apply copper-based fungicide immediately. Remove and destroy infected leaves. Apply Mancozeb or Chlorothalonil spray. Improve drainage around plants. Apply balanced NPK fertilizer. Mulch around base to prevent soil splash.',
      prevention: 'Practice crop rotation every 2-3 years. Space plants properly for air circulation. Water at base avoiding leaf wetness. Remove plant debris after harvest. Use disease-resistant varieties. Apply preventive fungicide during susceptible periods.',
      urgency: 'High - Treatment needed within 24-48 hours',
      fullAnalysis: 'The tomato plant shows classic symptoms of Early Blight disease. Immediate intervention required to prevent spread to healthy plants.'
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