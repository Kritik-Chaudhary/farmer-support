import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// State code to name mapping
const stateCodeToName: Record<string, string> = {
  'AN': 'Andaman and Nicobar',
  'AP': 'Andhra Pradesh',
  'AR': 'Arunachal Pradesh',
  'AS': 'Assam',
  'BI': 'Bihar',
  'CH': 'Chandigarh',
  'CG': 'Chattisgarh',
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
  'PC': 'Pondicherry',
  'PB': 'Punjab',
  'RJ': 'Rajasthan',
  'SK': 'Sikkim',
  'TN': 'Tamil Nadu',
  'TL': 'Telangana',
  'TR': 'Tripura',
  'UP': 'Uttar Pradesh',
  'UC': 'Uttrakhand',
  'WB': 'West Bengal'
};

// Top 25 most popular crops in India
const topCrops = [
  'Rice', 'Wheat', 'Maize', 'Sugarcane', 'Cotton', 'Soybean', 'Groundnut',
  'Onion', 'Potato', 'Tomato', 'Chilli', 'Turmeric', 'Mustard', 'Sunflower',
  'Sesame', 'Jowar', 'Bajra', 'Gram', 'Tur', 'Moong', 'Urad', 'Masoor',
  'Banana', 'Mango', 'Coconut'
];

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stateCode = searchParams.get('state') || '';
  const district = searchParams.get('district') || '';
  const commodity = searchParams.get('commodity') || '';
  
  // Convert state code to name for API
  const state = stateCodeToName[stateCode] || stateCode;
  
  console.log('Fetching mandi prices for:', { state, district, commodity });
  
  try {
    const apiUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    let allData: any[] = [];
    
    if (commodity) {
      // If specific commodity requested, fetch it directly
      const params = {
        'api-key': process.env.DATA_GOV_API_KEY || '',
        'format': 'json',
        'limit': 100,
        'offset': 0,
        ...(state && { 'filters[state]': state }),
        ...(district && { 'filters[district]': district }),
        'filters[commodity]': commodity
      };
      
      const response = await axios.get(apiUrl, { params });
      allData = response.data.records || [];
    } else if (state) {
      // If state is selected, fetch top crops for that state
      console.log('Fetching top crops for state:', state);
      
      const cropPromises = topCrops.slice(0, 25).map(async (crop) => {
        try {
          const params = {
            'api-key': process.env.DATA_GOV_API_KEY || '',
            'format': 'json',
            'limit': 10, // Get top 10 records per crop
            'offset': 0,
            'filters[state]': state,
            'filters[commodity]': crop,
            ...(district && { 'filters[district]': district })
          };
          
          const response = await axios.get(apiUrl, { params });
          return response.data.records || [];
        } catch (error) {
          console.log(`No data found for crop: ${crop} in state: ${state}`);
          return [];
        }
      });
      
      // Wait for all requests to complete
      const cropResults = await Promise.all(cropPromises);
      
      // Flatten and combine results
      allData = cropResults.flat();
      console.log(`Found ${allData.length} total records for ${state}`);
    } else {
      // No state selected, get sample data from multiple states
      const params = {
        'api-key': process.env.DATA_GOV_API_KEY || '',
        'format': 'json',
        'limit': 100,
        'offset': 0
      };
      
      const response = await axios.get(apiUrl, { params });
      allData = response.data.records || [];
    }
    
    // Remove duplicates based on state + district + commodity + variety
    const uniqueData = allData.filter((item, index, self) => {
      const key = `${item.state}-${item.district}-${item.commodity}-${item.variety}`;
      return index === self.findIndex(other => 
        `${other.state}-${other.district}-${other.commodity}-${other.variety}` === key
      );
    });
    
    // Sort by modal price (descending) to show most relevant prices first
    const sortedData = uniqueData.sort((a, b) => {
      const priceA = parseFloat(a.modal_price) || 0;
      const priceB = parseFloat(b.modal_price) || 0;
      return priceB - priceA;
    });
    
    console.log(`Returning ${sortedData.length} unique records`);

    return NextResponse.json({
      success: true,
      data: sortedData,
      total: sortedData.length,
      timestamp: new Date().toISOString(),
      source: 'data.gov.in',
      note: state ? `Prices for top crops in ${state}` : 'Sample mandi prices from multiple states'
    });

  } catch (error) {
    console.error('Mandi prices API error:', error);
    
    // Return error response - no mock data fallback
    return NextResponse.json({
      success: false,
      data: [],
      total: 0,
      timestamp: new Date().toISOString(),
      error: 'Failed to fetch mandi prices from data.gov.in API',
      message: 'Please try again later or contact support if the issue persists'
    }, { status: 500 });
  }
}
