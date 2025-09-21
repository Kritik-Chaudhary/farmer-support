import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

export async function POST(request: NextRequest) {
  let language: string = 'en';
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    language = formData.get('language') as string || 'en';

    if (!image) {
      return NextResponse.json({ error: 'Image is required' }, { status: 400 });
    }

    // Convert image to base64
    const bytes = await image.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    // Create language-specific prompts
    const createPrompt = (lang: string) => {
      const prompts = {
        en: `Analyze this crop/plant image and provide a CONCISE agricultural assessment in ENGLISH ONLY. Keep each section to 2-3 short sentences maximum. Format your response as:

1. Plant/Crop Identification: [plant type in 1 sentence]
2. Health Assessment: [health status in 1 sentence] 
3. Disease/Problem Identification: [disease/issues in 1-2 sentences]
4. Symptoms Description: [visible symptoms in 2-3 sentences]
5. Probable Causes: [main causes in 2-3 sentences]
6. Treatment Recommendations: [treatments in 3-4 sentences]
7. Prevention Measures: [prevention in 3-4 sentences]
8. Urgency Level: [High/Medium/Low]

Respond in English only. Be concise and practical for Indian farmers.`,
        
        hi: `इस फसल/पौधे की तस्वीर का विश्लेषण करें और केवल हिंदी में संक्षिप्त कृषि मूल्यांकन प्रदान करें। हर भाग में अधिकतम 2-3 छोटे वाक्य रखें। अपना उत्तर इस प्रारूप में दें:

1. पौधा/फसल की पहचान: [1 वाक्य में पौधे का प्रकार]
2. स्वास्थ्य मूल्यांकन: [1 वाक्य में स्वास्थ्य स्थिति]
3. रोग/समस्या की पहचान: [1-2 वाक्य में रोग/समस्याएं]
4. लक्षणों का विवरण: [2-3 वाक्य में दिखाई देने वाले लक्षण]
5. संभावित कारण: [2-3 वाक्य में मुख्य कारण]
6. उपचार की सिफारिशें: [3-4 वाक्य में उपचार]
7. रोकथाम के उपाय: [3-4 वाक्य में रोकथाम]
8. तात्कालिकता स्तर: [उच्च/मध्यम/कम]

केवल हिंदी में उत्तर दें। भारतीय किसानों के लिए संक्षिप्त और व्यावहारिक जानकारी दें।`,
        
        pa: `ਇਸ ਫਸਲ/ਪੌਧੇ ਦੀ ਤਸਵੀਰ ਦਾ ਵਿਸ਼ਲੇਸ਼ਣ ਕਰੋ ਅਤੇ ਸਿਰਫ ਪੰਜਾਬੀ ਵਿਚ ਸੰਖੇਪ ਖੇਤੀਬਾੜੀ ਮੁਲਾਂਕਣ ਪ੍ਰਦਾਨ ਕਰੋ। ਹਰ ਭਾਗ ਵਿਚ ਵੱਧ ਤੋਂ ਵੱਧ 2-3 ਛੋਟੇ ਵਾਕ ਰੱਖੋ। ਆਪਣਾ ਜਵਾਬ ਇਸ ਫਾਰਮੈਟ ਵਿਚ ਦਿਓ:

1. ਪੌਧਾ/ਫਸਲ ਦੀ ਪਛਾਣ: [1 ਵਾਕ ਵਿਚ ਪੌਧੇ ਦੀ ਕਿਸਮ]
2. ਸਿਹਤ ਮੁਲਾਂਕਣ: [1 ਵਾਕ ਵਿਚ ਸਿਹਤ ਸਥਿਤੀ]
3. ਬਿਮਾਰੀ/ਸਮੱਸਿਆ ਦੀ ਪਛਾਣ: [1-2 ਵਾਕ ਵਿਚ ਬਿਮਾਰੀ/ਸਮੱਸਿਆਵਾਂ]
4. ਲੱਛਣਾਂ ਦਾ ਵੇਰਵਾ: [2-3 ਵਾਕ ਵਿਚ ਦਿਖਾਈ ਦੇਣ ਵਾਲੇ ਲੱਛਣ]
5. ਸੰਭਾਵਿਤ ਕਾਰਨ: [2-3 ਵਾਕ ਵਿਚ ਮੁੱਖ ਕਾਰਨ]
6. ਇਲਾਜ ਦੀਆਂ ਸਿਫਾਰਸ਼ਾਂ: [3-4 ਵਾਕ ਵਿਚ ਇਲਾਜ]
7. ਰੋਕਥਾਮ ਦੇ ਉਪਾਅ: [3-4 ਵਾਕ ਵਿਚ ਰੋਕਥਾਮ]
8. ਤਤਕਾਲਤਾ ਦਾ ਪੱਧਰ: [ਉੱਚ/ਮੱਧਮ/ਘੱਟ]

ਸਿਰਫ ਪੰਜਾਬੀ ਵਿਚ ਜਵਾਬ ਦਿਓ। ਭਾਰਤੀ ਕਿਸਾਨਾਂ ਲਈ ਸੰਖੇਪ ਅਤੇ ਵਿਹਾਰਕ ਜਾਣਕਾਰੀ ਦਿਓ।`
      };
      return prompts[lang as keyof typeof prompts] || prompts.en;
    };

    const prompt = createPrompt(language);

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
    const sectionNames = {
      en: {
        plantType: 'Plant/Crop Identification',
        healthStatus: 'Health Assessment',
        diseaseIdentification: 'Disease/Problem Identification',
        symptoms: 'Symptoms Description',
        causes: 'Probable Causes',
        treatment: 'Treatment Recommendations',
        prevention: 'Prevention Measures',
        urgency: 'Urgency Level'
      },
      hi: {
        plantType: 'पौधा/फसल की पहचान',
        healthStatus: 'स्वास्थ्य मूल्यांकन',
        diseaseIdentification: 'रोग/समस्या की पहचान',
        symptoms: 'लक्षणों का विवरण',
        causes: 'संभावित कारण',
        treatment: 'उपचार की सिफारिशें',
        prevention: 'रोकथाम के उपाय',
        urgency: 'तात्कालिकता स्तर'
      },
      pa: {
        plantType: 'ਪौधा/फसल दੀ पहचान',
        healthStatus: 'ਸिहत मुलांकण',
        diseaseIdentification: 'ਬिमारी/समस्सिआ दੀ पहचाण',
        symptoms: 'ਲहचणां दा वेरवा',
        causes: 'ਸंभावित कारन',
        treatment: 'ਇलाज दीआं सिफारसां',
        prevention: 'ਰोकथाम दे उपाअ',
        urgency: 'ਤतकालता दा पधर'
      }
    };
    
    const names = sectionNames[language as keyof typeof sectionNames] || sectionNames.en;
    
    const analysis = {
      plantType: extractSection(text, names.plantType, language),
      healthStatus: extractSection(text, names.healthStatus, language),
      diseaseIdentification: extractSection(text, names.diseaseIdentification, language),
      symptoms: extractSection(text, names.symptoms, language),
      causes: extractSection(text, names.causes, language),
      treatment: extractSection(text, names.treatment, language),
      prevention: extractSection(text, names.prevention, language),
      urgency: extractSection(text, names.urgency, language),
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
    const mockAnalyses = {
      en: {
        plantType: 'Tomato Plant (Solanum lycopersicum). Nightshade family crop. Common vegetable grown worldwide.',
        healthStatus: 'Moderately Infected - Treatment Required. Disease present in lower leaves. Spreading upward gradually.',
        diseaseIdentification: 'Early Blight disease detected.',
        symptoms: 'Brown circular spots on leaves. Yellowing starts from bottom leaves. Some wilting during hot weather.',
        causes: 'High humidity and warm weather. Poor air circulation. Overhead watering wets leaves.',
        treatment: 'Apply copper fungicide immediately. Remove infected leaves. Improve plant spacing and drainage.',
        prevention: 'Rotate crops every 2 years. Water at plant base only. Use disease-resistant varieties.',
        urgency: 'High',
        fullAnalysis: 'Early Blight disease needs immediate treatment to prevent spread.'
      },
      hi: {
        plantType: 'टमाटर का पौधा (Solanum lycopersicum)। नाइटशेड परिवार की फसल। आम सब्जी जो दुनिया भर में उगाई जाती है।',
        healthStatus: 'मध्यम रूप से संक्रमित - उपचार आवश्यक। नीचे की पत्तियों में बीमारी मौजूद। धीरे-धीरे ऊपर की ओर फैल रही है।',
        diseaseIdentification: 'अर्ली ब्लाइट बीमारी का पता चला।',
        symptoms: 'पत्तियों पर भूरे गोल धब्बे। नीचे की पत्तियों से पीलापन शुरू। गर्म मौसम में कुछ मुरझाना।',
        causes: 'उच्च आर्द्रता और गर्म मौसम। खराब हवा का प्रसार। आशान पर पानी देना जिससे पत्तियां गीली हो जाती हैं।',
        treatment: 'तुरंत कॉपर फंजीसाइड लगाएं। संक्रमित पत्तियों को हटा दें। पौधे की दूरी और ड्रेनेज में सुधार करें।',
        prevention: 'हर 2 साल में फसल चक्र करें। केवल पौधे के आधार पर पानी दें। बीमारी प्रतिरोधी किस्मों का उपयोग करें।',
        urgency: 'उच्च',
        fullAnalysis: 'अर्ली ब्लाइट बीमारी को फैलने से रोकने के लिए तुरंत उपचार की आवश्यकता है।'
      }
    };
    
    const mockAnalysis = mockAnalyses[language as keyof typeof mockAnalyses] || mockAnalyses.en;

    return NextResponse.json({
      success: false,
      analysis: mockAnalysis,
      timestamp: new Date().toISOString(),
      note: 'AI analysis unavailable - showing general guidance'
    });
  }
}

function extractSection(text: string, sectionName: string, language: string = 'en'): string {
  // Define section patterns for different languages
  const sectionPatterns: { [key: string]: string[] } = {
    en: [
      'Plant/Crop Identification',
      'Health Assessment', 
      'Disease/Problem Identification',
      'Symptoms Description',
      'Probable Causes',
      'Treatment Recommendations',
      'Prevention Measures',
      'Urgency Level'
    ],
    hi: [
      'पौधा/फसल की पहचान',
      'स्वास्थ्य मूल्यांकन',
      'रोग/समस्या की पहचान',
      'लक्षणों का विवरण',
      'संभावित कारण',
      'उपचार की सिफारिशें',
      'रोकथाम के उपाय',
      'तात्कालिकता स्तर'
    ],
    pa: [
      'ਪੌਧा/फसल दੀ पहचान',
      'ਸिहत मुलांकण',
      'ਬिमारी/समस्सिआ दੀ पहचाण',
      'ਲहचणां दा वेरवा',
      'ਸंभावित कारन',
      'ਇलाज दीआं सिफारसां',
      'ਰोकथाम दे उपाअ',
      'ਤतकालता दा पधर'
    ]
  };
  
  const patterns = sectionPatterns[language] || sectionPatterns.en;
  const sectionIndex = patterns.indexOf(sectionName);
  
  if (sectionIndex === -1) {
    return 'Information not available';
  }
  
  // Try to find the section by number (1., 2., etc.)
  const numberRegex = new RegExp(`${sectionIndex + 1}\.\s*([^\n]+(?:\n(?!\d+\.).*)*)`, 's');
  let match = text.match(numberRegex);
  
  if (!match) {
    // Fallback: try to find by section name
    const nameRegex = new RegExp(`${sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:?\s*([^\n]+(?:\n(?!\d+\.).*)*)`, 's');
    match = text.match(nameRegex);
  }
  
  if (!match) {
    return 'Information not available';
  }
  
  // Clean up the extracted text
  let result = match[1].trim();
  
  // Remove section header if it was included
  result = result.replace(new RegExp(`^${sectionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}:?\s*`, 'i'), '');
  
  return result || 'Information not available';
}
