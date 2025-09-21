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

// Top 30 most common crops in India with official agmarknet IDs and names
const topCrops = [
  { id: '3', name: 'Rice' },
  { id: '1', name: 'Wheat' },
  { id: '4', name: 'Maize' },
  { id: '23', name: 'Onion' },
  { id: '24', name: 'Potato' },
  { id: '78', name: 'Tomato' },
  { id: '26', name: 'Chili Red' },
  { id: '87', name: 'Green Chilli' },
  { id: '39', name: 'Turmeric' },
  { id: '12', name: 'Mustard' },
  { id: '5', name: 'Jowar(Sorghum)' },
  { id: '28', name: 'Bajra(Pearl Millet/Cumbu)' },
  { id: '6', name: 'Bengal Gram(Gram)(Whole)' },
  { id: '49', name: 'Arhar (Tur/Red Gram)(Whole)' },
  { id: '9', name: 'Green Gram (Moong)(Whole)' },
  { id: '8', name: 'Black Gram (Urd Beans)(Whole)' },
  { id: '63', name: 'Lentil (Masur)(Whole)' },
  { id: '19', name: 'Banana' },
  { id: '20', name: 'Mango' },
  { id: '138', name: 'Coconut' },
  { id: '10', name: 'Groundnut' },
  { id: '13', name: 'Soyabean' },
  { id: '14', name: 'Sunflower' },
  { id: '11', name: 'Sesamum(Sesame,Gingelly,Til)' },
  { id: '15', name: 'Cotton' },
  { id: '150', name: 'Sugarcane' },
  { id: '25', name: 'Garlic' },
  { id: '27', name: 'Ginger(Dry)' },
  { id: '103', name: 'Ginger(Green)' },
  { id: '22', name: 'Grapes' },
  { id: '72', name: 'Papaya' },
  { id: '34', name: 'Cauliflower' },
  { id: '154', name: 'Cabbage' },
  { id: '35', name: 'Brinjal' },
  { id: '50', name: 'Green Peas' }
];

// Helper function to find commodity by name or ID
function getCommodityInfo(searchTerm: string) {
  return topCrops.find(crop => 
    crop.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    crop.id === searchTerm
  );
}

// Helper function to get all commodity names for reference
function getAllCommodityNames() {
  return topCrops.map(crop => crop.name);
}

// Function to try different date ranges
// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function fetchWithDateFallback(apiUrl: string, baseParams: Record<string, any>) {
  const dates = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    dates.push(date.toISOString().split('T')[0]);
  }
  
  for (const date of dates) {
    try {
      console.log(`Trying to fetch data for date: ${date}`);
      const params = {
        ...baseParams,
        'filters[arrival_date]': date
      };
      
      const response = await axios.get(apiUrl, { params });
      const data = response.data.records || [];
      
      if (data.length > 0) {
        console.log(`Found ${data.length} records for date: ${date}`);
        return data;
      }
    } catch (error) {
      console.log(`Error fetching data for ${date}:`, error);
    }
  }
  
  return [];
}

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
      // If specific commodity requested, fetch it with date fallback
      const baseParams = {
        'api-key': process.env.DATA_GOV_API_KEY || '',
        'format': 'json',
        'limit': 100,
        'offset': 0,
        ...(state && { 'filters[state]': state }),
        ...(district && { 'filters[district]': district }),
        'filters[commodity]': commodity
      };
      
      allData = await fetchWithDateFallback(apiUrl, baseParams);
    } else if (state) {
      // If state is selected, fetch top crops for that state with date fallback
      console.log('Fetching top crops for state:', state);
      
      // Try a few top crops with date fallback
      const priorityCrops = topCrops.slice(0, 10);
      
      for (const crop of priorityCrops) {
        const baseParams = {
          'api-key': process.env.DATA_GOV_API_KEY || '',
          'format': 'json',
          'limit': 10,
          'offset': 0,
          'filters[state]': state,
          'filters[commodity]': crop.name,
          ...(district && { 'filters[district]': district })
        };
        
        try {
          const cropData = await fetchWithDateFallback(apiUrl, baseParams);
          if (cropData.length > 0) {
            allData.push(...cropData);
            console.log(`Found ${cropData.length} records for ${crop.name}`);
            // Stop after getting enough data
            if (allData.length >= 20) break;
          }
        } catch (error) {
          console.log(`Error fetching ${crop.name}: ${error}`);
        }
      }
      
      console.log(`Found ${allData.length} total records for ${state}`);
    } else {
      // No state selected, get sample data with date fallback
      const baseParams = {
        'api-key': process.env.DATA_GOV_API_KEY || '',
        'format': 'json',
        'limit': 100,
        'offset': 0
      };
      
      allData = await fetchWithDateFallback(apiUrl, baseParams);
    }
    
    // Check if we have any data
    if (allData.length === 0) {
      console.log('No mandi price data found for the last 7 days');
      return NextResponse.json({
        success: false,
        data: [],
        total: 0,
        timestamp: new Date().toISOString(),
        source: 'data.gov.in API (agmarknet)',
        metadata: {
          state_searched: state || 'All states',
          district_searched: district || 'All districts',
          commodity_searched: commodity || 'Top crops auto-selected',
          days_checked: 7,
          method: 'date_fallback_exhausted'
        },
        error: 'No mandi price data available',
        message: `No price data found for ${commodity || 'requested commodities'} in ${state || 'the specified region'} for the last 7 days. This could be due to market holidays, data unavailability, or technical issues with the source.`
      }, { status: 404 });
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
    
    // Get unique commodities in the result for metadata
    const uniqueCommodities = [...new Set(sortedData.map(item => item.commodity))];
    const searchedCommodity = commodity ? getCommodityInfo(commodity) : null;
    
    // Get the most recent date from the data
    const mostRecentDate = sortedData.length > 0 ? sortedData[0].arrival_date : 'N/A';

    return NextResponse.json({
      success: true,
      data: sortedData,
      total: sortedData.length,
      timestamp: new Date().toISOString(),
      source: 'data.gov.in API (agmarknet) with date fallback',
      metadata: {
        state_searched: state || 'All states',
        district_searched: district || 'All districts',
        commodity_searched: commodity || 'Top crops auto-selected',
        commodity_info: searchedCommodity,
        unique_commodities_found: uniqueCommodities,
        total_commodities_searched: state && !commodity ? topCrops.length : (commodity ? 1 : 'multiple'),
        available_commodities: getAllCommodityNames(),
        data_date: mostRecentDate,
        method: 'live_api_with_date_fallback'
      },
      note: `Live mandi prices for ${commodity || 'top crops'} in ${state || 'multiple states'} - Data from ${mostRecentDate}`
    });

  } catch (error) {
    console.error('Mandi prices API error:', error);
    
    return NextResponse.json({
      success: false,
      data: [],
      total: 0,
      timestamp: new Date().toISOString(),
      source: 'data.gov.in API (agmarknet)',
      metadata: {
        state_searched: state || 'All states',
        district_searched: district || 'All districts',
        commodity_searched: commodity || 'Top crops auto-selected',
        method: 'api_error'
      },
      error: 'Failed to fetch mandi prices from data.gov.in API',
      message: 'Unable to fetch mandi prices due to API connectivity issues. Please try again later or contact support if the issue persists.'
    }, { status: 500 });
  }
}
