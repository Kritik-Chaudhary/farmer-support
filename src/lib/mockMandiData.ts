// Comprehensive Mock Mandi Price Data for Indian States and Districts
// Updated with realistic prices as of September 2024

export interface MockMandiPrice {
  state: string;
  district: string;
  market: string;
  commodity: string;
  variety: string;
  arrival_date: string;
  min_price: string;
  max_price: string;
  modal_price: string;
}

// Generate today's date in YYYY-MM-DD format
const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const twoDaysAgo = new Date(Date.now() - 172800000).toISOString().split('T')[0];

export const mockMandiPrices: MockMandiPrice[] = [
  // Punjab - Major wheat and rice producing state
  {
    state: 'Punjab',
    district: 'Ludhiana',
    market: 'Ludhiana Mandi',
    commodity: 'Wheat',
    variety: 'Lok-1',
    arrival_date: today,
    min_price: '2180',
    max_price: '2220',
    modal_price: '2200'
  },
  {
    state: 'Punjab',
    district: 'Ludhiana',
    market: 'Ludhiana Mandi',
    commodity: 'Rice',
    variety: 'Basmati-1121',
    arrival_date: today,
    min_price: '4500',
    max_price: '4800',
    modal_price: '4650'
  },
  {
    state: 'Punjab',
    district: 'Amritsar',
    market: 'Amritsar Mandi',
    commodity: 'Wheat',
    variety: 'HD-3086',
    arrival_date: yesterday,
    min_price: '2170',
    max_price: '2210',
    modal_price: '2190'
  },
  {
    state: 'Punjab',
    district: 'Bathinda',
    market: 'Bathinda Mandi',
    commodity: 'Cotton',
    variety: 'Kapas',
    arrival_date: today,
    min_price: '6200',
    max_price: '6400',
    modal_price: '6300'
  },
  {
    state: 'Punjab',
    district: 'Patiala',
    market: 'Patiala Mandi',
    commodity: 'Sugarcane',
    variety: 'Co-0238',
    arrival_date: today,
    min_price: '380',
    max_price: '420',
    modal_price: '400'
  },

  // Haryana - Major agricultural state
  {
    state: 'Haryana',
    district: 'Kurukshetra',
    market: 'Kurukshetra Mandi',
    commodity: 'Wheat',
    variety: 'WH-1105',
    arrival_date: today,
    min_price: '2175',
    max_price: '2215',
    modal_price: '2195'
  },
  {
    state: 'Haryana',
    district: 'Karnal',
    market: 'Karnal Mandi',
    commodity: 'Rice',
    variety: 'PR-126',
    arrival_date: today,
    min_price: '3800',
    max_price: '4000',
    modal_price: '3900'
  },
  {
    state: 'Haryana',
    district: 'Hisar',
    market: 'Hisar Mandi',
    commodity: 'Mustard',
    variety: 'Varuna',
    arrival_date: yesterday,
    min_price: '5200',
    max_price: '5400',
    modal_price: '5300'
  },
  {
    state: 'Haryana',
    district: 'Panipat',
    market: 'Panipat Mandi',
    commodity: 'Sugarcane',
    variety: 'CoJ-64',
    arrival_date: today,
    min_price: '390',
    max_price: '430',
    modal_price: '410'
  },

  // Uttar Pradesh - Largest agricultural state
  {
    state: 'Uttar Pradesh',
    district: 'Meerut',
    market: 'Meerut Mandi',
    commodity: 'Wheat',
    variety: 'UP-2628',
    arrival_date: today,
    min_price: '2160',
    max_price: '2200',
    modal_price: '2180'
  },
  {
    state: 'Uttar Pradesh',
    district: 'Agra',
    market: 'Agra Mandi',
    commodity: 'Potato',
    variety: 'Kufri-Jyoti',
    arrival_date: today,
    min_price: '1200',
    max_price: '1400',
    modal_price: '1300'
  },
  {
    state: 'Uttar Pradesh',
    district: 'Lucknow',
    market: 'Lucknow Mandi',
    commodity: 'Onion',
    variety: 'Nashik Red',
    arrival_date: today,
    min_price: '2800',
    max_price: '3200',
    modal_price: '3000'
  },
  {
    state: 'Uttar Pradesh',
    district: 'Varanasi',
    market: 'Varanasi Mandi',
    commodity: 'Rice',
    variety: 'Saryu-52',
    arrival_date: yesterday,
    min_price: '3600',
    max_price: '3800',
    modal_price: '3700'
  },
  {
    state: 'Uttar Pradesh',
    district: 'Kanpur',
    market: 'Kanpur Mandi',
    commodity: 'Maize',
    variety: 'HQPM-1',
    arrival_date: today,
    min_price: '1800',
    max_price: '1950',
    modal_price: '1875'
  },

  // Maharashtra - Major cotton and sugarcane state
  {
    state: 'Maharashtra',
    district: 'Pune',
    market: 'Pune Mandi',
    commodity: 'Onion',
    variety: 'Nashik Red',
    arrival_date: today,
    min_price: '2500',
    max_price: '2900',
    modal_price: '2700'
  },
  {
    state: 'Maharashtra',
    district: 'Nashik',
    market: 'Nashik Mandi',
    commodity: 'Onion',
    variety: 'Local Red',
    arrival_date: today,
    min_price: '2400',
    max_price: '2800',
    modal_price: '2600'
  },
  {
    state: 'Maharashtra',
    district: 'Nagpur',
    market: 'Nagpur Mandi',
    commodity: 'Cotton',
    variety: 'Bt-Cotton',
    arrival_date: today,
    min_price: '6100',
    max_price: '6350',
    modal_price: '6225'
  },
  {
    state: 'Maharashtra',
    district: 'Mumbai',
    market: 'Mumbai Mandi',
    commodity: 'Tomato',
    variety: 'Hybrid',
    arrival_date: today,
    min_price: '3000',
    max_price: '3500',
    modal_price: '3250'
  },
  {
    state: 'Maharashtra',
    district: 'Kolhapur',
    market: 'Kolhapur Mandi',
    commodity: 'Sugarcane',
    variety: 'Co-86032',
    arrival_date: today,
    min_price: '350',
    max_price: '390',
    modal_price: '370'
  },

  // Gujarat - Major cotton state
  {
    state: 'Gujarat',
    district: 'Ahmedabad',
    market: 'Ahmedabad Mandi',
    commodity: 'Cotton',
    variety: 'DCH-32',
    arrival_date: today,
    min_price: '6150',
    max_price: '6380',
    modal_price: '6265'
  },
  {
    state: 'Gujarat',
    district: 'Rajkot',
    market: 'Rajkot Mandi',
    commodity: 'Groundnut',
    variety: 'TG-37A',
    arrival_date: today,
    min_price: '5200',
    max_price: '5500',
    modal_price: '5350'
  },
  {
    state: 'Gujarat',
    district: 'Surat',
    market: 'Surat Mandi',
    commodity: 'Potato',
    variety: 'Local',
    arrival_date: yesterday,
    min_price: '1100',
    max_price: '1300',
    modal_price: '1200'
  },
  {
    state: 'Gujarat',
    district: 'Vadodara',
    market: 'Vadodara Mandi',
    commodity: 'Wheat',
    variety: 'GW-322',
    arrival_date: today,
    min_price: '2170',
    max_price: '2210',
    modal_price: '2190'
  },

  // Rajasthan - Major mustard state
  {
    state: 'Rajasthan',
    district: 'Jaipur',
    market: 'Jaipur Mandi',
    commodity: 'Mustard',
    variety: 'RH-30',
    arrival_date: today,
    min_price: '5150',
    max_price: '5350',
    modal_price: '5250'
  },
  {
    state: 'Rajasthan',
    district: 'Jodhpur',
    market: 'Jodhpur Mandi',
    commodity: 'Bajra',
    variety: 'HHB-67',
    arrival_date: today,
    min_price: '2200',
    max_price: '2350',
    modal_price: '2275'
  },
  {
    state: 'Rajasthan',
    district: 'Kota',
    market: 'Kota Mandi',
    commodity: 'Soybean',
    variety: 'JS-335',
    arrival_date: yesterday,
    min_price: '4200',
    max_price: '4400',
    modal_price: '4300'
  },
  {
    state: 'Rajasthan',
    district: 'Udaipur',
    market: 'Udaipur Mandi',
    commodity: 'Maize',
    variety: 'Composite',
    arrival_date: today,
    min_price: '1750',
    max_price: '1900',
    modal_price: '1825'
  },

  // Madhya Pradesh - Major soybean state
  {
    state: 'Madhya Pradesh',
    district: 'Bhopal',
    market: 'Bhopal Mandi',
    commodity: 'Soybean',
    variety: 'JS-95-60',
    arrival_date: today,
    min_price: '4180',
    max_price: '4380',
    modal_price: '4280'
  },
  {
    state: 'Madhya Pradesh',
    district: 'Indore',
    market: 'Indore Mandi',
    commodity: 'Wheat',
    variety: 'MP-3288',
    arrival_date: today,
    min_price: '2150',
    max_price: '2190',
    modal_price: '2170'
  },
  {
    state: 'Madhya Pradesh',
    district: 'Gwalior',
    market: 'Gwalior Mandi',
    commodity: 'Mustard',
    variety: 'Kranti',
    arrival_date: yesterday,
    min_price: '5100',
    max_price: '5300',
    modal_price: '5200'
  },
  {
    state: 'Madhya Pradesh',
    district: 'Jabalpur',
    market: 'Jabalpur Mandi',
    commodity: 'Rice',
    variety: 'Kranti',
    arrival_date: today,
    min_price: '3500',
    max_price: '3700',
    modal_price: '3600'
  },

  // West Bengal - Major rice state
  {
    state: 'West Bengal',
    district: 'Kolkata',
    market: 'Kolkata Mandi',
    commodity: 'Rice',
    variety: 'IET-4094',
    arrival_date: today,
    min_price: '3400',
    max_price: '3600',
    modal_price: '3500'
  },
  {
    state: 'West Bengal',
    district: 'Howrah',
    market: 'Howrah Mandi',
    commodity: 'Potato',
    variety: 'Kufri-Chandramukhi',
    arrival_date: today,
    min_price: '1000',
    max_price: '1200',
    modal_price: '1100'
  },
  {
    state: 'West Bengal',
    district: 'Darjeeling',
    market: 'Darjeeling Mandi',
    commodity: 'Tea',
    variety: 'CTC',
    arrival_date: yesterday,
    min_price: '180',
    max_price: '220',
    modal_price: '200'
  },
  {
    state: 'West Bengal',
    district: 'Murshidabad',
    market: 'Murshidabad Mandi',
    commodity: 'Jute',
    variety: 'Tossa',
    arrival_date: today,
    min_price: '4200',
    max_price: '4500',
    modal_price: '4350'
  },

  // Bihar - Major vegetable state
  {
    state: 'Bihar',
    district: 'Patna',
    market: 'Patna Mandi',
    commodity: 'Rice',
    variety: 'Rajshree',
    arrival_date: today,
    min_price: '3300',
    max_price: '3500',
    modal_price: '3400'
  },
  {
    state: 'Bihar',
    district: 'Muzaffarpur',
    market: 'Muzaffarpur Mandi',
    commodity: 'Litchi',
    variety: 'Shahi',
    arrival_date: today,
    min_price: '4000',
    max_price: '4500',
    modal_price: '4250'
  },
  {
    state: 'Bihar',
    district: 'Darbhanga',
    market: 'Darbhanga Mandi',
    commodity: 'Wheat',
    variety: 'HD-2967',
    arrival_date: yesterday,
    min_price: '2120',
    max_price: '2160',
    modal_price: '2140'
  },
  {
    state: 'Bihar',
    district: 'Gaya',
    market: 'Gaya Mandi',
    commodity: 'Maize',
    variety: 'Vivek-Hybrid',
    arrival_date: today,
    min_price: '1700',
    max_price: '1850',
    modal_price: '1775'
  },

  // Andhra Pradesh - Major rice and cotton state
  {
    state: 'Andhra Pradesh',
    district: 'Vijayawada',
    market: 'Vijayawada Mandi',
    commodity: 'Rice',
    variety: 'BPT-5204',
    arrival_date: today,
    min_price: '3600',
    max_price: '3800',
    modal_price: '3700'
  },
  {
    state: 'Andhra Pradesh',
    district: 'Guntur',
    market: 'Guntur Mandi',
    commodity: 'Chilli',
    variety: 'Teja',
    arrival_date: today,
    min_price: '14000',
    max_price: '16000',
    modal_price: '15000'
  },
  {
    state: 'Andhra Pradesh',
    district: 'Kurnool',
    market: 'Kurnool Mandi',
    commodity: 'Cotton',
    variety: 'Bunny-Bt',
    arrival_date: yesterday,
    min_price: '6000',
    max_price: '6300',
    modal_price: '6150'
  },
  {
    state: 'Andhra Pradesh',
    district: 'Visakhapatnam',
    market: 'Visakhapatnam Mandi',
    commodity: 'Turmeric',
    variety: 'Salem',
    arrival_date: today,
    min_price: '11000',
    max_price: '12500',
    modal_price: '11750'
  },

  // Telangana
  {
    state: 'Telangana',
    district: 'Hyderabad',
    market: 'Hyderabad Mandi',
    commodity: 'Rice',
    variety: 'MTU-1010',
    arrival_date: today,
    min_price: '3650',
    max_price: '3850',
    modal_price: '3750'
  },
  {
    state: 'Telangana',
    district: 'Warangal',
    market: 'Warangal Mandi',
    commodity: 'Cotton',
    variety: 'Mallika',
    arrival_date: today,
    min_price: '6050',
    max_price: '6350',
    modal_price: '6200'
  },
  {
    state: 'Telangana',
    district: 'Nizamabad',
    market: 'Nizamabad Mandi',
    commodity: 'Turmeric',
    variety: 'Rajapuri',
    arrival_date: yesterday,
    min_price: '10500',
    max_price: '12000',
    modal_price: '11250'
  },

  // Tamil Nadu - Major rice state
  {
    state: 'Tamil Nadu',
    district: 'Chennai',
    market: 'Chennai Mandi',
    commodity: 'Rice',
    variety: 'ADT-43',
    arrival_date: today,
    min_price: '3500',
    max_price: '3700',
    modal_price: '3600'
  },
  {
    state: 'Tamil Nadu',
    district: 'Coimbatore',
    market: 'Coimbatore Mandi',
    commodity: 'Cotton',
    variety: 'MCU-5',
    arrival_date: today,
    min_price: '5900',
    max_price: '6200',
    modal_price: '6050'
  },
  {
    state: 'Tamil Nadu',
    district: 'Madurai',
    market: 'Madurai Mandi',
    commodity: 'Onion',
    variety: 'Bellary Red',
    arrival_date: today,
    min_price: '2200',
    max_price: '2600',
    modal_price: '2400'
  },
  {
    state: 'Tamil Nadu',
    district: 'Salem',
    market: 'Salem Mandi',
    commodity: 'Turmeric',
    variety: 'Salem Local',
    arrival_date: yesterday,
    min_price: '12000',
    max_price: '13500',
    modal_price: '12750'
  },

  // Karnataka - Major coffee state
  {
    state: 'Karnataka',
    district: 'Bangalore',
    market: 'Bangalore Mandi',
    commodity: 'Rice',
    variety: 'Jaya',
    arrival_date: today,
    min_price: '3400',
    max_price: '3600',
    modal_price: '3500'
  },
  {
    state: 'Karnataka',
    district: 'Mysore',
    market: 'Mysore Mandi',
    commodity: 'Coffee',
    variety: 'Arabica',
    arrival_date: today,
    min_price: '6500',
    max_price: '7200',
    modal_price: '6850'
  },
  {
    state: 'Karnataka',
    district: 'Hubli',
    market: 'Hubli Mandi',
    commodity: 'Cotton',
    variety: 'Hybrid-4',
    arrival_date: yesterday,
    min_price: '5950',
    max_price: '6250',
    modal_price: '6100'
  },
  {
    state: 'Karnataka',
    district: 'Gulbarga',
    market: 'Gulbarga Mandi',
    commodity: 'Sugarcane',
    variety: 'Co-671',
    arrival_date: today,
    min_price: '340',
    max_price: '380',
    modal_price: '360'
  },

  // Kerala - Major spices state
  {
    state: 'Kerala',
    district: 'Kochi',
    market: 'Kochi Mandi',
    commodity: 'Rice',
    variety: 'Jyothi',
    arrival_date: today,
    min_price: '3800',
    max_price: '4000',
    modal_price: '3900'
  },
  {
    state: 'Kerala',
    district: 'Trivandrum',
    market: 'Trivandrum Mandi',
    commodity: 'Coconut',
    variety: 'Tall',
    arrival_date: today,
    min_price: '25',
    max_price: '30',
    modal_price: '27'
  },
  {
    state: 'Kerala',
    district: 'Kozhikode',
    market: 'Kozhikode Mandi',
    commodity: 'Black Pepper',
    variety: 'Malabar',
    arrival_date: yesterday,
    min_price: '52000',
    max_price: '58000',
    modal_price: '55000'
  },
  {
    state: 'Kerala',
    district: 'Idukki',
    market: 'Idukki Mandi',
    commodity: 'Cardamom',
    variety: 'Small',
    arrival_date: today,
    min_price: '150000',
    max_price: '180000',
    modal_price: '165000'
  },

  // Odisha - Major rice state
  {
    state: 'Odisha',
    district: 'Bhubaneswar',
    market: 'Bhubaneswar Mandi',
    commodity: 'Rice',
    variety: 'Swarna',
    arrival_date: today,
    min_price: '3300',
    max_price: '3500',
    modal_price: '3400'
  },
  {
    state: 'Odisha',
    district: 'Cuttack',
    market: 'Cuttack Mandi',
    commodity: 'Jute',
    variety: 'Capsularis',
    arrival_date: today,
    min_price: '4100',
    max_price: '4400',
    modal_price: '4250'
  },
  {
    state: 'Odisha',
    district: 'Rourkela',
    market: 'Rourkela Mandi',
    commodity: 'Maize',
    variety: 'Local',
    arrival_date: yesterday,
    min_price: '1650',
    max_price: '1800',
    modal_price: '1725'
  },

  // Jharkhand
  {
    state: 'Jharkhand',
    district: 'Ranchi',
    market: 'Ranchi Mandi',
    commodity: 'Rice',
    variety: 'Sarna',
    arrival_date: today,
    min_price: '3250',
    max_price: '3450',
    modal_price: '3350'
  },
  {
    state: 'Jharkhand',
    district: 'Jamshedpur',
    market: 'Jamshedpur Mandi',
    commodity: 'Maize',
    variety: 'Suwan',
    arrival_date: today,
    min_price: '1600',
    max_price: '1750',
    modal_price: '1675'
  },

  // Assam
  {
    state: 'Assam',
    district: 'Guwahati',
    market: 'Guwahati Mandi',
    commodity: 'Rice',
    variety: 'Ranjit',
    arrival_date: today,
    min_price: '3200',
    max_price: '3400',
    modal_price: '3300'
  },
  {
    state: 'Assam',
    district: 'Dibrugarh',
    market: 'Dibrugarh Mandi',
    commodity: 'Tea',
    variety: 'Orthodox',
    arrival_date: today,
    min_price: '200',
    max_price: '250',
    modal_price: '225'
  },

  // Himachal Pradesh - Comprehensive data for 18 common commodities
  {
    state: 'Himachal Pradesh',
    district: 'Shimla',
    market: 'Shimla Mandi',
    commodity: 'Apple',
    variety: 'Royal Delicious',
    arrival_date: today,
    min_price: '8000',
    max_price: '10000',
    modal_price: '9000'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Kullu',
    market: 'Kullu Mandi',
    commodity: 'Apple',
    variety: 'Red Delicious',
    arrival_date: yesterday,
    min_price: '7500',
    max_price: '9500',
    modal_price: '8500'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Mandi',
    market: 'Mandi District Mandi',
    commodity: 'Wheat',
    variety: 'HD-3086',
    arrival_date: today,
    min_price: '2150',
    max_price: '2190',
    modal_price: '2170'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Una',
    market: 'Una Mandi',
    commodity: 'Rice',
    variety: 'PR-126',
    arrival_date: today,
    min_price: '3700',
    max_price: '3900',
    modal_price: '3800'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Hamirpur',
    market: 'Hamirpur Mandi',
    commodity: 'Maize',
    variety: 'Local',
    arrival_date: today,
    min_price: '1750',
    max_price: '1850',
    modal_price: '1800'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Solan',
    market: 'Solan Mandi',
    commodity: 'Onion',
    variety: 'Local Red',
    arrival_date: today,
    min_price: '2700',
    max_price: '3100',
    modal_price: '2900'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Bilaspur',
    market: 'Bilaspur Mandi',
    commodity: 'Potato',
    variety: 'Kufri-Jyoti',
    arrival_date: today,
    min_price: '1300',
    max_price: '1500',
    modal_price: '1400'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Kangra',
    market: 'Kangra Mandi',
    commodity: 'Tomato',
    variety: 'Local',
    arrival_date: today,
    min_price: '2500',
    max_price: '2900',
    modal_price: '2700'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Chamba',
    market: 'Chamba Mandi',
    commodity: 'Mustard',
    variety: 'Local',
    arrival_date: yesterday,
    min_price: '5100',
    max_price: '5300',
    modal_price: '5200'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Kinnaur',
    market: 'Kinnaur Mandi',
    commodity: 'Soyabean',
    variety: 'Local',
    arrival_date: today,
    min_price: '4300',
    max_price: '4500',
    modal_price: '4400'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Lahaul Spiti',
    market: 'Keylong Mandi',
    commodity: 'Cotton',
    variety: 'Local',
    arrival_date: today,
    min_price: '6000',
    max_price: '6200',
    modal_price: '6100'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Sirmaur',
    market: 'Nahan Mandi',
    commodity: 'Groundnut',
    variety: 'Local',
    arrival_date: today,
    min_price: '5800',
    max_price: '6000',
    modal_price: '5900'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Mandi',
    market: 'Sundernagar Mandi',
    commodity: 'Bengal Gram(Gram)(Whole)',
    variety: 'Local',
    arrival_date: today,
    min_price: '4800',
    max_price: '5000',
    modal_price: '4900'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Kullu',
    market: 'Bhuntar Mandi',
    commodity: 'Arhar (Tur/Red Gram)(Whole)',
    variety: 'Local',
    arrival_date: yesterday,
    min_price: '6200',
    max_price: '6400',
    modal_price: '6300'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Shimla',
    market: 'Theog Mandi',
    commodity: 'Sugarcane',
    variety: 'Local',
    arrival_date: today,
    min_price: '350',
    max_price: '390',
    modal_price: '370'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Kangra',
    market: 'Palampur Mandi',
    commodity: 'Turmeric',
    variety: 'Local',
    arrival_date: today,
    min_price: '8500',
    max_price: '8900',
    modal_price: '8700'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Una',
    market: 'Amb Mandi',
    commodity: 'Chili Red',
    variety: 'Local',
    arrival_date: today,
    min_price: '9500',
    max_price: '9900',
    modal_price: '9700'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Hamirpur',
    market: 'Nadaun Mandi',
    commodity: 'Jowar(Sorghum)',
    variety: 'Local',
    arrival_date: today,
    min_price: '2300',
    max_price: '2500',
    modal_price: '2400'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Bilaspur',
    market: 'Ghumarwin Mandi',
    commodity: 'Bajra(Pearl Millet/Cumbu)',
    variety: 'Local',
    arrival_date: today,
    min_price: '2400',
    max_price: '2600',
    modal_price: '2500'
  },
  {
    state: 'Himachal Pradesh',
    district: 'Solan',
    market: 'Arki Mandi',
    commodity: 'Sunflower',
    variety: 'Local',
    arrival_date: yesterday,
    min_price: '5600',
    max_price: '5800',
    modal_price: '5700'
  },

  // Uttarakhand
  {
    state: 'Uttarakhand',
    district: 'Dehradun',
    market: 'Dehradun Mandi',
    commodity: 'Rice',
    variety: 'VL-Dhan-65',
    arrival_date: today,
    min_price: '3400',
    max_price: '3600',
    modal_price: '3500'
  },
  {
    state: 'Uttarakhand',
    district: 'Haridwar',
    market: 'Haridwar Mandi',
    commodity: 'Wheat',
    variety: 'UP-2382',
    arrival_date: today,
    min_price: '2140',
    max_price: '2180',
    modal_price: '2160'
  },

  // Chhattisgarh
  {
    state: 'Chhattisgarh',
    district: 'Raipur',
    market: 'Raipur Mandi',
    commodity: 'Rice',
    variety: 'Mahamaya',
    arrival_date: today,
    min_price: '3300',
    max_price: '3500',
    modal_price: '3400'
  },
  {
    state: 'Chhattisgarh',
    district: 'Bilaspur',
    market: 'Bilaspur Mandi',
    commodity: 'Maize',
    variety: 'Navjot',
    arrival_date: yesterday,
    min_price: '1650',
    max_price: '1800',
    modal_price: '1725'
  },

  // Delhi
  {
    state: 'Delhi',
    district: 'New Delhi',
    market: 'Azadpur Mandi',
    commodity: 'Potato',
    variety: 'Jyoti',
    arrival_date: today,
    min_price: '1400',
    max_price: '1600',
    modal_price: '1500'
  },
  {
    state: 'Delhi',
    district: 'New Delhi',
    market: 'Azadpur Mandi',
    commodity: 'Onion',
    variety: 'Maharashtra',
    arrival_date: today,
    min_price: '3200',
    max_price: '3600',
    modal_price: '3400'
  },
  {
    state: 'Delhi',
    district: 'New Delhi',
    market: 'Azadpur Mandi',
    commodity: 'Tomato',
    variety: 'Hybrid',
    arrival_date: today,
    min_price: '2800',
    max_price: '3200',
    modal_price: '3000'
  }
];

// Function to get mock data by filters
export function getMockMandiPrices(filters: {
  state?: string;
  commodity?: string;
  district?: string;
}): MockMandiPrice[] {
  let filteredData = [...mockMandiPrices];

  if (filters.state) {
    filteredData = filteredData.filter(item => 
      item.state.toLowerCase().includes(filters.state!.toLowerCase())
    );
  }

  if (filters.commodity) {
    filteredData = filteredData.filter(item => 
      item.commodity.toLowerCase().includes(filters.commodity!.toLowerCase())
    );
  }

  if (filters.district) {
    filteredData = filteredData.filter(item => 
      item.district.toLowerCase().includes(filters.district!.toLowerCase())
    );
  }

  return filteredData;
}

// Function to get random sample of mock data
export function getRandomMockMandiPrices(count: number = 20): MockMandiPrice[] {
  const shuffled = [...mockMandiPrices].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}