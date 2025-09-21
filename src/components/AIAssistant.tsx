'use client';

import { useState, useEffect, useRef } from 'react';
import { Mic, MicOff, Volume2, Send, Languages, Bot, User, MessageCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'assistant';
  timestamp: Date;
  isVoice?: boolean;
}

export default function AIAssistant() {
  const { t, i18n } = useTranslation();
  
  const getWelcomeMessage = (lang: string) => {
    const welcomeMessages = {
      en: 'Hello! I am your AI farming assistant. I can help you with questions about crops, weather, mandi prices, farming techniques, and more. How can I assist you today?',
      hi: 'नमस्ते! मैं आपका AI कृषि सहायक हूं। मैं फसलों, मौसम, मंडी भाव, खेती की तकनीकों आदि के बारे में आपके प्रश्नों में मदद कर सकता हूं। आज मैं आपकी कैसे सहायता कर सकता हूं?',
      pa: 'ਸਤ ਸ੍ਰੀ ਅਕਾਲ! ਮੈਂ ਤੁਹਾਡਾ AI ਖੇਤੀ ਸਹਾਇਕ ਹਾਂ। ਮੈਂ ਫਸਲਾਂ, ਮੌਸਮ, ਮੰਡੀ ਭਾਅ, ਖੇਤੀ ਦੀਆਂ ਤਕਨੀਕਾਂ ਬਾਰੇ ਤੁਹਾਡੇ ਸਵਾਲਾਂ ਵਿੱਚ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ।',
      ta: 'வணக்கம்! நான் உங்கள் AI விவசாய உதவியாளர். பயிர்கள், வானிலை, மண்டி விலைகள், விவசாய நுட்பங்கள் பற்றிய உங்கள் கேள்விகளுக்கு உதவ முடியும்.',
      te: 'నమస్కారం! నేను మీ AI వ్యవసాయ సహాయకుడిని. పంటలు, వాతావరణం, మండి ధరలు, వ్యవసాయ పద్ధతుల గురించి మీ ప్రశ్నలకు సహాయం చేయగలను.',
      mr: 'नमस्कार! मी तुमचा AI शेती सहाय्यक आहे. मी पिकं, हवामान, मंडी भाव, शेती तंत्रं याबद्दल तुमच्या प्रश्नांमध्ये मदत करू शकतो.',
      gu: 'નમસ્તે! હું તમારો AI ખેતી સહાયક છું. હું પાકો, હવામાન, મંડી ભાવ, ખેતી તકનીકો વિશેના તમારા પ્રશ્નોમાં મદદ કરી શકું છું.',
      bn: 'নমস্কার! আমি আপনার AI কৃষি সহায়ক। আমি ফসল, আবহাওয়া, মান্ডি দাম, চাষাবাদ কৌশল সম্পর্কে আপনার প্রশ্নে সাহায্য করতে পারি।'
    };
    return welcomeMessages[lang as keyof typeof welcomeMessages] || welcomeMessages.en;
  };
  
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [chatMode, setChatMode] = useState<'text' | 'voice'>('voice');
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [microphoneError, setMicrophoneError] = useState<string>('');
  const [microphonePermission, setMicrophonePermission] = useState<'granted' | 'denied' | 'prompt' | 'unknown'>('unknown');
  const [recognitionActive, setRecognitionActive] = useState(false);
  const startingRecognitionRef = useRef(false);
  const [autoRestartAfterResponse, setAutoRestartAfterResponse] = useState(false);
  
  // Use the global language from i18n
  const selectedLanguage = i18n.language;
  
  // Initialize messages when component mounts or language changes
  useEffect(() => {
    setMessages([{
      id: '1',
      text: getWelcomeMessage(selectedLanguage),
      sender: 'assistant',
      timestamp: new Date()
    }]);
  }, [selectedLanguage]);

  // Check microphone permissions on mount
  useEffect(() => {
    const checkMicrophonePermission = async () => {
      try {
        if (navigator.permissions) {
          const permission = await navigator.permissions.query({ name: 'microphone' as PermissionName });
          setMicrophonePermission(permission.state);
          
          permission.addEventListener('change', () => {
            setMicrophonePermission(permission.state);
            if (permission.state === 'denied') {
              setMicrophoneError('Microphone access denied. Please enable microphone in browser settings.');
              setVoiceEnabled(false);
            } else if (permission.state === 'granted') {
              setMicrophoneError('');
            }
          });
        }
      } catch (error) {
        console.log('Permission API not supported:', error);
      }
    };
    
    checkMicrophonePermission();
  }, []);
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const recognitionRef = useRef<any>(null);
  const synthRef = useRef<SpeechSynthesisUtterance | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputMessageRef = useRef<string>('');

  const languages = [
    { code: 'en', name: 'English', voice: 'en-US' },
    { code: 'hi', name: 'हिंदी', voice: 'hi-IN' },
    { code: 'pa', name: 'ਪੰਜਾਬੀ', voice: 'pa-IN' },
    { code: 'ta', name: 'தமிழ்', voice: 'ta-IN' },
    { code: 'te', name: 'తెలుగు', voice: 'te-IN' },
    { code: 'mr', name: 'मराठी', voice: 'mr-IN' },
    { code: 'gu', name: 'ગુજરાતી', voice: 'gu-IN' },
    { code: 'bn', name: 'বাংলা', voice: 'bn-IN' }
  ];

  useEffect(() => {
    // Initialize Speech Recognition
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      recognitionRef.current = new SpeechRecognition();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = true;
      
      const currentLang = languages.find(l => l.code === selectedLanguage);
      recognitionRef.current.lang = currentLang?.voice || 'en-US';

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((result: any) => result[0])
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          .map((result: any) => result.transcript)
          .join('');
        
        setInputMessage(transcript);
        inputMessageRef.current = transcript;
      };

      recognitionRef.current.onend = () => {
        console.log('Recognition ended');
        setIsListening(false);
        setRecognitionActive(false);
        startingRecognitionRef.current = false;
      };
      
      // Add a start event handler to track when recognition actually starts
      recognitionRef.current.onstart = () => {
        setRecognitionActive(true);
        startingRecognitionRef.current = false;
      };

      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      recognitionRef.current.onerror = (event: any) => {
        const errorType = event.error as string;
        
        // Only log serious errors, not common user interaction issues
        if (errorType !== 'no-speech' && errorType !== 'aborted') {
          console.error('Speech recognition error:', errorType);
        }
        
        setIsListening(false);
        setRecognitionActive(false);
        
        // Handle different error types with user-friendly messages
        const errorMessages = {
          'not-allowed': {
            en: 'Microphone access denied. Please allow microphone access in your browser settings and try again.',
            hi: 'माइक्रोफोन एक्सेस अस्वीकृत। कृपया अपनी ब्राउज़र सेटिंग्स में माइक्रोफोन एक्सेस की अनुमति दें और फिर कोशिश करें।'
          },
          'no-speech': {
            en: 'No speech detected. Try speaking louder or closer to the microphone.',
            hi: 'कोई आवाज़ नहीं मिली। तेज़ या माइक्रोफोन के पास बोलने की कोशिश करें।'
          },
          'audio-capture': {
            en: 'No microphone found. Please check your microphone connection.',
            hi: 'माइक्रोफोन नहीं मिला। कृपया अपना माइक्रोफोन कनेक्शन जांचें।'
          },
          'network': {
            en: 'Network error occurred. Please check your internet connection.',
            hi: 'नेटवर्क एरर हुआ। कृपया अपना इंटरनेट कनेक्शन जांचें।'
          }
        };
        
        const errorMessage = errorMessages[errorType as keyof typeof errorMessages];
        
        // Only show error messages for significant errors
        // Don't show errors for 'aborted' (user stopped manually) or temporary 'no-speech' in some cases
        if (errorMessage && errorType !== 'aborted') {
          const message = errorMessage[selectedLanguage as keyof typeof errorMessage] || errorMessage.en;
          
          // For 'no-speech', show a less intrusive message and clear it after a delay
          if (errorType === 'no-speech') {
            setMicrophoneError(message);
            setTimeout(() => {
              setMicrophoneError('');
            }, 3000); // Clear 'no-speech' error after 3 seconds
          } else {
            setMicrophoneError(message);
            
            if (errorType === 'not-allowed') {
              setMicrophonePermission('denied');
              setVoiceEnabled(false);
            }
          }
        } else if (errorType !== 'aborted' && errorType !== 'no-speech') {
          // Fallback for unknown errors (but not for aborted or no-speech)
          const fallbackMessage = selectedLanguage === 'hi' 
            ? 'वॉयस रिकॉग्निशन में समस्या हुई। कृपया दोबारा कोशिश करें।'
            : 'Voice recognition error occurred. Please try again.';
          setMicrophoneError(fallbackMessage);
        }
        
        // Always reset state on any error to prevent stuck states
        setIsListening(false);
        setRecognitionActive(false);
        startingRecognitionRef.current = false;
      };
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedLanguage]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const startListening = async () => {
    if (!recognitionRef.current || isListening || recognitionActive || startingRecognitionRef.current) return;
    
    startingRecognitionRef.current = true;
    
    // Clear any previous errors
    setMicrophoneError('');
    
    try {
      // Force stop any ongoing recognition first
      try {
        recognitionRef.current.abort();
      } catch (abortError) {
        // Ignore abort errors
      }
      
      // Wait a bit longer to ensure recognition is fully stopped
      await new Promise(resolve => setTimeout(resolve, 200));
      
      // Request microphone permission first
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        await navigator.mediaDevices.getUserMedia({ audio: true });
      }
      
      // Double-check if we can start (in case state changed during the delay)
      if (isListening || recognitionActive) {
        return;
      }
      
      setIsListening(true);
      setRecognitionActive(true);
      
      // Wrap start in try-catch to handle InvalidStateError gracefully
      try {
        recognitionRef.current.start();
        setMicrophonePermission('granted');
        startingRecognitionRef.current = false;
      } catch (startError: unknown) {
        // If recognition is already started, try to recover
        setIsListening(false);
        setRecognitionActive(false);
        
        if (startError instanceof Error && startError.name === 'InvalidStateError') {
          console.log('Recognition already started, attempting recovery');
          
          // Try to abort and restart after a longer delay
          try {
            recognitionRef.current.abort();
          } catch (abortError) {
            // Ignore abort errors
          }
          
          setTimeout(async () => {
            if (!isListening && !recognitionActive && !startingRecognitionRef.current) {
              await startListening();
            }
          }, 300);
          startingRecognitionRef.current = false;
          return;
        } else {
          throw startError; // Re-throw other errors
        }
      }
    } catch (error: unknown) {
      console.error('Microphone permission error:', error);
      setIsListening(false);
      setRecognitionActive(false);
      startingRecognitionRef.current = false;
      setMicrophonePermission('denied');
      
      const permissionErrorMessage = selectedLanguage === 'hi'
        ? 'माइक्रोफोन की अनुमति देने के लिए कृपया ब्राउज़र में "Allow" पर क्लिक करें।'
        : 'Please click "Allow" in your browser to enable microphone access.';
      
      setMicrophoneError(permissionErrorMessage);
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && isListening) {
      try {
        recognitionRef.current.stop();
        // Manually trigger send message for voice mode after stopping
        setTimeout(() => {
          const currentInput = inputMessageRef.current.trim();
          if (chatMode === 'voice' && currentInput) {
            console.log('Sending voice message:', currentInput);
            sendMessage(true);
          }
        }, 200); // Small delay to ensure input is captured
      } catch (error) {
        // Ignore errors when stopping recognition
        console.log('Recognition stop error (ignored):', error);
      }
    }
  };

  // Toggle voice listening (click to start/stop)
  const toggleVoiceListening = () => {
    if (isListening) {
      stopListening();
    } else {
      startListening();
    }
  };

  const speakText = (text: string) => {
    if (!voiceEnabled || !('speechSynthesis' in window)) return;

    // Cancel any ongoing speech
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(text);
    const currentLang = languages.find(l => l.code === selectedLanguage);
    utterance.lang = currentLang?.voice || 'en-US';
    utterance.rate = 0.9;
    utterance.pitch = 1;

    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => {
      setIsSpeaking(false);
      // Auto-restart listening after AI finishes speaking in voice mode
      if (chatMode === 'voice' && autoRestartAfterResponse) {
        setAutoRestartAfterResponse(false);
        setTimeout(() => {
          if (chatMode === 'voice' && !isListening) {
            startListening();
          }
        }, 500); // Small delay before restarting
      }
    };
    utterance.onerror = (event) => {
      console.log('Speech error (likely cancelled):', event.error);
      setIsSpeaking(false);
    };

    synthRef.current = utterance;
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  // Stop speech on component unmount or navigation
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopSpeaking();
      }
    };

    const handleBeforeUnload = () => {
      stopSpeaking();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      stopSpeaking(); // Stop speech when component unmounts
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, []);

  // Stop speech when sending new message
  const stopSpeechBeforeAction = () => {
    if (isSpeaking) {
      stopSpeaking();
    }
  };

  const sendMessage = async (isVoice = false) => {
    const messageText = inputMessage.trim();
    if (!messageText) {
      console.log('No message to send');
      return;
    }
    
    console.log('Sending message:', messageText);
    
    // Clear input immediately
    setInputMessage('');
    inputMessageRef.current = '';

    // Stop any ongoing speech before sending new message
    stopSpeechBeforeAction();

    const userMessage: Message = {
      id: Date.now().toString(),
      text: messageText,
      sender: 'user',
      timestamp: new Date(),
      isVoice
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const response = await fetch('/api/chatbot', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: messageText,
          language: selectedLanguage 
        })
      });

      const data = await response.json();

      // Error messages in different languages
      const errorMessages = {
        en: 'I apologize, but I could not process your request. Please try again.',
        hi: 'माफ करें, मैं आपके अनुरोध को प्रोसेस नहीं कर सका। कृपया पुनः प्रयास करें।',
        pa: 'ਮਾਫ ਕਰੋ, ਮੈਂ ਤੁਹਾਡੀ ਬੇਨਤੀ ਦਾ ਜਵਾਬ ਨਹੀਂ ਦੇ ਸਕਿਆ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
        ta: 'மன்னிக்கவும், உங்கள் கேள்வியை நான் செயல்படுத்த முடியவில்லை। தயவு செய்து மீண்டும் முயற்சிக்கவும்।',
        te: 'క్షమించండి, నేను మీ విన్నపాని ప్రొసెస్ చేయలేకపోయాను। దయచేసి మరలా ప्रयत्निशलु।',
        mr: 'माफ करा, मी तुमच्या विनंतीवर प्रक्रिया करू शकलो नाही। कृपया पुन्हा प्रयत्न करा।',
        gu: 'માફ કરો, હું તમારી વિનંતી પર પ્રક્રિયા કરી શક્યો નઞી। કૃપા કરીને ફરીથી પ્રયાસ કરો।',
        bn: 'দুঃখিত, আমি আপনার অনুরোধ প্রক্রিয়া করতে পারিনি। অনুগ্রহ করে আবার চেষ্টা করুন।'
      };
      
      const errorMessage = errorMessages[selectedLanguage as keyof typeof errorMessages] || errorMessages.en;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: data.response || errorMessage,
        sender: 'assistant',
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);

      // Speak the response in background if in voice mode or if it was a voice message
      if (chatMode === 'voice' || isVoice) {
        // Speak the text after a short delay to ensure UI updates first
        setTimeout(() => {
          speakText(assistantMessage.text);
        }, 100);
        
        // Auto-restart listening after response in voice mode
        if (chatMode === 'voice') {
          setAutoRestartAfterResponse(true);
        }
      }
    } catch (error) {
      // Connection error messages in different languages
      const connectionErrorMessages = {
        en: 'Sorry, I am having trouble connecting. Please try again.',
        hi: 'खेद है, मुझे कनेक्ट करने में समस्या हो रही है। कृपया पुनः प्रयास करें।',
        pa: 'ਮਾਫ ਕਰੋ, ਮੈਨੂੰ ਕਨੈਕਟ ਕਰਨ ਵਿੱਚ ਸਮੱਸਿਆ ਵਾਪਰ ਰਹੀ ਹੈ। ਕਿਰਪਾ ਕਰਕੇ ਦੁਬਾਰਾ ਕੋਸ਼ਿਸ਼ ਕਰੋ।',
        ta: 'ஒழ்க்கவும், நான் இணையம் அடைவதில் சிரமம் அனுபவிக்கிறேன்। தயவு செய்து மீண்டும் முயற்சிக்கவும்।',
        te: 'క్షమించండి, నాకు కనెక్ట్ అవ్వడంలో కష్టం వస్తోంది। దయచేసి మరలా ప्रयत्निशलु।',
        mr: 'माफ करा, मला जोडण्यात अडचण आली आहे। कृपया पुन्हा प्रयत्न करा।',
        gu: 'માફ કરો, મને જોડવામાં ટેકી કે વાંધો આવી ગયો આછે। કૃપા કરીને ફરીથી પ्रयास करो।',
        bn: 'দুঃখিত, আমার সংযোগ স্থাপনে সমস্যা হচ্ছে। অনুগ্রহ করে আবার চেষ্টা করুন।'
      };
      
      const connectionErrorMessage = connectionErrorMessages[selectedLanguage as keyof typeof connectionErrorMessages] || connectionErrorMessages.en;
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: connectionErrorMessage,
        sender: 'assistant',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  // No need for local changeLanguage - using global i18n.changeLanguage

  const suggestedQuestions = {
    en: [
      'What is the best time to plant wheat?',
      'How to identify pest infestation?',
      'Current weather forecast',
      'Government schemes for farmers'
    ],
    hi: [
      'गेहूं बोने का सबसे अच्छा समय क्या है?',
      'कीट संक्रमण की पहचान कैसे करें?',
      'वर्तमान मौसम पूर्वानुमान',
      'किसानों के लिए सरकारी योजनाएं'
    ],
    pa: [
      'ਕਣਕ ਬੀਜਣ ਦਾ ਸਭ ਤੋਂ ਵਧੀਆ ਸਮਾਂ ਕੀ ਹੈ?',
      'ਕੀੜੇ ਦੇ ਹਮਲੇ ਦੀ ਪਛਾਣ ਕਿਵੇਂ ਕਰੀਏ?',
      'ਮੌਜੂਦਾ ਮੌਸਮ ਦੀ ਭਵਿੱਖਬਾਣੀ',
      'ਕਿਸਾਨਾਂ ਲਈ ਸਰਕਾਰੀ ਸਕੀਮਾਂ'
    ],
    ta: [
      'கோதுமை விதைப்பதற்கு சிறந்த நேரம் எது?',
      'பூச்சித் தொற்றை எவ்வாறு அடையாளம் காண்பது?',
      'தற்போதைய வானிலை முன்னறிவிப்பு',
      'விவசாயிகளுக்கான அரசு திட்டங்கள்'
    ],
    te: [
      'గోధుమ విత్తనానికి ఉత్తమ సమయం ఏమిటి?',
      'పురుగుల బారిన పడటాన్ని ఎలా గుర్తించాలి?',
      'ప్రస్తుత వాతావరణ అంచనా',
      'రైతులకు ప్రభుత్వ పథకాలు'
    ],
    mr: [
      'गहू पेरण्याची सर्वोत्तम वेळ कोणती आहे?',
      'कीटक संसर्ग कसा ओळखावा?',
      'सध्याचा हवामान अंदाज',
      'शेतकऱ्यांसाठी सरकारी योजना'
    ],
    gu: [
      'ઘઉં વાવવાનો શ્રેષ્ઠ સમય શું છે?',
      'જંતુના ચેપને કેવી રીતે ઓળખવો?',
      'વર્તમાન હવામાન આગાહી',
      'ખેડૂતો માટે સરકારી યોજનાઓ'
    ],
    bn: [
      'গম রোপণের জন্য সেরা সময় কী?',
      'পোকামাকড়ের আক্রমণ কীভাবে চিহ্নিত করবেন?',
      'বর্তমান আবহাওয়ার পূর্বাভাস',
      'কৃষকদের জন্য সরকারি প্রকল্প'
    ]
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const currentQuestions = (suggestedQuestions as any)[selectedLanguage] || suggestedQuestions.en;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-lg h-[calc(100vh-200px)] md:h-[600px] flex flex-col">
        {/* Header with Language Selector */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-3 md:p-4 rounded-t-lg">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg md:text-xl font-bold flex items-center text-white drop-shadow">
                <Bot className="h-5 w-5 md:h-6 md:w-6 mr-2" />
                {t('assistant.title')}
              </h2>
              <p className="text-xs md:text-sm text-green-50 font-medium">{t('assistant.subtitle')}</p>
            </div>
            <div className="flex items-center space-x-2">
              <Languages className="h-4 w-4 text-white" />
              <select
                value={selectedLanguage}
                onChange={(e) => i18n.changeLanguage(e.target.value)}
                className="bg-white/25 backdrop-blur text-white font-medium border border-white/40 rounded px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-white/50"
              >
                {languages.map(lang => (
                  <option key={lang.code} value={lang.code} className="text-gray-800 font-medium bg-white">
                    {lang.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Chat Mode Toggle */}
        <div className="px-4 py-2 border-b bg-gray-50 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            {/* Mode Toggle Buttons */}
            <div className="flex bg-white border border-gray-300 rounded-lg p-1">
              <button
                onClick={() => {
                  setChatMode('text');
                  setVoiceEnabled(false);
                  if (microphoneError) setMicrophoneError('');
                  if (isListening) stopListening();
                  if (isSpeaking) stopSpeaking();
                }}
                className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  chatMode === 'text'
                    ? 'bg-blue-500 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <MessageCircle className="h-3 w-3 mr-1" />
                {selectedLanguage === 'hi' ? 'टेक्स्ट चैट' : 'Text Chat'}
              </button>
              <button
                onClick={() => {
                  setChatMode('voice');
                  setVoiceEnabled(true);
                  setInputMessage(''); // Clear any text input when switching to voice mode
                  if (microphoneError) setMicrophoneError('');
                }}
                className={`flex items-center px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  chatMode === 'voice'
                    ? 'bg-green-500 text-white shadow-sm'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Mic className="h-3 w-3 mr-1" />
                {selectedLanguage === 'hi' ? 'वॉयस चैट' : 'Voice Chat'}
              </button>
            </div>

            {/* Voice Controls - Only show in voice mode */}
            {chatMode === 'voice' && (
              <>
                {isSpeaking && (
                  <button
                    onClick={stopSpeaking}
                    className="px-3 py-1 bg-red-100 text-red-700 rounded-full text-sm font-medium transition-colors hover:bg-red-200"
                  >
                    <Volume2 className="h-3 w-3 inline mr-1" />
                    {selectedLanguage === 'hi' ? 'रोकें' : 'Stop'}
                  </button>
                )}
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {/* Mode Indicator */}
            <div className={`px-2 py-1 rounded-full text-xs font-medium ${
              chatMode === 'voice' 
                ? 'bg-green-100 text-green-700' 
                : 'bg-blue-100 text-blue-700'
            }`}>
              {chatMode === 'voice' ? (
                <span className="flex items-center">
                  <Mic className="h-3 w-3 mr-1" />
                  {selectedLanguage === 'hi' ? 'वॉयस मोड' : 'Voice Mode'}
                </span>
              ) : (
                <span className="flex items-center">
                  <MessageCircle className="h-3 w-3 mr-1" />
                  {selectedLanguage === 'hi' ? 'टेक्स्ट मोड' : 'Text Mode'}
                </span>
              )}
            </div>
            
            {/* Listening Indicator - Only in voice mode */}
            {chatMode === 'voice' && isListening && (
              <span className="flex items-center text-green-600">
                <span className="animate-pulse mr-2">🎤</span>
                {selectedLanguage === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}
              </span>
            )}
          </div>
        </div>
        
        {/* Microphone Error Message */}
        {microphoneError && (
          <div className="px-4 py-2 bg-red-50 border-b border-red-200">
            <div className="flex items-start space-x-2">
              <MicOff className="h-4 w-4 text-red-500 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-red-700">
                <p className="font-medium">{microphoneError}</p>
                {microphonePermission === 'denied' && (
                  <p className="mt-1 text-xs">
                    {selectedLanguage === 'hi' 
                      ? 'ब्राउज़र सेटिंग्स में जाकर माइक्रोफोन की अनुमति दें।'
                      : 'Go to browser settings to enable microphone access.'}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Messages - Hide in voice mode */}
        {chatMode === 'text' && (
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-xs lg:max-w-md ${
                  message.sender === 'user' ? 'flex-row-reverse' : ''
                }`}>
                  <div className={`p-2 rounded-full ${
                    message.sender === 'user' ? 'bg-blue-500 ml-2' : 'bg-green-500 mr-2'
                  }`}>
                    {message.sender === 'user' ? (
                      <User className="h-5 w-5 text-white" />
                    ) : (
                      <Bot className="h-5 w-5 text-white" />
                    )}
                  </div>
                  <div>
                    <div className={`px-4 py-2 rounded-lg ${
                      message.sender === 'user' 
                        ? 'bg-blue-500 text-white font-medium' 
                        : 'bg-gray-100 text-gray-800 font-medium border border-gray-200'
                    }`}>
                      <p className="text-sm">{message.text}</p>
                    </div>
                    <p className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-right' : 'text-left'
                    } text-gray-600 font-medium`}>
                      {message.timestamp.toLocaleTimeString()}
                      {message.isVoice && ' 🎤'}
                    </p>
                  </div>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center bg-gray-100 border border-gray-200 rounded-lg px-4 py-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                  <span className="text-sm font-medium text-gray-700">{t('assistant.thinking')}</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
        )}
        
        {/* Voice Mode - Full Screen Voice Interface */}
        {chatMode === 'voice' && (
          <div className="flex-1 flex items-center justify-center p-8">
            <div className="text-center space-y-8 max-w-md">
              {/* AI Status - Show when AI is thinking or speaking */}
              {(isLoading || isSpeaking) && (
                <div className="mb-8">
                  <div className="flex items-center justify-center space-x-3 bg-green-50 border border-green-200 rounded-lg p-4">
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-green-600"></div>
                        <span className="text-green-700 font-medium">
                          {selectedLanguage === 'hi' ? '🤔 सोच रहे हैं...' : '🤔 Thinking...'}
                        </span>
                      </>
                    ) : (
                      <>
                        <Volume2 className="h-5 w-5 text-green-600 animate-pulse" />
                        <span className="text-green-700 font-medium">
                          {selectedLanguage === 'hi' ? '🗣️ जवाब दे रहे हैं...' : '🗣️ Speaking...'}
                        </span>
                      </>
                    )}
                  </div>
                </div>
              )}
              
              {/* Large Voice Button with different states */}
              <button
                onClick={toggleVoiceListening}
                disabled={microphonePermission === 'denied' || isLoading || isSpeaking}
                className={`relative p-12 rounded-full transition-all duration-300 disabled:cursor-not-allowed ${
                  isLoading
                    ? 'bg-yellow-500 text-white shadow-2xl animate-pulse'
                    : isListening 
                    ? 'bg-red-500 text-white shadow-2xl scale-110' 
                    : isSpeaking
                    ? 'bg-blue-500 text-white shadow-xl'
                    : microphonePermission === 'denied'
                    ? 'bg-gray-400 text-white opacity-50'
                    : 'bg-green-500 text-white hover:bg-green-600 shadow-xl hover:shadow-2xl hover:scale-105'
                }`}
                title={
                  isLoading ? 'AI is thinking...' :
                  isSpeaking ? 'AI is speaking...' :
                  microphonePermission === 'denied' ? 'Microphone access denied' : 
                  'Click to speak'
                }
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin">
                      <Bot className="h-16 w-16" />
                    </div>
                    {/* Animated rings for thinking state */}
                    <div className="absolute inset-0 rounded-full border-4 border-yellow-300 animate-ping"></div>
                  </>
                ) : isSpeaking ? (
                  <>
                    <Volume2 className="h-16 w-16 animate-pulse" />
                    {/* Animated rings for speaking state */}
                    <div className="absolute inset-0 rounded-full border-4 border-blue-300 animate-ping"></div>
                  </>
                ) : isListening ? (
                  <>
                    <MicOff className="h-16 w-16" />
                    {/* Animated rings for listening state */}
                    <div className="absolute inset-0 rounded-full border-4 border-red-300 animate-ping"></div>
                    <div className="absolute inset-2 rounded-full border-2 border-red-200 animate-pulse"></div>
                  </>
                ) : (
                  <Mic className="h-16 w-16" />
                )}
              </button>
              
              {/* Voice Status Text */}
              <div className="space-y-2">
                {isLoading ? (
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-yellow-600 animate-pulse">
                      🤔 {selectedLanguage === 'hi' ? 'सोच रहे हैं...' : 'Thinking...'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedLanguage === 'hi' 
                        ? 'AI आपके सवाल का जवाब तैयार कर रहा है'
                        : 'AI is preparing your answer'}
                    </p>
                  </div>
                ) : isSpeaking ? (
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-blue-600 animate-pulse">
                      🗣️ {selectedLanguage === 'hi' ? 'बोल रहे हैं...' : 'Speaking...'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedLanguage === 'hi' 
                        ? 'AI आपको जवाब सुना रहा है'
                        : 'AI is speaking the answer'}
                    </p>
                  </div>
                ) : isListening ? (
                  <div className="space-y-2">
                    <p className="text-xl font-bold text-red-600 animate-pulse">
                      🔴 {selectedLanguage === 'hi' ? 'सुन रहे हैं...' : 'Listening...'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedLanguage === 'hi' 
                        ? 'बोलना समाप्त करने के लिए फिर से क्लिक करें'
                        : 'Click again to stop speaking'}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xl font-semibold text-green-600">
                      🎤 {selectedLanguage === 'hi' 
                        ? 'बोलने के लिए क्लिक करें'
                        : 'Click to speak'}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedLanguage === 'hi' 
                        ? 'बोलने के बाद AI आपको जवाब सुनाएगा और फिर से सुनना शुरू करेगा'
                        : 'AI will respond and automatically listen for your next question'}
                    </p>
                  </div>
                )}
              </div>
              
              {/* Voice Instructions */}
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="text-sm text-green-800 space-y-2">
                  <p className="font-semibold">
                    {selectedLanguage === 'hi' ? '💡 कैसे उपयोग करें:' : '💡 How to use:'}
                  </p>
                  <ul className="space-y-1 text-xs text-left">
                    <li>{selectedLanguage === 'hi' 
                      ? '• माइक्रोफोन पर क्लिक करें और बोलें'
                      : '• Click the microphone and start speaking'}</li>
                    <li>{selectedLanguage === 'hi' 
                      ? '• बोलना समाप्त होने पर फिर से क्लिक करें'
                      : '• Click again when finished speaking'}</li>
                    <li>{selectedLanguage === 'hi' 
                      ? '• AI जवाब देगा और अगले सवाल के लिए सुनेगा'
                      : '• AI will respond and listen for your next question'}</li>
                  </ul>
                </div>
              </div>
              
              {/* Error Message */}
              {microphonePermission === 'denied' && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start space-x-3">
                    <MicOff className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                    <div className="text-sm text-red-700 text-left">
                      <p className="font-semibold mb-1">
                        {selectedLanguage === 'hi' ? 'माइक्रोफोन एक्सेस आवश्यक' : 'Microphone Access Required'}
                      </p>
                      <p className="text-xs">
                        {selectedLanguage === 'hi' 
                          ? 'वॉयस चैट के लिए कृपया ब्राउज़र में माइक्रोफोन की अनुमति दें।'
                          : 'Please allow microphone access in your browser for voice chat.'}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Suggested Questions */}
        <div className="px-4 py-2 border-t bg-gray-50">
          <p className="text-xs text-gray-700 font-semibold mb-2">{t('assistant.suggestedQuestions')}:</p>
          <div className="flex flex-wrap gap-2">
            {currentQuestions.slice(0, 3).map((question: string, index: number) => (
              <button
                key={index}
                onClick={() => setInputMessage(question)}
                className="text-xs bg-white hover:bg-gray-100 px-3 py-1 rounded-full transition-colors border border-gray-300 text-gray-700 font-medium hover:border-gray-400"
              >
                {question}
              </button>
            ))}
          </div>
        </div>

        {/* Input - Different UI based on chat mode */}
        <div className="p-4 border-t">
          {chatMode === 'text' ? (
            /* Text Chat Mode */
            <div className="space-y-2">
              <div className="flex space-x-2">
                <input
                  type="text"
                  value={inputMessage}
                  onChange={(e) => setInputMessage(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={selectedLanguage === 'hi' 
                    ? 'अपना सवाल टाइप करें...'
                    : 'Type your question...'}
                  className="flex-1 px-4 py-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-500 text-gray-900 font-medium placeholder-gray-500 bg-white transition-colors"
                  disabled={isLoading}
                />
                <button
                  onClick={() => sendMessage()}
                  disabled={isLoading || !inputMessage.trim()}
                  className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 disabled:bg-gray-300 transition-colors font-medium flex items-center space-x-2"
                >
                  <Send className="h-5 w-5" />
                  <span className="hidden sm:inline">{selectedLanguage === 'hi' ? 'भेजें' : 'Send'}</span>
                </button>
              </div>
              <p className="text-xs text-blue-600 text-center font-medium">
                💬 {selectedLanguage === 'hi' 
                  ? 'टेक्स्ट मोड: अपने सवाल टाइप करें और Enter दबाएं'
                  : 'Text Mode: Type your questions and press Enter'}
              </p>
            </div>
          ) : null
          }
        </div>
      </div>
    </div>
  );
}