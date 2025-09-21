import { NextRequest, NextResponse } from 'next/server';
import axios from 'axios';

// State code to name mapping for agmarknet
const stateMapping: Record<string, { code: string, name: string }> = {
  'AN': { code: '35', name: 'Andaman and Nicobar' },
  'AP': { code: '28', name: 'Andhra Pradesh' },
  'AR': { code: '12', name: 'Arunachal Pradesh' },
  'AS': { code: '18', name: 'Assam' },
  'BI': { code: '10', name: 'Bihar' },
  'CH': { code: '4', name: 'Chandigarh' },
  'CG': { code: '36', name: 'Chhattisgarh' },
  'DN': { code: '25', name: 'Dadra and Nagar Haveli' },
  'DD': { code: '26', name: 'Daman and Diu' },
  'GO': { code: '30', name: 'Goa' },
  'GJ': { code: '24', name: 'Gujarat' },
  'HR': { code: '6', name: 'Haryana' },
  'HP': { code: '2', name: 'Himachal Pradesh' },
  'JK': { code: '1', name: 'Jammu and Kashmir' },
  'JR': { code: '20', name: 'Jharkhand' },
  'KK': { code: '29', name: 'Karnataka' },
  'KL': { code: '32', name: 'Kerala' },
  'LD': { code: '31', name: 'Lakshadweep' },
  'MP': { code: '23', name: 'Madhya Pradesh' },
  'MH': { code: '27', name: 'Maharashtra' },
  'MN': { code: '14', name: 'Manipur' },
  'MG': { code: '17', name: 'Meghalaya' },
  'MZ': { code: '15', name: 'Mizoram' },
  'NG': { code: '13', name: 'Nagaland' },
  'DL': { code: '7', name: 'NCT of Delhi' },
  'OR': { code: '21', name: 'Odisha' },
  'PC': { code: '34', name: 'Puducherry' },
  'PB': { code: '3', name: 'Punjab' },
  'RJ': { code: '8', name: 'Rajasthan' },
  'SK': { code: '11', name: 'Sikkim' },
  'TN': { code: '33', name: 'Tamil Nadu' },
  'TL': { code: '37', name: 'Telangana' },
  'TR': { code: '16', name: 'Tripura' },
  'UP': { code: '9', name: 'Uttar Pradesh' },
  'UC': { code: '5', name: 'Uttarakhand' },
  'WB': { code: '19', name: 'West Bengal' }
};

// Top commodities with their IDs from agmarknet
const topCommodities = [
  { id: '3', name: 'Rice', priority: 1 },
  { id: '1', name: 'Wheat', priority: 1 },
  { id: '4', name: 'Maize', priority: 1 },
  { id: '23', name: 'Onion', priority: 1 },
  { id: '24', name: 'Potato', priority: 1 },
  { id: '78', name: 'Tomato', priority: 1 },
  { id: '26', name: 'Chili Red', priority: 2 },
  { id: '87', name: 'Green Chilli', priority: 2 },
  { id: '39', name: 'Turmeric', priority: 2 },
  { id: '5', name: 'Jowar(Sorghum)', priority: 2 },
  { id: '28', name: 'Bajra(Pearl Millet/Cumbu)', priority: 2 },
  { id: '6', name: 'Bengal Gram(Gram)(Whole)', priority: 2 },
  { id: '49', name: 'Arhar (Tur/Red Gram)(Whole)', priority: 2 },
  { id: '9', name: 'Green Gram (Moong)(Whole)', priority: 2 },
  { id: '8', name: 'Black Gram (Urd Beans)(Whole)', priority: 2 },
  { id: '19', name: 'Banana', priority: 3 },
  { id: '20', name: 'Mango', priority: 3 },
  { id: '138', name: 'Coconut', priority: 3 },
  { id: '10', name: 'Groundnut', priority: 2 },
  { id: '13', name: 'Soyabean', priority: 2 }
];

// Function to scrape agmarknet data with date fallback
async function scrapeAgmarknetData(stateCode?: string, commodityId?: string, dateOffset: number = 0) {
  try {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() - dateOffset);
    
    const dateStr = targetDate.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    }).replace(/ /g, '-');

    console.log(`Attempting to fetch data for date: ${dateStr} (offset: ${dateOffset} days)`);

    // Base URL for agmarknet search
    const baseUrl = 'https://agmarknet.gov.in/SearchCmmMkt.aspx';
    
    const params = new URLSearchParams({
      'Tx_Commodity': commodityId || '0',
      'Tx_State': stateCode || '0',
      'Tx_District': '0',
      'Tx_Market': '0',
      'DateFrom': dateStr,
      'DateTo': dateStr,
      'Fr': '',
      'To': '',
      'Tx_Trend': '2',
      'Tx_CommodityHead': commodityId ? (topCommodities.find(c => c.id === commodityId)?.name || '--Select--') : '--Select--',
      'Tx_StateHead': stateCode ? (Object.values(stateMapping).find(s => s.code === stateCode)?.name || '--Select--') : '--Select--',
      'Tx_DistrictHead': '--Select--',
      'Tx_MarketHead': '--Select--'
    });

    const response = await axios.get(`${baseUrl}?${params.toString()}`, {
      timeout: 15000,
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // Simple HTML parsing to extract price data
    const html = response.data;
    const rows: Array<{
      state: string;
      district: string;
      market: string;
      commodity: string;
      variety: string;
      arrival_date: string;
      min_price: string;
      max_price: string;
      modal_price: string;
      grade: string;
    }> = [];
    
    // Look for table data - this is a simplified parser
    // In a production environment, you'd use a proper HTML parser like Cheerio
    const tableMatches = html.match(/<tr[^>]*>[\s\S]*?<\/tr>/gi);
    
    if (tableMatches) {
      tableMatches.forEach((row: string) => {
        const cells = row.match(/<td[^>]*>([\s\S]*?)<\/td>/gi);
        if (cells && cells.length >= 8) {
          try {
            const cleanCell = (cell: string) => cell.replace(/<[^>]*>/g, '').trim();
            
            const rowData = {
              state: cleanCell(cells[0] || ''),
              district: cleanCell(cells[1] || ''),
              market: cleanCell(cells[2] || ''),
              commodity: cleanCell(cells[3] || ''),
              variety: cleanCell(cells[4] || ''),
              arrival_date: dateStr,
              min_price: cleanCell(cells[5] || ''),
              max_price: cleanCell(cells[6] || ''),
              modal_price: cleanCell(cells[7] || ''),
              grade: cleanCell(cells[8] || '') || 'FAQ'
            };
            
            // Only add if we have valid data
            if (rowData.commodity && rowData.modal_price && 
                rowData.modal_price !== '' && rowData.modal_price !== '--') {
              rows.push(rowData);
            }
          } catch {
            // Skip malformed rows
            console.log('Skipping malformed row');
          }
        }
      });
    }

    console.log(`Found ${rows.length} records for date: ${dateStr}`);
    return rows;
  } catch (error) {
    console.error(`Error scraping agmarknet for date offset ${dateOffset}:`, error);
    return [];
  }
}

// Function to try fetching data with date fallback (today, yesterday, day before)
async function scrapeWithDateFallback(stateCode?: string, commodityId?: string) {
  // Try today first
  let data = await scrapeAgmarknetData(stateCode, commodityId, 0);
  
  if (data.length === 0) {
    console.log('No data found for today, trying yesterday...');
    data = await scrapeAgmarknetData(stateCode, commodityId, 1);
  }
  
  if (data.length === 0) {
    console.log('No data found for yesterday, trying day before yesterday...');
    data = await scrapeAgmarknetData(stateCode, commodityId, 2);
  }
  
  if (data.length === 0) {
    console.log('No data found for the last 3 days, trying 3 days ago...');
    data = await scrapeAgmarknetData(stateCode, commodityId, 3);
  }
  
  return data;
}


export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const stateParam = searchParams.get('state') || '';
  const commodity = searchParams.get('commodity') || '';
  
  // Convert state code to agmarknet code
  const stateInfo = stateMapping[stateParam];
  const stateCode = stateInfo?.code;
  
  console.log('Fetching mandi prices v2 for:', { 
    state: stateParam, 
    stateName: stateInfo?.name,
    stateCode: stateCode,
    commodity 
  });
  
  try {
    let allData: Array<{
      state: string;
      district: string;
      market: string;
      commodity: string;
      variety: string;
      arrival_date: string;
      min_price: string;
      max_price: string;
      modal_price: string;
      grade: string;
    }> = [];
    
    if (commodity) {
      // Fetch specific commodity with date fallback
      const commodityInfo = topCommodities.find(c => c.name.toLowerCase().includes(commodity.toLowerCase()));
      if (commodityInfo) {
        console.log(`Fetching data for commodity: ${commodity} (ID: ${commodityInfo.id})`);
        allData = await scrapeWithDateFallback(stateCode, commodityInfo.id);
      }
    } else if (stateCode) {
      // Fetch top commodities for the state with date fallback
      console.log(`Fetching top commodities for state: ${stateInfo.name} (Code: ${stateCode})`);
      
      // Try priority 1 commodities first
      const priority1Commodities = topCommodities.filter(c => c.priority === 1);
      
      for (const commodity of priority1Commodities) {
        try {
          const data = await scrapeWithDateFallback(stateCode, commodity.id);
          if (data.length > 0) {
            allData.push(...data);
            console.log(`Found ${data.length} records for ${commodity.name}`);
            // Break after finding data for 2-3 commodities to avoid timeout
            if (allData.length >= 15) break;
          }
          // Small delay to avoid overwhelming the server
          await new Promise(resolve => setTimeout(resolve, 1000));
        } catch (error) {
          console.log(`Error fetching ${commodity.name}: ${error}`);
        }
      }
      
      // If still no data, try priority 2 commodities
      if (allData.length === 0) {
        console.log('No data found for priority 1 commodities, trying priority 2...');
        const priority2Commodities = topCommodities.filter(c => c.priority === 2).slice(0, 3);
        
        for (const commodity of priority2Commodities) {
          try {
            const data = await scrapeWithDateFallback(stateCode, commodity.id);
            if (data.length > 0) {
              allData.push(...data);
              console.log(`Found ${data.length} records for ${commodity.name}`);
              break; // Stop after finding first working commodity
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
          } catch (error) {
            console.log(`Error fetching ${commodity.name}: ${error}`);
          }
        }
      }
    } else {
      // Fetch general data with date fallback
      console.log('Fetching general mandi data');
      allData = await scrapeWithDateFallback();
    }
    
    // Check if we have any data
    if (allData.length === 0) {
      console.log('No mandi price data found for the last 4 days');
      return NextResponse.json({
        success: false,
        data: [],
        total: 0,
        timestamp: new Date().toISOString(),
        source: 'agmarknet.gov.in (enhanced scraping)',
        metadata: {
          state_searched: stateInfo?.name || stateParam || 'All states',
          state_code: stateCode || 'N/A',
          commodity_searched: commodity || 'Top commodities',
          method: 'live_scraping_failed',
          available_states: Object.keys(stateMapping).length,
          available_commodities: topCommodities.length,
          days_checked: 4
        },
        error: 'No mandi price data available',
        message: `No price data found for ${commodity || 'requested commodities'} in ${stateInfo?.name || 'the specified region'} for the last 4 days. This could be due to market holidays, data unavailability, or technical issues with the source.`
      }, { status: 404 });
    }
    
    // Remove duplicates and sort
    const uniqueData = allData.filter((item, index, self) => {
      const key = `${item.state}-${item.district}-${item.commodity}-${item.variety}`;
      return index === self.findIndex(other => 
        `${other.state}-${other.district}-${other.commodity}-${other.variety}` === key
      );
    });
    
    const sortedData = uniqueData.sort((a, b) => {
      const priceA = parseFloat(a.modal_price) || 0;
      const priceB = parseFloat(b.modal_price) || 0;
      return priceB - priceA;
    });
    
    // Determine the most recent date from the data
    const mostRecentDate = sortedData.length > 0 ? sortedData[0].arrival_date : 'N/A';
    
    console.log(`Returning ${sortedData.length} unique records with most recent data from: ${mostRecentDate}`);
    
    return NextResponse.json({
      success: true,
      data: sortedData,
      total: sortedData.length,
      timestamp: new Date().toISOString(),
      source: 'agmarknet.gov.in (enhanced scraping with date fallback)',
      metadata: {
        state_searched: stateInfo?.name || stateParam || 'All states',
        state_code: stateCode || 'N/A',
        commodity_searched: commodity || 'Top commodities',
        method: 'live_scraping_with_date_fallback',
        available_states: Object.keys(stateMapping).length,
        available_commodities: topCommodities.length,
        data_date: mostRecentDate,
        data_freshness: mostRecentDate === new Date().toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short', 
          year: 'numeric'
        }).replace(/ /g, '-') ? 'today' : 'historical'
      },
      note: `Live mandi prices for ${commodity || 'top crops'} in ${stateInfo?.name || 'multiple states'} - Data from ${mostRecentDate}`
    });

  } catch (error) {
    console.error('Enhanced mandi prices API error:', error);
    
    return NextResponse.json({
      success: false,
      data: [],
      total: 0,
      timestamp: new Date().toISOString(),
      source: 'agmarknet.gov.in (enhanced scraping)',
      metadata: {
        state_searched: stateMapping[stateParam]?.name || stateParam || 'All states',
        commodity_searched: commodity || 'Top commodities',
        method: 'scraping_error',
        error_message: 'Technical error occurred while fetching data'
      },
      error: 'API temporarily unavailable',
      message: 'Unable to fetch mandi prices due to technical issues. Please try again in a few moments.'
    }, { status: 500 });
  }
}