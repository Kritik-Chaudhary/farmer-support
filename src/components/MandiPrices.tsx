'use client';

import { useState, useEffect } from 'react';
import { TrendingUp, Search } from 'lucide-react';

interface MandiPrice {
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

export default function MandiPrices() {
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [selectedCommodity, setSelectedCommodity] = useState('');

  useEffect(() => {
    fetchPrices();
  }, [selectedState, selectedCommodity]); // fetchPrices is stable

  const fetchPrices = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedState) params.append('state', selectedState);
      if (selectedCommodity) params.append('commodity', selectedCommodity);

      const response = await fetch(`/api/mandi-prices?${params}`);
      const data = await response.json();
      setPrices(data.data || []);
    } catch (error) {
      console.error('Error fetching mandi prices:', error);
    } finally {
      setLoading(false);
    }
  };

  const states = [
    { code: 'AN', name: 'Andaman and Nicobar' },
    { code: 'AP', name: 'Andhra Pradesh' },
    { code: 'AR', name: 'Arunachal Pradesh' },
    { code: 'AS', name: 'Assam' },
    { code: 'BI', name: 'Bihar' },
    { code: 'CH', name: 'Chandigarh' },
    { code: 'CG', name: 'Chattisgarh' },
    { code: 'DN', name: 'Dadra and Nagar Haveli' },
    { code: 'DD', name: 'Daman and Diu' },
    { code: 'GO', name: 'Goa' },
    { code: 'GJ', name: 'Gujarat' },
    { code: 'HR', name: 'Haryana' },
    { code: 'HP', name: 'Himachal Pradesh' },
    { code: 'JK', name: 'Jammu and Kashmir' },
    { code: 'JR', name: 'Jharkhand' },
    { code: 'KK', name: 'Karnataka' },
    { code: 'KL', name: 'Kerala' },
    { code: 'LD', name: 'Lakshadweep' },
    { code: 'MP', name: 'Madhya Pradesh' },
    { code: 'MH', name: 'Maharashtra' },
    { code: 'MN', name: 'Manipur' },
    { code: 'MG', name: 'Meghalaya' },
    { code: 'MZ', name: 'Mizoram' },
    { code: 'NG', name: 'Nagaland' },
    { code: 'DL', name: 'NCT of Delhi' },
    { code: 'OR', name: 'Odisha' },
    { code: 'PC', name: 'Pondicherry' },
    { code: 'PB', name: 'Punjab' },
    { code: 'RJ', name: 'Rajasthan' },
    { code: 'SK', name: 'Sikkim' },
    { code: 'TN', name: 'Tamil Nadu' },
    { code: 'TL', name: 'Telangana' },
    { code: 'TR', name: 'Tripura' },
    { code: 'UP', name: 'Uttar Pradesh' },
    { code: 'UC', name: 'Uttrakhand' },
    { code: 'WB', name: 'West Bengal' }
  ];
  const commodities = [
    'Wheat',
    'Rice',
    'Paddy',
    'Maize',
    'Jowar',
    'Bajra',
    'Barley',
    'Gram',
    'Tur/Arhar',
    'Moong',
    'Urad',
    'Masur',
    'Cotton',
    'Groundnut',
    'Soybean',
    'Sunflower',
    'Mustard',
    'Sesame',
    'Sugarcane',
    'Onion',
    'Potato',
    'Tomato',
    'Brinjal',
    'Okra/Lady Finger',
    'Cauliflower',
    'Cabbage',
    'Green Chilli',
    'Capsicum',
    'Ginger',
    'Garlic',
    'Turmeric',
    'Apple',
    'Banana',
    'Mango',
    'Orange',
    'Grapes',
    'Pomegranate',
    'Coconut',
    'Arecanut',
    'Tea',
    'Coffee',
    'Rubber',
    'Black Pepper',
    'Cardamom'
  ];

  const filteredPrices = prices.filter(price =>
    price.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    price.market.toLowerCase().includes(searchTerm.toLowerCase()) ||
    price.district.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
          Live Mandi Prices
        </h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search commodity or market..."
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900 font-medium placeholder-gray-500 bg-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">State/UT</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900 font-medium bg-white"
            >
              <option value="" className="text-gray-900 font-medium">All States/UTs</option>
              {states.map(state => (
                <option key={state.code} value={state.code} className="text-gray-900 font-medium">{state.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Commodity</label>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900 font-medium bg-white"
            >
              <option value="" className="text-gray-900 font-medium">All Commodities</option>
              {commodities.map(commodity => (
                <option key={commodity} value={commodity} className="text-gray-900 font-medium">{commodity}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Hint */}
      <div className="md:hidden bg-blue-50 border border-blue-200 p-3 rounded-lg text-sm text-blue-800 font-medium">
        <p className="flex items-center">
          <span className="mr-2">ℹ️</span>
          Swipe left/right to see all columns
        </p>
      </div>

      {/* Price Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Commodity
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Market
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  District
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  State
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Min Price (₹/Quintal)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Max Price (₹/Quintal)
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Modal Price (₹/Quintal)
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredPrices.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No prices found
                  </td>
                </tr>
              ) : (
                filteredPrices.map((price, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {price.commodity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {price.market}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {price.district}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-700">
                      {price.state}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{price.min_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                      ₹{price.max_price}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700 bg-green-50 rounded">
                      ₹{price.modal_price}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}