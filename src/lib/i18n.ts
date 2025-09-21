import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
  en: {
    translation: {
      // Navigation
      nav: {
        dashboard: 'Dashboard',
        aiAssistant: 'AI Assistant',
        mandiPrices: 'Mandi Prices',
        weather: 'Weather',
        cropHealth: 'Crop Health',
        schemes: 'Schemes',
        appName: 'Farmer Support',
        tagline: 'Digital Agriculture'
      },
      // Dashboard
      dashboard: {
        welcome: 'Welcome to Farmer Support App',
        description: 'Your comprehensive digital companion for modern farming. Access AI-powered insights, market prices, weather updates, and government schemes all in one place.',
        todaysTips: "Today's Farming Tips",
        temperature: "Today's Temperature",
        humidity: 'Humidity',
        activeFarmers: 'Active Farmers',
        weatherAlert: 'Weather Alert',
        marketUpdate: 'Market Update',
        seasonalTip: 'Seasonal Tip',
        aiAssistantDesc: 'Get instant answers about crops, weather, and farming practices',
        mandiPricesDesc: 'Real-time market prices for your crops across different mandis',
        weatherAlertsDesc: 'Get weather forecasts and alerts for your farming area',
        cropHealthDesc: 'AI-powered crop disease detection and treatment recommendations',
        governmentSchemesDesc: 'Browse and apply for farmer welfare schemes and subsidies',
        availableAlways: 'Available 24/7',
        marketsCount: '500+ Markets',
        forecastDays: '5-day forecast',
        accuracy: '95% Accuracy',
        schemesCount: '50+ Schemes',
        lightRainTip: 'Light rain expected tomorrow. Good time for sowing if soil conditions are right.',
        wheatPriceTip: 'Wheat prices showing upward trend. Consider timing your sales accordingly.',
        soilTestTip: 'This is the ideal time for soil testing. Use our Soil Health feature to get recommendations.'
      },
      // AI Assistant
      assistant: {
        title: 'AI Farming Assistant',
        subtitle: 'Talk to me about farming!',
        listening: 'Listening...',
        speaking: 'Speaking...',
        placeholder: 'Ask me anything or click the mic to speak',
        startVoice: 'Start Voice',
        stopVoice: 'Stop Voice',
        send: 'Send',
        suggestedQuestions: 'Suggested questions',
        selectLanguage: 'Select Language',
        voiceEnabled: 'Voice Enabled',
        textMode: 'Text Mode',
        thinking: 'Thinking...',
        stopSpeaking: 'Stop Speaking',
        holdToSpeak: 'Press and hold the mic button to speak'
      },
      // Mandi Prices
      mandi: {
        title: 'Live Mandi Prices',
        search: 'Search',
        searchPlaceholder: 'Search commodity or market...',
        state: 'State',
        allStates: 'All States',
        commodity: 'Commodity',
        allCommodities: 'All Commodities',
        market: 'Market',
        district: 'District',
        minPrice: 'Min Price',
        maxPrice: 'Max Price',
        modalPrice: 'Modal Price',
        swipeHint: 'Swipe left/right to see all columns',
        perQuintal: '₹/Quintal',
        noPricesFound: 'No prices found'
      },
      // Weather
      weather: {
        title: 'Weather Forecast',
        searchCity: 'Enter city name...',
        search: 'Search',
        currentWeather: 'Current Weather',
        feelsLike: 'Feels like',
        windSpeed: 'Wind Speed',
        pressure: 'Pressure',
        humidity: 'Humidity',
        alerts: 'Agricultural Weather Alerts',
        forecast: '5-Day Forecast',
        heatWarning: 'High temperature alert! Ensure adequate irrigation.',
        humidityWarning: 'High humidity detected. Monitor crops for fungal diseases.',
        windWarning: 'Strong winds expected. Secure loose structures.',
        rainForecast: 'Rain expected in the next 24 hours.',
        noDataAvailable: 'No weather data available',
        locationDetected: 'Location automatically detected from your network'
      },
      // Crop Detection
      crop: {
        title: 'Crop Health Detection',
        subtitle: 'Upload a photo of your crop to get AI-powered disease detection and treatment recommendations',
        upload: 'Click to upload an image of your crop',
        formats: 'Supported formats: JPG, PNG (Max 10MB)',
        chooseImage: 'Choose Image',
        changeImage: 'Change Image',
        analyze: 'Analyze Crop',
        analyzing: 'Analyzing...',
        results: 'Analysis Results',
        plantType: 'Plant/Crop Type',
        healthStatus: 'Health Status',
        disease: 'Disease/Problem Identification',
        symptoms: 'Visible Symptoms',
        causes: 'Probable Causes',
        treatment: 'Treatment Recommendations',
        prevention: 'Prevention Measures',
        urgency: 'Urgency Level',
        tips: 'Tips for Better Analysis',
        listenToResults: 'Listen to Results',
        stopSpeaking: 'Stop Speaking',
        problemsDetected: 'Problems Detected',
        recommendedSolutions: 'Recommended Solutions',
        tip1: 'Take clear, well-lit photos in natural daylight',
        tip2: 'Focus on affected areas of the plant',
        tip3: 'Include both close-ups and overall plant views',
        tip4: 'Avoid blurry or dark images'
      },
      // Government Schemes
      schemes: {
        title: 'Government Schemes for Farmers',
        search: 'Search schemes...',
        allCategories: 'All Categories',
        viewDetails: 'View Details',
        description: 'Description',
        benefits: 'Benefits',
        eligibility: 'Eligibility Criteria',
        documents: 'Required Documents',
        process: 'Application Process',
        visitWebsite: 'Visit Official Website',
        since: 'Since'
      },
      // Common
      common: {
        loading: 'Loading...',
        error: 'Error',
        retry: 'Retry',
        search: 'Search',
        cancel: 'Cancel',
        save: 'Save',
        close: 'Close',
        yes: 'Yes',
        no: 'No'
      },
      // Commodities
      commodities: {
        wheat: 'Wheat',
        rice: 'Rice',
        paddy: 'Paddy',
        maize: 'Maize',
        jowar: 'Jowar',
        bajra: 'Bajra',
        barley: 'Barley',
        gram: 'Gram',
        tur: 'Tur/Arhar',
        moong: 'Moong',
        urad: 'Urad',
        masur: 'Masur',
        cotton: 'Cotton',
        groundnut: 'Groundnut',
        soybean: 'Soybean',
        sunflower: 'Sunflower',
        mustard: 'Mustard',
        sesame: 'Sesame',
        sugarcane: 'Sugarcane',
        onion: 'Onion',
        potato: 'Potato',
        tomato: 'Tomato',
        brinjal: 'Brinjal',
        okra: 'Okra/Lady Finger',
        cauliflower: 'Cauliflower',
        cabbage: 'Cabbage',
        greenChilli: 'Green Chilli',
        capsicum: 'Capsicum',
        ginger: 'Ginger',
        garlic: 'Garlic',
        turmeric: 'Turmeric',
        apple: 'Apple',
        banana: 'Banana',
        mango: 'Mango',
        orange: 'Orange',
        grapes: 'Grapes',
        pomegranate: 'Pomegranate',
        coconut: 'Coconut',
        arecanut: 'Arecanut',
        tea: 'Tea',
        coffee: 'Coffee',
        rubber: 'Rubber',
        blackPepper: 'Black Pepper',
        cardamom: 'Cardamom'
      }
    }
  },
  hi: {
    translation: {
      nav: {
        dashboard: 'डैशबोर्ड',
        aiAssistant: 'AI सहायक',
        mandiPrices: 'मंडी भाव',
        weather: 'मौसम',
        cropHealth: 'फसल स्वास्थ्य',
        schemes: 'योजनाएं',
        appName: 'किसान सहायता',
        tagline: 'डिजिटल कृषि'
      },
      dashboard: {
        welcome: 'किसान सहायता ऐप में आपका स्वागत है',
        description: 'आधुनिक खेती के लिए आपका व्यापक डिजिटल साथी। AI-संचालित अंतर्दृष्टि, बाजार मूल्य, मौसम अपडेट और सरकारी योजनाओं तक एक ही स्थान पर पहुंच प्राप्त करें।',
        todaysTips: 'आज की खेती युक्तियाँ',
        temperature: 'आज का तापमान',
        humidity: 'नमी',
        activeFarmers: 'सक्रिय किसान',
        weatherAlert: 'मौसम चेतावनी',
        marketUpdate: 'बाजार अपडेट',
        seasonalTip: 'मौसमी सुझाव',
        aiAssistantDesc: 'फसलों, मौसम और कृषि प्रथाओं के बारे में तुरंत उत्तर प्राप्त करें',
        mandiPricesDesc: 'विभिन्न मंडियों में आपकी फसलों के लिए वास्तविक समय बाजार मूल्य',
        weatherAlertsDesc: 'अपने कृषि क्षेत्र के लिए मौसम पूर्वानुमान और अलर्ट प्राप्त करें',
        cropHealthDesc: 'AI-संचालित फसल रोग पहचान और उपचार सिफारिशें',
        governmentSchemesDesc: 'किसान कल्याण योजनाओं और सब्सिडी को ब्राउज़ करें और आवेदन करें',
        availableAlways: '24/7 उपलब्ध',
        marketsCount: '500+ मार्केट',
        forecastDays: '5-दिन पूर्वानुमान',
        accuracy: '95% सटीकता',
        schemesCount: '50+ योजनाएं',
        lightRainTip: 'कल हल्की बारिश की उम्मीद है। मिट्टी की स्थिति सही होने पर बुवाई का अच्छा समय है।',
        wheatPriceTip: 'गेहूं की कीमतें बढ़ने की प्रवृत्ति दिखा रही हैं। अपनी बिक्री का समय तय करने पर विचार करें।',
        soilTestTip: 'यह मिट्टी परीक्षण के लिए आदर्श समय है। सिफारिशों के लिए हमारे मिट्टी स्वास्थ्य फीचर का उपयोग करें।'
      },
      assistant: {
        title: 'AI खेती सहायक',
        subtitle: 'खेती के बारे में मुझसे बात करें!',
        listening: 'सुन रहा हूं...',
        speaking: 'बोल रहा हूं...',
        placeholder: 'कुछ भी पूछें या बोलने के लिए माइक पर क्लिक करें',
        startVoice: 'आवाज़ शुरू करें',
        stopVoice: 'आवाज़ बंद करें',
        send: 'भेजें',
        suggestedQuestions: 'सुझाए गए प्रश्न',
        selectLanguage: 'भाषा चुनें',
        voiceEnabled: 'आवाज़ सक्षम',
        textMode: 'टेक्सट मोड',
        thinking: 'सोच रहा हूं...',
        stopSpeaking: 'बोलना बंद करें',
        holdToSpeak: 'बोलने के लिए माइक बटन दबाएं और दबाकर रखें'
      },
      mandi: {
        title: 'लाइव मंडी भाव',
        search: 'खोजें',
        searchPlaceholder: 'वस्तु या बाजार खोजें...',
        state: 'राज्य',
        allStates: 'सभी राज्य',
        commodity: 'वस्तु',
        allCommodities: 'सभी वस्तुएं',
        market: 'बाजार',
        district: 'जिला',
        minPrice: 'न्यूनतम मूल्य',
        maxPrice: 'अधिकतम मूल्य',
        modalPrice: 'मोडल मूल्य',
        swipeHint: 'सभी कॉलम देखने के लिए बाएं/दाएं स्वाइप करें',
        perQuintal: '₹/क्विंटल',
        noPricesFound: 'कोई मूल्य नहीं मिला'
      },
      weather: {
        title: 'मौसम पूर्वानुमान',
        searchCity: 'शहर का नाम दर्ज करें...',
        search: 'खोजें',
        currentWeather: 'वर्तमान मौसम',
        feelsLike: 'महसूस होता है',
        windSpeed: 'हवा की गति',
        pressure: 'दबाव',
        humidity: 'नमी',
        alerts: 'कृषि मौसम चेतावनी',
        forecast: '5-दिन का पूर्वानुमान',
        heatWarning: 'उच्च तापमान चेतावनी! पर्याप्त सिंचाई सुनिश्चित करें।',
        humidityWarning: 'उच्च आर्द्रता। फंगल रोगों के लिए फसलों की निगरानी करें।',
        windWarning: 'तेज़ हवाएं अपेक्षित। ढीली संरचनाओं को सुरक्षित करें।',
        rainForecast: 'अगले 24 घंटों में बारिश की संभावना।',
        noDataAvailable: 'कोई मौसम डेटा उपलब्ध नहीं',
        locationDetected: 'आपके नेटवर्क से स्वतः स्थान का पता लगाया गया'
      },
      crop: {
        title: 'फसल स्वास्थ्य जांच',
        subtitle: 'AI-संचालित रोग पहचान और उपचार सिफारिशों के लिए अपनी फसल की फोटो अपलोड करें',
        upload: 'अपनी फसल की तस्वीर अपलोड करने के लिए क्लिक करें',
        formats: 'समर्थित प्रारूप: JPG, PNG (अधिकतम 10MB)',
        chooseImage: 'छवि चुनें',
        changeImage: 'छवि बदलें',
        analyze: 'फसल का विश्लेषण करें',
        analyzing: 'विश्लेषण कर रहे हैं...',
        results: 'विश्लेषण परिणाम',
        plantType: 'पौधा/फसल प्रकार',
        healthStatus: 'स्वास्थ्य स्थिति',
        disease: 'रोग/समस्या पहचान',
        symptoms: 'दृश्य लक्षण',
        causes: 'संभावित कारण',
        treatment: 'उपचार सिफारिशें',
        prevention: 'रोकथाम उपाय',
        urgency: 'तात्कालिकता स्तर',
        tips: 'बेहतर विश्लेषण के लिए सुझाव',
        listenToResults: 'परिणाम सुनें',
        stopSpeaking: 'बोलना बंद करें',
        problemsDetected: 'समस्याएं मिलीं',
        recommendedSolutions: 'सुझाए गए समाधान',
        tip1: 'प्राकृतिक दिन के प्रकाश में साफ तस्वीरें लें',
        tip2: 'पौधे के प्रभावित हिस्सों पर ध्यान दें',
        tip3: 'क्लोज़-अप और समग्र पौधे के दृश्य शामिल करें',
        tip4: 'धुंधली या अंधेरी तस्वीरों से बचें'
      },
      schemes: {
        title: 'किसानों के लिए सरकारी योजनाएं',
        search: 'योजनाएं खोजें...',
        allCategories: 'सभी श्रेणियां',
        viewDetails: 'विवरण देखें',
        description: 'विवरण',
        benefits: 'लाभ',
        eligibility: 'पात्रता मानदंड',
        documents: 'आवश्यक दस्तावेज',
        process: 'आवेदन प्रक्रिया',
        visitWebsite: 'आधिकारिक वेबसाइट पर जाएं',
        since: 'से'
      },
      // Common
      common: {
        loading: 'लोड हो रहा है...',
        error: 'त्रुटि',
        retry: 'पुनः प्रयास करें',
        search: 'खोजें',
        cancel: 'रद्द करें',
        save: 'सेव करें',
        close: 'बंद करें',
        yes: 'हां',
        no: 'नहीं'
      },
      // Commodities
      commodities: {
        wheat: 'गेहूं',
        rice: 'चावल',
        paddy: 'धान',
        maize: 'मक्का',
        jowar: 'ज्वार',
        bajra: 'बाजरा',
        barley: 'जौ',
        gram: 'चना',
        tur: 'तुअर/अरहर',
        moong: 'मूंग',
        urad: 'उड़द',
        masur: 'मसूर',
        cotton: 'कपास',
        groundnut: 'मूंगफली',
        soybean: 'सोयाबीन',
        sunflower: 'सूरजमुखी',
        mustard: 'सरसों',
        sesame: 'तिल',
        sugarcane: 'गन्ना',
        onion: 'प्याज',
        potato: 'आलू',
        tomato: 'टमाटर',
        brinjal: 'बैंगन',
        okra: 'भिंडी',
        cauliflower: 'फूलगोभी',
        cabbage: 'पत्तागोभी',
        greenChilli: 'हरी मिर्च',
        capsicum: 'शिमला मिर्च',
        ginger: 'अदरक',
        garlic: 'लहसुन',
        turmeric: 'हल्दी',
        apple: 'सेब',
        banana: 'केला',
        mango: 'आम',
        orange: 'संतरा',
        grapes: 'अंगूर',
        pomegranate: 'अनार',
        coconut: 'नारियल',
        arecanut: 'सुपारी',
        tea: 'चाय',
        coffee: 'कॉफी',
        rubber: 'रबर',
        blackPepper: 'काली मिर्च',
        cardamom: 'इलायची'
      }
    }
  },
  pa: {
    translation: {
      nav: {
        dashboard: 'ਡੈਸ਼ਬੋਰਡ',
        aiAssistant: 'AI ਸਹਾਇਕ',
        mandiPrices: 'ਮੰਡੀ ਭਾਅ',
        weather: 'ਮੌਸਮ',
        cropHealth: 'ਫਸਲ ਸਿਹਤ',
        schemes: 'ਸਕੀਮਾਂ',
        appName: 'ਕਿਸਾਨ ਸਹਾਇਤਾ',
        tagline: 'ਡਿਜੀਟਲ ਖੇਤੀ'
      },
      dashboard: {
        welcome: 'ਕਿਸਾਨ ਸਹਾਇਤਾ ਐਪ ਵਿੱਚ ਤੁਹਾਡਾ ਸੁਆਗਤ ਹੈ',
        description: 'ਆਧੁਨਿਕ ਖੇਤੀ ਲਈ ਤੁਹਾਡਾ ਵਿਆਪਕ ਡਿਜੀਟਲ ਸਾਥੀ।',
        todaysTips: 'ਅੱਜ ਦੀਆਂ ਖੇਤੀ ਟਿੱਪਸ',
        temperature: 'ਅੱਜ ਦਾ ਤਾਪਮਾਨ',
        humidity: 'ਨਮੀ',
        activeFarmers: 'ਸਰਗਰਮ ਕਿਸਾਨ',
        weatherAlert: 'ਮੌਸਮ ਚੇਤਾਵਨੀ',
        marketUpdate: 'ਮਾਰਕੀਟ ਅੱਪਡੇਟ',
        seasonalTip: 'ਮੌਸਮੀ ਸੁਝਾਅ'
      },
      assistant: {
        title: 'AI ਖੇਤੀ ਸਹਾਇਕ',
        subtitle: 'ਖੇਤੀ ਬਾਰੇ ਮੇਰੇ ਨਾਲ ਗੱਲ ਕਰੋ!',
        listening: 'ਸੁਣ ਰਿਹਾ ਹਾਂ...',
        speaking: 'ਬੋਲ ਰਿਹਾ ਹਾਂ...',
        placeholder: 'ਕੁਝ ਵੀ ਪੁੱਛੋ ਜਾਂ ਬੋਲਣ ਲਈ ਮਾਈਕ ਤੇ ਕਲਿੱਕ ਕਰੋ',
        startVoice: 'ਆਵਾਜ਼ ਸ਼ੁਰੂ ਕਰੋ',
        stopVoice: 'ਆਵਾਜ਼ ਬੰਦ ਕਰੋ',
        send: 'ਭੇਜੋ',
        suggestedQuestions: 'ਸੁਝਾਏ ਗਏ ਸਵਾਲ',
        selectLanguage: 'ਭਾਸ਼ਾ ਚੁਣੋ',
        voiceEnabled: 'ਆਵਾਜ਼ ਸਮਰੱਥ',
        textMode: 'ਟੈਕਸਟ ਮੋਡ'
      }
    }
  },
  ta: {
    translation: {
      nav: {
        dashboard: 'டாஷ்போர்டு',
        aiAssistant: 'AI உதவியாளர்',
        mandiPrices: 'மண்டி விலைகள்',
        weather: 'வானிலை',
        cropHealth: 'பயிர் ஆரோக்கியம்',
        schemes: 'திட்டங்கள்',
        appName: 'விவசாயி ஆதரவு',
        tagline: 'டிஜிட்டல் விவசாயம்'
      },
      dashboard: {
        welcome: 'விவசாயி ஆதரவு செயலிக்கு வரவேற்கிறோம்',
        description: 'நவீன விவசாயத்திற்கான உங்கள் விரிவான டிஜிட்டல் துணை.',
        todaysTips: 'இன்றைய விவசாய குறிப்புகள்',
        temperature: 'இன்றைய வெப்பநிலை',
        humidity: 'ஈரப்பதம்',
        activeFarmers: 'செயலில் உள்ள விவசாயிகள்'
      }
    }
  },
  te: {
    translation: {
      nav: {
        dashboard: 'డాష్‌బోర్డ్',
        aiAssistant: 'AI సహాయకుడు',
        mandiPrices: 'మండి ధరలు',
        weather: 'వాతావరణం',
        cropHealth: 'పంట ఆరోగ్యం',
        schemes: 'పథకాలు',
        appName: 'రైతు మద్దతు',
        tagline: 'డిజిటల్ వ్యవసాయం'
      },
      dashboard: {
        welcome: 'రైతు మద్దతు యాప్‌కు స్వాగతం',
        description: 'ఆధునిక వ్యవసాయం కోసం మీ సమగ్ర డిజిటల్ సహచరుడు.',
        todaysTips: 'నేటి వ్యవసాయ చిట్కాలు',
        temperature: 'నేటి ఉష్ణోగ్రత',
        humidity: 'తేమ',
        activeFarmers: 'చురుకైన రైతులు'
      }
    }
  },
  mr: {
    translation: {
      nav: {
        dashboard: 'डॅशबोर्ड',
        aiAssistant: 'AI सहाय्यक',
        mandiPrices: 'मंडी भाव',
        weather: 'हवामान',
        cropHealth: 'पीक आरोग्य',
        schemes: 'योजना',
        appName: 'शेतकरी सहाय्य',
        tagline: 'डिजिटल शेती'
      },
      dashboard: {
        welcome: 'शेतकरी सहाय्य अॅपमध्ये आपले स्वागत आहे',
        description: 'आधुनिक शेतीसाठी तुमचा सर्वसमावेशक डिजिटल सहचर.',
        todaysTips: 'आजच्या शेती टिप्स',
        temperature: 'आजचे तापमान',
        humidity: 'आर्द्रता',
        activeFarmers: 'सक्रिय शेतकरी'
      }
    }
  },
  gu: {
    translation: {
      nav: {
        dashboard: 'ડેશબોર્ડ',
        aiAssistant: 'AI સહાયક',
        mandiPrices: 'મંડી ભાવ',
        weather: 'હવામાન',
        cropHealth: 'પાક સ્વાસ્થ્ય',
        schemes: 'યોજનાઓ',
        appName: 'ખેડૂત સહાય',
        tagline: 'ડિજિટલ ખેતી'
      },
      dashboard: {
        welcome: 'ખેડૂત સહાય એપમાં આપનું સ્વાગત છે',
        description: 'આધુનિક ખેતી માટે તમારો વ્યાપક ડિજિટલ સાથી.',
        todaysTips: 'આજની ખેતી ટિપ્સ',
        temperature: 'આજનું તાપમાન',
        humidity: 'ભેજ',
        activeFarmers: 'સક્રિય ખેડૂતો'
      }
    }
  },
  bn: {
    translation: {
      nav: {
        dashboard: 'ড্যাশবোর্ড',
        aiAssistant: 'AI সহায়ক',
        mandiPrices: 'মান্ডি মূল্য',
        weather: 'আবহাওয়া',
        cropHealth: 'ফসল স্বাস্থ্য',
        schemes: 'প্রকল্প',
        appName: 'কৃষক সহায়তা',
        tagline: 'ডিজিটাল কৃষি'
      },
      dashboard: {
        welcome: 'কৃষক সহায়তা অ্যাপে স্বাগতম',
        description: 'আধুনিক কৃষিকাজের জন্য আপনার ব্যাপক ডিজিটাল সঙ্গী।',
        todaysTips: 'আজকের কৃষি টিপস',
        temperature: 'আজকের তাপমাত্রা',
        humidity: 'আর্দ্রতা',
        activeFarmers: 'সক্রিয় কৃষক'
      }
    }
  }
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: 'en', // Default language
    fallbackLng: 'en',
    debug: false, // Set to true for debugging
    interpolation: {
      escapeValue: false
    },
    react: {
      useSuspense: false
    }
  });

export default i18n;