'use client';

import { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Search } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface MandiPrice {
  state: string;
  commodity: string;
  price: number;
  unit: string;
  date: string;
  originalCommodity?: string;
  originalState?: string;
}

export default function MandiPrices() {
  const { t, i18n } = useTranslation();
  const [prices, setPrices] = useState<MandiPrice[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('UC'); // Default to Uttarakhand
  const [selectedCommodity, setSelectedCommodity] = useState('');

  const fetchPrices = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedState) params.append('state', selectedState);
      if (selectedCommodity) params.append('commodity', selectedCommodity);
      
      // Use current language from i18n
      params.append('lang', i18n.language);

      const response = await fetch(`/api/mandi-prices?${params}`);
      const data = await response.json();
      setPrices(data.data || []);
      console.log('Fetched prices with language:', i18n.language, data.data?.slice(0, 3));
    } catch (error) {
      console.error('Error fetching mandi prices:', error);
    } finally {
      setLoading(false);
    }
  }, [selectedState, selectedCommodity, i18n.language]);

  useEffect(() => {
    fetchPrices();
  }, [fetchPrices]); // fetchPrices now includes all dependencies

  // Base state list
  const baseStates = [
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
  
  // State translations mapping (comprehensive)
  const stateTranslations: Record<string, Record<string, string>> = {
    'Andaman and Nicobar': { en: 'Andaman and Nicobar', hi: 'अंडमान और निकोबार', pa: 'ਅੰਡੇਮਾਨ ਅਤੇ ਨਿਕੋਬਾਰ', ta: 'அந்தமான் நிக்கோபார்', te: 'అండమాన్ నికోబార్', mr: 'अंडमान आणि निकोबार', gu: 'અંદામાન અને નિકોબાર', bn: 'আন্দামান ও নিকোবর' },
    'Andhra Pradesh': { en: 'Andhra Pradesh', hi: 'आंध्र प्रदेश', pa: 'ਆਂਧਰਾ ਪ੍ਰਦੇਸ਼', ta: 'ஆந்திரப் பிரதேசம்', te: 'ఆంధ్ర ప్రదేశ్', mr: 'आंध्र प्रदेश', gu: 'આંધ્ર પ્રદેશ', bn: 'অন্ধ্র প্রদেশ' },
    'Arunachal Pradesh': { en: 'Arunachal Pradesh', hi: 'अरुणाचल प्रदेश', pa: 'ਅਰੁਣਾਚਲ ਪ੍ਰਦੇਸ਼', ta: 'அருணாசலப் பிரதேசம்', te: 'అరుణాచల్ ప్రదేశ్', mr: 'अरुणाचल प्रदेश', gu: 'અરુણાચલ પ્રદેશ', bn: 'অরুণাচল প্রদেশ' },
    'Assam': { en: 'Assam', hi: 'असम', pa: 'ਆਸਾਮ', ta: 'அசாம்', te: 'అస్సాం', mr: 'आसाम', gu: 'આસામ', bn: 'আসাম' },
    'Bihar': { en: 'Bihar', hi: 'बिहार', pa: 'ਬਿਹਾਰ', ta: 'பிகார்', te: 'బిహార్', mr: 'बिहार', gu: 'બિહાર', bn: 'বিহার' },
    'Chandigarh': { en: 'Chandigarh', hi: 'चंडीगढ़', pa: 'ਚੰਡੀਗੜ੍ਹ', ta: 'சண்டிகர்', te: 'చండీగడ్', mr: 'चंदीगढ', gu: 'ચંડીગઢ', bn: 'চন্ডীগড়' },
    'Chattisgarh': { en: 'Chhattisgarh', hi: 'छत्तीसगढ़', pa: 'ਛੱਤੀਸਗੜ੍ਹ', ta: 'சத்தீஸ்கர்', te: 'ఛత్తీస్ గఢ్', mr: 'छत्तिसगड', gu: 'છત્તીસગઢ', bn: 'ছত্তিসগড়' },
    'Dadra and Nagar Haveli': { en: 'Dadra and Nagar Haveli', hi: 'दादरा और नगर हवेली', pa: 'ਦਾਦਰਾ ਅਤੇ ਨਗਰ ਹਵੇਲੀ', ta: 'தாத்ரா நகர் அவேலி', te: 'దాద్రా నగర్ హవేలి', mr: 'दादरा आणि नगर हवेली', gu: 'દાદરા અને નગર હવેલી', bn: 'দাদরা ও নগর হাভেলি' },
    'Daman and Diu': { en: 'Daman and Diu', hi: 'दमन और दीव', pa: 'ਦਮਨ ਅਤੇ ਦੀਵ', ta: 'தமன் தீவு', te: 'దమన్ దీవ్', mr: 'दमन आणि दीव', gu: 'દમન અને દીવ', bn: 'দমন ও দিউ' },
    'Goa': { en: 'Goa', hi: 'गोवा', pa: 'ਗੋਆ', ta: 'கோவா', te: 'గోవా', mr: 'गोवा', gu: 'ગોવા', bn: 'গোয়া' },
    'Gujarat': { en: 'Gujarat', hi: 'गुजरात', pa: 'ਗੁਜਰਾਤ', ta: 'குஜராத்', te: 'గుజరాత্', mr: 'गुजरात', gu: 'ગુજરાત', bn: 'গুজরাত' },
    'Haryana': { en: 'Haryana', hi: 'हरियाणा', pa: 'ਹਰਿਆਣਾ', ta: 'ஹரியானா', te: 'హర్యానా', mr: 'हरियाणा', gu: 'હરિયાણા', bn: 'হরিয়ানা' },
    'Himachal Pradesh': { en: 'Himachal Pradesh', hi: 'हिमाचल प्रदेश', pa: 'ਹਿਮਾਚਲ ਪ੍ਰਦੇਸ਼', ta: 'இமாசல பிரதேசம்', te: 'హిమాచల్ ప్రదేశ్', mr: 'हिमाचल प्रदेश', gu: 'હિમાચલ પ્રદેશ', bn: 'হিমাচল প্রদেশ' },
    'Jammu and Kashmir': { en: 'Jammu and Kashmir', hi: 'जम्मू और कश्मीर', pa: 'ਜੰਮੂ ਅਤੇ ਕਸ਼ਮੀਰ', ta: 'ஜம்மு காஷ்மீர்', te: 'జమ్మూ కాశ్మీర్', mr: 'जम्मू आणि काश्मीर', gu: 'જમ્મુ અને કાશ્મીર', bn: 'জম্মু ও কাশ্মীর' },
    'Jharkhand': { en: 'Jharkhand', hi: 'झारखंड', pa: 'ਝਾਰਖੰਡ', ta: 'ஜார்கண்ட்', te: 'జార్ఖండ్', mr: 'झारखंड', gu: 'ઝારખંડ', bn: 'ঝাড়খণ্ড' },
    'Karnataka': { en: 'Karnataka', hi: 'कर्नाटक', pa: 'ਕਰਨਾਟਕ', ta: 'கர்நாடகா', te: 'కర్ణాటక', mr: 'कर्नाटक', gu: 'કર્ણાટક', bn: 'কর্ণাটক' },
    'Kerala': { en: 'Kerala', hi: 'केरल', pa: 'ਕੇਰਲ', ta: 'கேரளா', te: 'కేరళ', mr: 'केरळ', gu: 'કેરળ', bn: 'কেরল' },
    'Lakshadweep': { en: 'Lakshadweep', hi: 'लक्षद्वीप', pa: 'ਲਕਸ਼ਦੀਪ', ta: 'லட்சத்தீவு', te: 'లక్షద్వీప్', mr: 'लक्षद्विप', gu: 'લક્ષદ્વીપ', bn: 'লক্ষদ্বীপ' },
    'Madhya Pradesh': { en: 'Madhya Pradesh', hi: 'मध्य प्रदेश', pa: 'ਮੱਧ ਪ੍ਰਦੇਸ਼', ta: 'மத்திய பிரதேசம்', te: 'మధ్య ప్రదేశ్', mr: 'मध्य प्रदेश', gu: 'મધ્ય પ્રદેશ', bn: 'মধ্য প্রদেশ' },
    'Maharashtra': { en: 'Maharashtra', hi: 'महाराष्ट्र', pa: 'ਮਹਾਰਾਸ਼ਟਰ', ta: 'மகாராஷ்டிரா', te: 'మహారాష్ట్ర', mr: 'महाराष्ट्र', gu: 'મહારાષ્ટ્ર', bn: 'মহারাষ্ট্র' },
    'Manipur': { en: 'Manipur', hi: 'मणिपुर', pa: 'ਮਣਿਪੁਰ', ta: 'மணிப்பூர்', te: 'మణిపూర్', mr: 'मणिपूर', gu: 'મણિપુર', bn: 'মণিপুর' },
    'Meghalaya': { en: 'Meghalaya', hi: 'मेघालय', pa: 'ਮੇਘਾਲਿਆ', ta: 'மேகாலயா', te: 'మేఘాలయ', mr: 'मेघालय', gu: 'મેઘાલય', bn: 'মেঘালয়' },
    'Mizoram': { en: 'Mizoram', hi: 'मिजोरम', pa: 'ਮਿਜ਼ੋਰਮ', ta: 'மிசோரம்', te: 'మిజోరమ్', mr: 'मिझोराम', gu: 'મિઝોરમ', bn: 'মিজোরাম' },
    'Nagaland': { en: 'Nagaland', hi: 'नागालैंड', pa: 'ਨਾਗਾਲੈਂਡ', ta: 'நாகாலாந்து', te: 'నాగాలాండ్', mr: 'नागालँड', gu: 'નાગાલેન્ડ', bn: 'নাগাল্যান্ড' },
    'NCT of Delhi': { en: 'Delhi', hi: 'दिल्ली', pa: 'ਦਿਲ੍ਹੀ', ta: 'தில்லி', te: 'ఢిల్లీ', mr: 'दिल्ली', gu: 'દિલ્હી', bn: 'দিল্লি' },
    'Odisha': { en: 'Odisha', hi: 'ओडिशा', pa: 'ਓਡੀਸ਼ਾ', ta: 'ஒடிசா', te: 'ఒడిశా', mr: 'ओडिशा', gu: 'ઓડિશા', bn: 'ওড়িশা' },
    'Pondicherry': { en: 'Puducherry', hi: 'पुदुचेरी', pa: 'ਪੁਦੁਚੇਰੀ', ta: 'புதுச்சேரி', te: 'పుదుచ్చేరి', mr: 'पुडुचेरी', gu: 'પુદુચેરી', bn: 'পুদুচেরি' },
    'Punjab': { en: 'Punjab', hi: 'पंजाब', pa: 'ਪੰਜਾਬ', ta: 'பஞ்சாப்', te: 'పంజాబ్', mr: 'पंजाब', gu: 'પંજાબ', bn: 'পাঞ্জাব' },
    'Rajasthan': { en: 'Rajasthan', hi: 'राजस्थान', pa: 'ਰਾਜਸਥਾਨ', ta: 'ராஜஸ்தான்', te: 'రాజస్థాన్', mr: 'राजस्थान', gu: 'રાજસ્થાન', bn: 'রাজস্থান' },
    'Sikkim': { en: 'Sikkim', hi: 'सिक्किम', pa: 'ਸਿਕਿਮ', ta: 'சிக்கிம்', te: 'సిక్కిం', mr: 'सिक्कीम', gu: 'સિક્કિમ', bn: 'সিকিম' },
    'Tamil Nadu': { en: 'Tamil Nadu', hi: 'तमिलनाडु', pa: 'ਤਮਿਲਨਾਡੂ', ta: 'தமிழ்நாடு', te: 'తమిళనాడు', mr: 'तमिळनाडू', gu: 'તમિળનાડુ', bn: 'তামিলনাড়ু' },
    'Telangana': { en: 'Telangana', hi: 'तेलंगाना', pa: 'ਤੇਲੰਗਾਨਾ', ta: 'தெலங்கானா', te: 'తెలంగాణ', mr: 'तेलंगणा', gu: 'તેલંગાણા', bn: 'তেলেঙ্গানা' },
    'Tripura': { en: 'Tripura', hi: 'त्रिपुरा', pa: 'ਤ੍ਰਿਪੁਰਾ', ta: 'திரிபுரா', te: 'త్రిపుర', mr: 'त्रिपुरा', gu: 'ત્રિપુરા', bn: 'ত্রিপুরা' },
    'Uttar Pradesh': { en: 'Uttar Pradesh', hi: 'उत्तर प्रदेश', pa: 'ਉੱਤਰ ਪ੍ਰਦੇਸ਼', ta: 'உத্தরப் பிரதேசம்', te: 'ఉత্తর ప్రदেశ্', mr: 'उत्तर प्रदेश', gu: 'ઉત્તર પ્રદેશ', bn: 'উত্তর প্রদেশ' },
    'Uttrakhand': { en: 'Uttarakhand', hi: 'उत्तराखंड', pa: 'ਉਤਰਾਖੰਡ', ta: 'உத্তরাকண্ড্', te: 'ఉత્তরాఖండ్', mr: 'उत्तराखंड', gu: 'ઉત્તરાખંડ', bn: 'উত্তরাখণ্ড' },
    'West Bengal': { en: 'West Bengal', hi: 'पश्चिम बंगाल', pa: 'ਪੱਛਮੀ ਬੰਗਾਲ', ta: 'মেற்கু வঙ্গাளম্', te: 'পশ্চিম বেঙ্গাল্', mr: 'पश्चिम बंगाल', gu: 'પશ્ચિમ બંગાળ', bn: 'পশ্চিমবঙ্গ' }
  };
  
  // Helper function to translate state name
  const translateStateName = (stateName: string, language: string = 'en'): string => {
    return stateTranslations[stateName]?.[language] || stateName;
  };
  
  // Get states with translated names
  const states = baseStates.map(state => ({
    code: state.code,
    name: translateStateName(state.name, i18n.language),
    originalName: state.name
  }));
  
  // Debug: Log current language and a sample state translation
  console.log('Current language in MandiPrices:', i18n.language);
  console.log('Punjab translation sample:', translateStateName('Punjab', i18n.language));
  console.log('First 3 translated states:', states.slice(0, 3));
  // Create a function to get translated commodity names
  const getTranslatedCommodities = () => {
    const commodityKeys = [
      'wheat', 'rice', 'paddy', 'maize', 'jowar', 'bajra', 'barley', 'gram',
      'tur', 'moong', 'urad', 'masur', 'cotton', 'groundnut', 'soybean',
      'sunflower', 'mustard', 'sesame', 'sugarcane', 'onion', 'potato',
      'tomato', 'brinjal', 'okra', 'cauliflower', 'cabbage', 'greenChilli',
      'capsicum', 'ginger', 'garlic', 'turmeric', 'apple', 'banana',
      'mango', 'orange', 'grapes', 'pomegranate', 'coconut', 'arecanut',
      'tea', 'coffee', 'rubber', 'blackPepper', 'cardamom'
    ];
    return commodityKeys.map(key => t(`commodities.${key}`));
  };
  
  const commodities = getTranslatedCommodities();

  const filteredPrices = prices.filter(price =>
    price.commodity.toLowerCase().includes(searchTerm.toLowerCase()) ||
    price.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
    price.originalCommodity?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    price.originalState?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <TrendingUp className="h-6 w-6 mr-2 text-green-600" />
          {t('mandi.title')}
        </h2>
        
        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('mandi.search')}</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder={t('mandi.searchPlaceholder')}
                className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900 font-medium placeholder-gray-500 bg-white"
              />
            </div>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('mandi.state')}</label>
            <select
              value={selectedState}
              onChange={(e) => setSelectedState(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900 font-medium bg-white"
            >
              <option value="" className="text-gray-900 font-medium">{t('mandi.allStates')}</option>
              {states.map(state => (
                <option key={state.code} value={state.code} className="text-gray-900 font-medium">{state.name}</option>
              ))}
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">{t('mandi.commodity')}</label>
            <select
              value={selectedCommodity}
              onChange={(e) => setSelectedCommodity(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900 font-medium bg-white"
            >
              <option value="" className="text-gray-900 font-medium">{t('mandi.allCommodities')}</option>
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
          {t('mandi.swipeHint')}
        </p>
      </div>

      {/* Price Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto -mx-4 px-4 sm:mx-0 sm:px-0">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  {t('mandi.commodity')}
                </th>
                <th className="px-6 py-3 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Price ({t('mandi.perQuintal')})
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center">
                    <div className="flex justify-center">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                    </div>
                  </td>
                </tr>
              ) : filteredPrices.length === 0 ? (
                <tr>
                  <td colSpan={2} className="px-6 py-4 text-center text-gray-500">
                    {t('mandi.noPricesFound')}
                  </td>
                </tr>
              ) : (
                filteredPrices.map((price, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-gray-900">
                      {price.commodity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-green-700 bg-green-50 rounded">
                      ₹{price.price.toLocaleString()}
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