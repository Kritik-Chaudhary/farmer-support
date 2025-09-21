import { NextRequest, NextResponse } from 'next/server';

// Mock database of government schemes
const governmentSchemes = [
  {
    id: 1,
    name: 'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)',
    category: 'Financial Support',
    description: 'Direct income support to small and marginal farmers',
    benefits: [
      'Rs. 6,000 per year in three installments',
      'Direct cash transfer to bank account',
      'No need to visit offices for claiming benefits'
    ],
    eligibility: [
      'Small and marginal farmers with landholding up to 2 hectares',
      'Must have valid Aadhaar card',
      'Bank account linked with Aadhaar'
    ],
    documents: [
      'Aadhaar Card',
      'Bank Account Details',
      'Land Records (Khatauni/Registry)',
      'Mobile Number'
    ],
    applicationProcess: [
      'Visit PM-KISAN website or Common Service Center',
      'Fill the registration form with required details',
      'Submit necessary documents',
      'Verification by local revenue officials',
      'Benefits transferred directly to bank account'
    ],
    website: 'https://pmkisan.gov.in',
    launchYear: 2019,
    ministry: 'Ministry of Agriculture and Farmers Welfare'
  },
  {
    id: 2,
    name: 'Pradhan Mantri Fasal Bima Yojana (PMFBY)',
    category: 'Crop Insurance',
    description: 'Comprehensive crop insurance scheme for farmers',
    benefits: [
      'Protection against crop losses due to natural calamities',
      'Low premium rates (1.5% for Rabi, 2% for Kharif)',
      'Quick settlement of claims',
      'Coverage for prevented sowing and post-harvest losses'
    ],
    eligibility: [
      'All farmers including sharecroppers and tenant farmers',
      'Must have insurable interest in the crop',
      'Cultivation in notified areas only'
    ],
    documents: [
      'Aadhaar Card',
      'Bank Account Details',
      'Land Records',
      'Sowing Certificate',
      'Loan Sanction Letter (if applicable)'
    ],
    applicationProcess: [
      'Apply through banks, insurance companies, or online portal',
      'Submit application before cut-off date',
      'Pay premium amount',
      'Get insurance policy document',
      'Report crop loss immediately if occurs'
    ],
    website: 'https://pmfby.gov.in',
    launchYear: 2016,
    ministry: 'Ministry of Agriculture and Farmers Welfare'
  },
  {
    id: 3,
    name: 'Soil Health Card Scheme',
    category: 'Soil Management',
    description: 'Promote soil test based nutrient management',
    benefits: [
      'Free soil testing every 3 years',
      'Customized fertilizer recommendations',
      'Improved soil health and crop productivity',
      'Reduced fertilizer costs'
    ],
    eligibility: [
      'All farmers across the country',
      'No specific landholding criteria',
      'Individual and institutional farmers eligible'
    ],
    documents: [
      'Aadhaar Card',
      'Land Records',
      'Mobile Number for SMS updates'
    ],
    applicationProcess: [
      'Contact local agriculture extension officer',
      'Register for soil sampling',
      'Provide soil samples as per guidelines',
      'Receive Soil Health Card with recommendations',
      'Follow nutrient management advice'
    ],
    website: 'https://soilhealth.dac.gov.in',
    launchYear: 2015,
    ministry: 'Ministry of Agriculture and Farmers Welfare'
  },
  {
    id: 4,
    name: 'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthan Mahabhiyan)',
    category: 'Solar Energy',
    description: 'Solar power scheme for farmers',
    benefits: [
      'Solar pumps for irrigation',
      'Grid-connected solar power plants',
      'Additional income from excess power sale',
      'Reduced electricity bills'
    ],
    eligibility: [
      'Individual farmers',
      'Farmer Producer Organizations (FPOs)',
      'Cooperatives and societies',
      'Must have agricultural land'
    ],
    documents: [
      'Aadhaar Card',
      'Land Records',
      'Bank Account Details',
      'Electricity Connection Details',
      'NOC from State Electricity Board'
    ],
    applicationProcess: [
      'Apply through state nodal agency',
      'Technical feasibility assessment',
      'Financial evaluation and approval',
      'Installation by empanelled vendors',
      'Commissioning and grid connectivity'
    ],
    website: 'https://kusum.online',
    launchYear: 2019,
    ministry: 'Ministry of New and Renewable Energy'
  },
  {
    id: 5,
    name: 'National Agriculture Market (e-NAM)',
    category: 'Market Access',
    description: 'Online trading platform for agricultural commodities',
    benefits: [
      'Better price discovery for crops',
      'Reduced transaction costs',
      'Transparent auction process',
      'Access to pan-India market'
    ],
    eligibility: [
      'Registered farmers',
      'Licensed traders',
      'Commission agents',
      'Must register on e-NAM portal'
    ],
    documents: [
      'Aadhaar Card',
      'Bank Account Details',
      'Mobile Number',
      'Registration with local mandi'
    ],
    applicationProcess: [
      'Visit e-NAM portal or local mandi',
      'Complete registration process',
      'Link bank account for payments',
      'Start trading through online platform',
      'Track prices and market trends'
    ],
    website: 'https://enam.gov.in',
    launchYear: 2016,
    ministry: 'Ministry of Agriculture and Farmers Welfare'
  }
];

// Translation data for schemes
const translations = {
  en: {},
  hi: {
    'PM-KISAN (Pradhan Mantri Kisan Samman Nidhi)': 'पीएम-किसान (प्रधान मंत्री किसान सम्मान निधि)',
    'Direct income support to small and marginal farmers': 'छोटे और सीमांत किसानों के लिए प्रत्यक्ष आय सहायता',
    'Financial Support': 'वित्तीय सहायता',
    'Rs. 6,000 per year in three installments': 'तीन किश्तों में प्रति वर्ष 6,000 रुपये',
    'Direct cash transfer to bank account': 'बैंक खाते में सीधे नकद स्थानांतरण',
    'No need to visit offices for claiming benefits': 'लाभ प्राप्त करने के लिए कार्यालयों में जाने की आवश्यकता नहीं',
    'Small and marginal farmers with landholding up to 2 hectares': '2 हेक्टेयर तक भूमि वाले छोटे और सीमांत किसान',
    'Must have valid Aadhaar card': 'वैध आधार कार्ड होना चाहिए',
    'Bank account linked with Aadhaar': 'आधार से जुड़ा बैंक खाता',
    'Ministry of Agriculture and Farmers Welfare': 'कृषि एवं किसान कल्याण मंत्रालय',
    'Pradhan Mantri Fasal Bima Yojana (PMFBY)': 'प्रधान मंत्री फसल बीमा योजना (पीएमएफबीवाई)',
    'Comprehensive crop insurance scheme for farmers': 'किसानों के लिए व्यापक फसल बीमा योजना',
    'Crop Insurance': 'फसल बीमा',
    'Soil Health Card Scheme': 'मिट्टी स्वास्थ्य कार्ड योजना',
    'Promote soil test based nutrient management': 'मिट्टी परीक्षण आधारित पोषक तत्व प्रबंधन को बढ़ावा',
    'Soil Management': 'मिट्टी प्रबंधन',
    'PM-KUSUM (Pradhan Mantri Kisan Urja Suraksha evam Utthan Mahabhiyan)': 'पीएम-कुसुम (प्रधान मंत्री किसान ऊर्जा सुरक्षा एवं उत्थान महाभियान)',
    'Solar power scheme for farmers': 'किसानों के लिए सोलर पावर योजना',
    'Solar Energy': 'सोलर ऊर्जा',
    'National Agriculture Market (e-NAM)': 'राष्ट्रीय कृषि बाजार (ई-नाम)',
    'Online trading platform for agricultural commodities': 'कृषि वस्तुओं के लिए ऑनलाइन ट्रेडिंग प्लेटफॉर्म',
    'Market Access': 'बाजार पहुंच',
    // Additional common terms
    'Aadhaar Card': 'आधार कार्ड',
    'Bank Account Details': 'बैंक खाता विवरण',
    'Land Records (Khatauni/Registry)': 'भूमि रिकॉर्ड (खतौनी/रजिस्ट्री)',
    'Mobile Number': 'मोबाइल नंबर',
    'Land Records': 'भूमि रिकॉर्ड',
    'Protection against crop losses due to natural calamities': 'प्राकृतिक आपदाओं के कारण फसल हानि के खिलाफ सुरक्षा',
    'Low premium rates (1.5% for Rabi, 2% for Kharif)': 'कम प्रीमियम दरें (रबी के लिए 1.5%, खरीफ के लिए 2%)',
    'Quick settlement of claims': 'दावों का तुरंत निपटान',
    'All farmers including sharecroppers and tenant farmers': 'बटाईदारों और किरायेदार किसानों सहित सभी किसान',
    'Free soil testing every 3 years': 'हर 3 साल में मुफ्त मिट्टी परीक्षण',
    'Customized fertilizer recommendations': 'अनुकूलित उर्वरक सिफारिशें',
    'All farmers across the country': 'देश भर के सभी किसान',
    'Solar pumps for irrigation': 'सिंचाई के लिए सोलर पंप',
    'Individual farmers': 'व्यक्तिगत किसान',
    'Better price discovery for crops': 'फसलों के लिए बेहतर कीमत खोज',
    'Registered farmers': 'पंजीकृत किसान',
    'Visit PM-KISAN website or Common Service Center': 'पीएम-किसान वेबसाइट या कॉमन सर्विस सेंटर पर जाएं',
    'Benefits transferred directly to bank account': 'लाभ सीधे बैंक खाते में स्थानांतरित',
    'Coverage for prevented sowing and post-harvest losses': 'रोकी गई बुआई और फसल कटाई के बाद की हानि का कवरेज',
    'Grid-connected solar power plants': 'ग्रिड-कनेक्टेड सोलर पावर प्लांट',
    'Additional income from excess power sale': 'अतिरिक्त बिजली की बिक्री से अतिरिक्त आय',
    'Reduced electricity bills': 'कम बिजली बिल',
    'Transparent auction process': 'पारदर्शी नीलामी प्रक्रिया',
    'Access to pan-India market': 'देशभर के बाजार तक पहुंच',
    'Licensed traders': 'लाइसेंस प्राप्त व्यापारी',
    'Commission agents': 'कमीशन एजेंट',
    'Reduced transaction costs': 'कम लेनदेन लागत'
  }
};

// Function to translate text
interface SchemeTranslations { [key: string]: string; }

function translateText(text: string, language: string): string {
  if (language === 'en' || !translations[language as keyof typeof translations]) {
    return text;
  }
  const langTranslations: SchemeTranslations = translations[language as keyof typeof translations];
  return langTranslations[text] || text;
}

// Function to translate scheme object
interface GovernmentScheme {
  id: number;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  applicationProcess: string[];
  website: string;
  launchYear: number;
  ministry: string;
}

function translateScheme(scheme: GovernmentScheme, language: string) {
  if (language === 'en') return scheme;
  
  return {
    ...scheme,
    name: translateText(scheme.name, language),
    category: translateText(scheme.category, language),
    description: translateText(scheme.description, language),
    benefits: scheme.benefits.map((benefit: string) => translateText(benefit, language)),
    eligibility: scheme.eligibility.map((criteria: string) => translateText(criteria, language)),
    documents: scheme.documents.map((doc: string) => translateText(doc, language)),
    applicationProcess: scheme.applicationProcess.map((step: string) => translateText(step, language)),
    ministry: translateText(scheme.ministry, language)
  };
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const language = searchParams.get('language') || 'en';

    let filteredSchemes = governmentSchemes;

    // Filter by category if provided
    if (category && category !== 'all') {
      filteredSchemes = filteredSchemes.filter(scheme => 
        scheme.category.toLowerCase() === category.toLowerCase()
      );
    }

    // Filter by search term if provided
    if (search) {
      filteredSchemes = filteredSchemes.filter(scheme =>
        scheme.name.toLowerCase().includes(search.toLowerCase()) ||
        scheme.description.toLowerCase().includes(search.toLowerCase()) ||
        scheme.category.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Translate schemes based on requested language
    const translatedSchemes = filteredSchemes.map(scheme => translateScheme(scheme, language));
    
    // Translate categories
    const categories = [...new Set(governmentSchemes.map(scheme => translateText(scheme.category, language)))];

    return NextResponse.json({
      success: true,
      schemes: translatedSchemes,
      categories,
      total: translatedSchemes.length,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Government schemes API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch government schemes' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { schemeId, language = 'en' } = await request.json();
    
    const scheme = governmentSchemes.find(s => s.id === parseInt(schemeId));
    
    if (!scheme) {
      return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    }

    // Translate the scheme based on requested language
    const translatedScheme = translateScheme(scheme, language);

    return NextResponse.json({
      success: true,
      scheme: translatedScheme,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Government scheme details API error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch scheme details' },
      { status: 500 }
    );
  }
}