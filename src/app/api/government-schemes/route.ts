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

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');

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

    const categories = [...new Set(governmentSchemes.map(scheme => scheme.category))];

    return NextResponse.json({
      success: true,
      schemes: filteredSchemes,
      categories,
      total: filteredSchemes.length,
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
    const { schemeId } = await request.json();
    
    const scheme = governmentSchemes.find(s => s.id === parseInt(schemeId));
    
    if (!scheme) {
      return NextResponse.json({ error: 'Scheme not found' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      scheme,
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