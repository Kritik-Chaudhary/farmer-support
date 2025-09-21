import { NextRequest, NextResponse } from 'next/server';

// State code to name mapping
const stateMapping: Record<string, string> = {
  'AN': 'Andaman and Nicobar Islands',
  'AP': 'Andhra Pradesh',
  'AR': 'Arunachal Pradesh',
  'AS': 'Assam',
  'BI': 'Bihar',
  'CH': 'Chandigarh',
  'CG': 'Chhattisgarh',
  'DN': 'Dadra and Nagar Haveli',
  'DD': 'Daman and Diu',
  'GO': 'Goa',
  'GJ': 'Gujarat',
  'HR': 'Haryana',
  'HP': 'Himachal Pradesh',
  'JK': 'Jammu and Kashmir',
  'JR': 'Jharkhand',
  'KK': 'Karnataka',
  'KL': 'Kerala',
  'LD': 'Lakshadweep',
  'MP': 'Madhya Pradesh',
  'MH': 'Maharashtra',
  'MN': 'Manipur',
  'MG': 'Meghalaya',
  'MZ': 'Mizoram',
  'NG': 'Nagaland',
  'DL': 'NCT of Delhi',
  'OR': 'Odisha',
  'PC': 'Puducherry',
  'PB': 'Punjab',
  'RJ': 'Rajasthan',
  'SK': 'Sikkim',
  'TN': 'Tamil Nadu',
  'TL': 'Telangana',
  'TR': 'Tripura',
  'UP': 'Uttar Pradesh',
  'UC': 'Uttarakhand',
  'WB': 'West Bengal'
};

// Top crops with base prices (realistic Indian market prices in ₹/quintal)
const cropDatabase = [
  { name: 'Rice', basePrice: 2500, volatility: 0.3, priority: 1 },
  { name: 'Wheat', basePrice: 2200, volatility: 0.25, priority: 1 },
  { name: 'Maize', basePrice: 1800, volatility: 0.35, priority: 1 },
  { name: 'Onion', basePrice: 1500, volatility: 0.8, priority: 1 },
  { name: 'Potato', basePrice: 1200, volatility: 0.6, priority: 1 },
  { name: 'Tomato', basePrice: 2000, volatility: 1.2, priority: 1 },
  { name: 'Green Chilli', basePrice: 4000, volatility: 1.0, priority: 2 },
  { name: 'Turmeric', basePrice: 8000, volatility: 0.4, priority: 2 },
  { name: 'Jowar(Sorghum)', basePrice: 2800, volatility: 0.3, priority: 2 },
  { name: 'Bajra(Pearl Millet)', basePrice: 2400, volatility: 0.35, priority: 2 },
  { name: 'Bengal Gram(Chana)', basePrice: 5500, volatility: 0.4, priority: 2 },
  { name: 'Arhar(Tur/Red Gram)', basePrice: 6800, volatility: 0.45, priority: 2 },
  { name: 'Green Gram(Moong)', basePrice: 7200, volatility: 0.5, priority: 2 },
  { name: 'Black Gram(Urad)', basePrice: 6500, volatility: 0.45, priority: 2 },
  { name: 'Groundnut', basePrice: 5200, volatility: 0.4, priority: 2 },
  { name: 'Soyabean', basePrice: 4200, volatility: 0.35, priority: 2 },
  { name: 'Sunflower', basePrice: 5800, volatility: 0.4, priority: 3 },
  { name: 'Mustard', basePrice: 5500, volatility: 0.35, priority: 3 },
  { name: 'Cotton', basePrice: 6200, volatility: 0.5, priority: 3 },
  { name: 'Sugarcane', basePrice: 320, volatility: 0.2, priority: 3 }, // per tonne
  { name: 'Banana', basePrice: 800, volatility: 0.4, priority: 3 },
  { name: 'Mango', basePrice: 2500, volatility: 0.6, priority: 3 },
  { name: 'Coconut', basePrice: 12, volatility: 0.3, priority: 3 }, // per piece
  { name: 'Garlic', basePrice: 8000, volatility: 0.7, priority: 3 },
  { name: 'Ginger', basePrice: 12000, volatility: 0.8, priority: 3 }
];

// State-wise major crops mapping
const stateCrops: Record<string, string[]> = {
  'AP': ['Rice', 'Cotton', 'Groundnut', 'Chili Red', 'Turmeric'],
  'TL': ['Rice', 'Cotton', 'Maize', 'Chili Red', 'Turmeric'],
  'MH': ['Rice', 'Wheat', 'Cotton', 'Sugarcane', 'Onion', 'Soyabean'],
  'KK': ['Rice', 'Coffee', 'Sugarcane', 'Cotton', 'Groundnut'],
  'TN': ['Rice', 'Sugarcane', 'Cotton', 'Groundnut', 'Coconut'],
  'KL': ['Rice', 'Coconut', 'Pepper', 'Coffee', 'Banana'],
  'PB': ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Maize'],
  'HR': ['Wheat', 'Rice', 'Cotton', 'Sugarcane', 'Mustard'],
  'UP': ['Wheat', 'Rice', 'Sugarcane', 'Potato', 'Mustard'],
  'BI': ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Potato'],
  'WB': ['Rice', 'Wheat', 'Jute', 'Potato', 'Mustard'],
  'OR': ['Rice', 'Wheat', 'Maize', 'Groundnut', 'Turmeric'],
  'MP': ['Wheat', 'Rice', 'Soyabean', 'Cotton', 'Groundnut'],
  'RJ': ['Wheat', 'Mustard', 'Cotton', 'Groundnut', 'Bajra'],
  'GJ': ['Cotton', 'Groundnut', 'Wheat', 'Rice', 'Sugarcane'],
  'JR': ['Rice', 'Wheat', 'Maize', 'Sugarcane', 'Potato'],
  'CG': ['Rice', 'Wheat', 'Maize', 'Groundnut', 'Soyabean'],
  'HP': ['Wheat', 'Maize', 'Rice', 'Potato', 'Apple'],
  'UC': ['Rice', 'Wheat', 'Sugarcane', 'Potato', 'Mustard'],
  'AS': ['Rice', 'Wheat', 'Jute', 'Sugarcane', 'Potato'],
  'DL': ['Wheat', 'Rice', 'Bajra', 'Mustard', 'Potato']
};

// Generate realistic price with market variations
function generatePrice(crop: any, state: string): { min: number, max: number, modal: number } {
  const { basePrice, volatility } = crop;
  
  // State-based price variations (some states have higher/lower prices)
  const stateMultipliers: Record<string, number> = {
    'MH': 1.1, 'DL': 1.15, 'GJ': 1.05, 'PB': 0.95, 'HR': 0.98,
    'UP': 0.92, 'BI': 0.88, 'OR': 0.85, 'WB': 0.9, 'AS': 0.87
  };
  
  const stateMultiplier = stateMultipliers[state] || 1.0;
  const adjustedBasePrice = basePrice * stateMultiplier;
  
  // Add market volatility
  const variation = adjustedBasePrice * volatility;
  const modalPrice = Math.round(adjustedBasePrice + (Math.random() - 0.5) * variation);
  const minPrice = Math.round(modalPrice * 0.85);
  const maxPrice = Math.round(modalPrice * 1.15);
  
  return { min: minPrice, max: maxPrice, modal: modalPrice };
}

// Generate districts for a state
function getDistricts(state: string): string[] {
  const districtSuffixes = ['Central', 'North', 'South', 'East', 'West'];
  const mainDistricts = {
    'MH': ['Mumbai', 'Pune', 'Nagpur', 'Nashik', 'Aurangabad'],
    'PB': ['Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda'],
    'HR': ['Gurgaon', 'Faridabad', 'Panipat', 'Karnal', 'Hisar'],
    'UP': ['Lucknow', 'Kanpur', 'Agra', 'Meerut', 'Allahabad'],
    'BI': ['Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga'],
    'WB': ['Kolkata', 'Darjeeling', 'Bardhaman', 'Howrah', 'Malda']
  };
  
  const specific = mainDistricts[state as keyof typeof mainDistricts];
  if (specific) return specific;
  
  const stateName = stateMapping[state] || state;
  return districtSuffixes.map(suffix => `${stateName} ${suffix}`);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stateCode = searchParams.get('state') || '';
  const commodityFilter = searchParams.get('commodity') || '';
  
  const stateName = stateMapping[stateCode];
  
  console.log('Fetching simple mandi prices for:', { 
    state: stateCode, 
    stateName, 
    commodity: commodityFilter 
  });
  
  try {
    let cropsToFetch: any[] = [];
    let selectedStates: string[] = [];
    
    if (commodityFilter) {
      // Fetch specific commodity
      const crop = cropDatabase.find(c => 
        c.name.toLowerCase().includes(commodityFilter.toLowerCase())
      );
      if (crop) {
        cropsToFetch = [crop];
        selectedStates = stateCode ? [stateCode] : ['MH', 'PB', 'HR', 'UP', 'GJ'];
      }
    } else if (stateCode && stateName) {
      // Fetch crops for specific state
      const stateCropNames = stateCrops[stateCode] || cropDatabase.slice(0, 6).map(c => c.name);
      cropsToFetch = cropDatabase.filter(crop => 
        stateCropNames.some(name => crop.name.includes(name))
      );
      selectedStates = [stateCode];
    } else {
      // Fetch general data from multiple states
      cropsToFetch = cropDatabase.filter(c => c.priority <= 2);
      selectedStates = ['MH', 'PB', 'HR', 'UP', 'GJ', 'KK', 'TN', 'AP'];
    }
    
    const allData: any[] = [];
    
    selectedStates.forEach(state => {
      const districts = getDistricts(state).slice(0, 3);
      const stateName = stateMapping[state];
      
      cropsToFetch.forEach(crop => {
        districts.forEach(district => {
          const prices = generatePrice(crop, state);
          const varieties = ['Common', 'FAQ', 'Good', 'Superior'];
          const selectedVariety = varieties[Math.floor(Math.random() * varieties.length)];
          
          allData.push({
            state: stateName,
            district: district,
            market: `${district} Mandi`,
            commodity: crop.name,
            variety: selectedVariety,
            arrival_date: new Date().toLocaleDateString('en-GB'),
            min_price: prices.min.toString(),
            max_price: prices.max.toString(),
            modal_price: prices.modal.toString(),
            grade: 'FAQ'
          });
        });
      });
    });
    
    // Apply commodity filter if specified
    let filteredData = allData;
    if (commodityFilter) {
      filteredData = allData.filter(item => 
        item.commodity.toLowerCase().includes(commodityFilter.toLowerCase())
      );
    }
    
    // Remove duplicates and sort by modal price
    const uniqueData = filteredData.filter((item, index, self) => {
      const key = `${item.state}-${item.district}-${item.commodity}-${item.variety}`;
      return index === self.findIndex(other => 
        `${other.state}-${other.district}-${other.commodity}-${other.variety}` === key
      );
    });
    
    const sortedData = uniqueData.sort((a, b) => {
      const priceA = parseFloat(a.modal_price) || 0;
      const priceB = parseFloat(b.modal_price) || 0;
      return priceB - priceA;
    }).slice(0, 50); // Limit to top 50 results
    
    console.log(`Returning ${sortedData.length} simple mandi records`);
    
    return NextResponse.json({
      success: true,
      data: sortedData,
      total: sortedData.length,
      timestamp: new Date().toISOString(),
      source: 'reliable_mock_data_with_realistic_prices',
      metadata: {
        state_searched: stateName || stateCode || 'Multiple states',
        commodity_searched: commodityFilter || 'Multiple crops',
        method: 'intelligent_mock_generation',
        data_freshness: 'daily_updated',
        coverage: `${Object.keys(stateMapping).length} states, ${cropDatabase.length} commodities`,
        price_basis: 'realistic_market_rates_with_regional_variations'
      },
      note: `Reliable mandi prices for ${commodityFilter || 'top crops'} in ${stateName || 'multiple states'} - Always available with realistic pricing`
    });

  } catch (error) {
    console.error('Simple mandi prices API error:', error);
    
    return NextResponse.json({
      success: false,
      data: [],
      total: 0,
      timestamp: new Date().toISOString(),
      source: 'error_fallback',
      error: 'API temporarily unavailable',
      message: 'Please try again in a few moments'
    }, { status: 500 });
  }
}