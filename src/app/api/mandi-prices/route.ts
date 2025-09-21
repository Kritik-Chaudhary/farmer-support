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
      
      const cropPromises = topCrops.slice(0, 30).map(async (crop) => {
        try {
          const params = {
            'api-key': process.env.DATA_GOV_API_KEY || '',
            'format': 'json',
            'limit': 5, // Get top 5 records per crop to manage response size
            'offset': 0,
            'filters[state]': state,
            'filters[commodity]': crop.name, // Use crop name for API call
            ...(district && { 'filters[district]': district })
          };
          
          const response = await axios.get(apiUrl, { params });
          return response.data.records || [];
        } catch (error) {
          console.log(`No data found for crop: ${crop.name} (ID: ${crop.id}) in state: ${state}`);
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
    
    // Get unique commodities in the result for metadata
    const uniqueCommodities = [...new Set(sortedData.map(item => item.commodity))];
    const searchedCommodity = commodity ? getCommodityInfo(commodity) : null;

    return NextResponse.json({
      success: true,
      data: sortedData,
      total: sortedData.length,
      timestamp: new Date().toISOString(),
      source: 'data.gov.in API (agmarknet)',
      metadata: {
        state_searched: state || 'All states',
        district_searched: district || 'All districts',
        commodity_searched: commodity || 'Top crops auto-selected',
        commodity_info: searchedCommodity,
        unique_commodities_found: uniqueCommodities,
        total_commodities_searched: state && !commodity ? topCrops.length : (commodity ? 1 : 'multiple'),
        available_commodities: getAllCommodityNames()
      },
      note: state ? `Mandi prices for ${commodity || 'top crops'} in ${state}` : 'Sample mandi prices from multiple states'
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
