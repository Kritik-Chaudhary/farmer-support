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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stateCode = searchParams.get('state') || '';
  const district = searchParams.get('district') || '';
  const commodity = searchParams.get('commodity') || '';
  
  // Convert state code to name for API
  const state = stateCodeToName[stateCode] || stateCode;
  
  try {

    // Data.gov.in API endpoint for mandi prices
    const apiUrl = 'https://api.data.gov.in/resource/9ef84268-d588-465a-a308-a864a43d0070';
    
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: Record<string, any> = {
      'api-key': process.env.DATA_GOV_API_KEY || '',
      'format': 'json',
      'limit': 20,
      'offset': 0
    };

    // Add filters if provided
    if (state) params['filters[state]'] = state;
    if (district) params['filters[district]'] = district;
    if (commodity) params['filters[commodity]'] = commodity;

    const response = await axios.get(apiUrl, { params });

    const mandiData = response.data;

    return NextResponse.json({
      success: true,
      data: mandiData.records || [],
      total: mandiData.total || 0,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('Mandi prices API error:', error);
    
    // Return mock data if API fails
    const allMockData = [
      {
        state: 'Maharashtra',
        district: 'Pune',
        market: 'Pune(Khadiki)',
        commodity: 'Onion',
        variety: 'Red',
        arrival_date: new Date().toISOString().split('T')[0],
        min_price: '2000',
        max_price: '3500',
        modal_price: '2800'
      },
      {
        state: 'Punjab',
        district: 'Ludhiana',
        market: 'Ludhiana',
        commodity: 'Wheat',
        variety: 'PBW-343',
        arrival_date: new Date().toISOString().split('T')[0],
        min_price: '2125',
        max_price: '2350',
        modal_price: '2225'
      },
      {
        state: 'West Bengal',
        district: 'Burdwan',
        market: 'Burdwan',
        commodity: 'Rice',
        variety: 'Swarna',
        arrival_date: new Date().toISOString().split('T')[0],
        min_price: '2100',
        max_price: '2400',
        modal_price: '2250'
      },
      {
        state: 'Gujarat',
        district: 'Rajkot',
        market: 'Rajkot',
        commodity: 'Groundnut',
        variety: 'Bold',
        arrival_date: new Date().toISOString().split('T')[0],
        min_price: '5200',
        max_price: '5800',
        modal_price: '5500'
      },
      {
        state: 'Uttar Pradesh',
        district: 'Agra',
        market: 'Agra',
        commodity: 'Potato',
        variety: 'Red',
        arrival_date: new Date().toISOString().split('T')[0],
        min_price: '800',
        max_price: '1200',
        modal_price: '1000'
      },
      {
        state: 'Karnataka',
        district: 'Bangalore',
        market: 'Bangalore',
        commodity: 'Tomato',
        variety: 'Hybrid',
        arrival_date: new Date().toISOString().split('T')[0],
        min_price: '1500',
        max_price: '2500',
        modal_price: '2000'
      },
      {
        state: 'Tamil Nadu',
        district: 'Coimbatore',
        market: 'Coimbatore',
        commodity: 'Coconut',
        variety: 'Medium',
        arrival_date: new Date().toISOString().split('T')[0],
        min_price: '9000',
        max_price: '11000',
        modal_price: '10000'
      },
      {
        state: 'Madhya Pradesh',
        district: 'Indore',
        market: 'Indore',
        commodity: 'Soybean',
        variety: 'Yellow',
        arrival_date: new Date().toISOString().split('T')[0],
        min_price: '6200',
        max_price: '6800',
        modal_price: '6500'
      },
      {
        state: 'Haryana',
        district: 'Karnal',
        market: 'Karnal',
        commodity: 'Rice',
        variety: 'Basmati',
        arrival_date: new Date().toISOString().split('T')[0],
        min_price: '3800',
        max_price: '4200',
        modal_price: '4000'
      },
      {
        state: 'Rajasthan',
        district: 'Jaipur',
        market: 'Jaipur(Muhana)',
        commodity: 'Mustard',
        variety: 'Yellow',
        arrival_date: new Date().toISOString().split('T')[0],
        min_price: '5400',
        max_price: '5800',
        modal_price: '5600'
      }
    ];
    
    // Filter mock data based on state if provided
    let mockData = allMockData;
    if (state && state !== stateCode) {
      mockData = allMockData.filter(item => item.state === state);
    }
    if (commodity) {
      mockData = mockData.filter(item => 
        item.commodity.toLowerCase().includes(commodity.toLowerCase())
      );
    }

    return NextResponse.json({
      success: true,
      data: mockData,
      total: mockData.length,
      timestamp: new Date().toISOString(),
      note: 'Showing sample data due to API unavailability'
    });
  }
}