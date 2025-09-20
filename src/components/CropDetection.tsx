'use client';

import { useState, useEffect, useCallback } from 'react';
import { Camera, Upload, CheckCircle, Volume2, AlertTriangle, Leaf } from 'lucide-react';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';

interface CropAnalysis {
  plantType: string;
  healthStatus: string;
  diseaseIdentification: string;
  symptoms: string;
  causes: string;
  treatment: string;
  prevention: string;
  urgency: string;
  fullAnalysis: string;
}

export default function CropDetection() {
  const { i18n } = useTranslation();
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [analysis, setAnalysis] = useState<CropAnalysis | null>(null);
  const [loading, setLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);

  // Function to stop speech synthesis
  const stopSpeech = useCallback(() => {
    if (isSpeaking && 'speechSynthesis' in window) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      console.log('Speech interrupted');
    }
  }, [isSpeaking]);

  // Stop speech on component unmount
  useEffect(() => {
    return () => {
      stopSpeech();
    };
  }, [stopSpeech]);

  // Stop speech when user navigates away or page visibility changes
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        stopSpeech();
      }
    };

    const handleBeforeUnload = () => {
      stopSpeech();
    };

    const handlePopState = () => {
      stopSpeech();
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', handleBeforeUnload);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('beforeunload', handleBeforeUnload);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [stopSpeech]);

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Stop any ongoing speech when new image is selected
    stopSpeech();
    
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
      setAnalysis(null);
    }
  };

  const analyzeImage = async () => {
    if (!selectedImage) return;

    // Stop any ongoing speech when starting new analysis
    stopSpeech();
    
    setLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('/api/crop-detection', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      setAnalysis(data.analysis);
    } catch (error) {
      console.error('Error analyzing image:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    const lower = urgency.toLowerCase();
    if (lower.includes('high')) return 'text-red-600 bg-red-50';
    if (lower.includes('medium')) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const formatToShortText = (text: string, maxLength: number = 300): string => {
    // Clean the text and limit to maxLength characters
    const cleanText = text.replace(/[.]{2,}/g, '.').replace(/\s+/g, ' ').trim();
    if (cleanText.length <= maxLength) return cleanText;
    
    // Find the last sentence that fits within the limit
    const sentences = cleanText.split('. ');
    let result = '';
    
    for (const sentence of sentences) {
      const testResult = result + (result ? '. ' : '') + sentence;
      if (testResult.length <= maxLength) {
        result = testResult;
      } else {
        break;
      }
    }
    
    return result + (result && !result.endsWith('.') ? '.' : '');
  };

  const formatToBulletPoints = (text: string, maxPoints: number = 3): string[] => {
    // Split by common delimiters like periods, semicolons, or numbered lists
    const sentences = text.split(/[.;]|\d+\.|\d+\)/)
      .map(s => s.trim())
      .filter(s => s.length > 15); // Filter out very short segments
    
    // Take only the first maxPoints items
    return sentences.slice(0, maxPoints);
  };

  const speakAnalysis = () => {
    if (!analysis) {
      alert('No analysis available to speak');
      return;
    }
    
    // Check if speech synthesis is supported
    if (!('speechSynthesis' in window)) {
      alert('Text-to-speech is not supported in your browser');
      return;
    }
    
    if (isSpeaking) {
      speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Create a simple summary for speech
    const summary = `Analysis complete. This is a ${analysis.plantType.split('.')[0]}. Health status: ${analysis.healthStatus.split('.')[0]}. Disease: ${analysis.diseaseIdentification}. Treatment: ${analysis.treatment.split('.')[0]}. Prevention: ${analysis.prevention.split('.')[0]}.`;

    console.log('Speaking:', summary);
    
    try {
      const utterance = new SpeechSynthesisUtterance(summary);
      
      // Simple settings
      utterance.rate = 0.9;
      utterance.volume = 1;
      utterance.pitch = 1;
      
      // Event handlers
      utterance.onstart = () => {
        console.log('Speech started');
        setIsSpeaking(true);
      };
      
      utterance.onend = () => {
        console.log('Speech ended');
        setIsSpeaking(false);
      };
      
      utterance.onerror = (event) => {
        console.error('Speech error:', event.error);
        setIsSpeaking(false);
        alert('Unable to speak results. Please check your browser settings.');
      };

      // Use default voice - don't try to set a specific voice
      speechSynthesis.speak(utterance);
      
    } catch (error) {
      console.error('Speech synthesis failed:', error);
      setIsSpeaking(false);
      alert('Speech synthesis is not available');
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <Camera className="h-6 w-6 mr-2 text-green-600" />
          Crop Health Detection
        </h2>
        <p className="text-gray-700 font-medium">
          Upload a photo of your crop to get AI-powered disease detection and treatment recommendations
        </p>
      </div>

      {/* Image Upload */}
      <div className="bg-white rounded-lg shadow-md p-4 md:p-6">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 md:p-8">
          {!imagePreview ? (
            <div className="text-center">
              <Upload className="h-12 w-12 mx-auto text-gray-500 mb-4" />
              <p className="text-gray-700 font-medium mb-2">Click to upload an image of your crop</p>
              <p className="text-sm text-gray-600 font-medium mb-4">Supported formats: JPG, PNG (Max 10MB)</p>
              <label className="cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
                <span className="bg-green-600 text-white px-6 py-2 rounded-lg inline-block hover:bg-green-700 transition-colors">
                  Choose Image
                </span>
              </label>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="relative h-64 md:h-96">
                <img
                  src={imagePreview}
                  alt="Crop preview"
                  className="w-full h-full object-contain rounded-lg"
                />
              </div>
              <div className="flex justify-center space-x-4">
                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageSelect}
                    className="hidden"
                  />
                  <span className="bg-gray-600 text-white px-4 py-2 rounded-lg inline-block hover:bg-gray-700 transition-colors">
                    Change Image
                  </span>
                </label>
                <button
                  onClick={analyzeImage}
                  disabled={loading}
                  className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 disabled:bg-gray-400 transition-colors"
                >
                  {loading ? 'Analyzing...' : 'Analyze Crop'}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white rounded-lg shadow-md p-6 space-y-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-gray-900">Analysis Results</h3>
            <button
              onClick={speakAnalysis}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isSpeaking 
                  ? 'bg-red-100 text-red-700 hover:bg-red-200' 
                  : 'bg-blue-100 text-blue-700 hover:bg-blue-200'
              }`}
            >
              <Volume2 className="h-4 w-4" />
              <span className="text-sm font-medium">
                {isSpeaking ? 'Stop Speaking' : 'Listen to Results'}
              </span>
            </button>
          </div>
          
          {/* Basic Info Section */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Crop Type</h4>
              {formatToBulletPoints(analysis.plantType, 2).length > 0 ? (
                <ul className="space-y-1">
                  {formatToBulletPoints(analysis.plantType, 2).map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-1 text-xs">•</span>
                      <span className="text-xs font-medium text-gray-800 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm font-bold text-gray-900">{analysis.plantType}</p>
              )}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Health Status</h4>
              {formatToBulletPoints(analysis.healthStatus, 2).length > 0 ? (
                <ul className="space-y-1">
                  {formatToBulletPoints(analysis.healthStatus, 2).map((point, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-1 text-xs">•</span>
                      <span className="text-xs font-medium text-gray-800 leading-relaxed">{point}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm font-bold text-gray-900">{analysis.healthStatus}</p>
              )}
            </div>
            <div className="bg-gray-50 p-3 rounded-lg">
              <h4 className="text-sm font-semibold text-gray-600 mb-2">Urgency Level</h4>
              <span className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${getUrgencyColor(analysis.urgency)}`}>
                {analysis.urgency}
              </span>
            </div>
          </div>
          
          {/* Problems Section - Red Box */}
          <div className="bg-red-50 border-l-4 border-red-500 rounded-lg p-4">
            <h4 className="font-bold text-red-800 mb-3 flex items-center text-lg">
              <AlertTriangle className="h-5 w-5 mr-2" />
              Problems Detected
            </h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-semibold text-red-800 mb-1">Disease/Problem:</h5>
                <p className="text-red-700 font-medium leading-relaxed">
                  {formatToShortText(analysis.diseaseIdentification, 120)}
                </p>
              </div>
              
              <div>
                <h5 className="font-semibold text-red-800 mb-1">Symptoms & Causes:</h5>
                <p className="text-red-700 leading-relaxed">
                  {formatToShortText(`${analysis.symptoms} ${analysis.causes}`, 250)}
                </p>
              </div>
            </div>
          </div>
          
          {/* Solutions Section - Green Box */}
          <div className="bg-green-50 border-l-4 border-green-500 rounded-lg p-4">
            <h4 className="font-bold text-green-800 mb-3 flex items-center text-lg">
              <CheckCircle className="h-5 w-5 mr-2" />
              Recommended Solutions
            </h4>
            
            <div className="space-y-3">
              <div>
                <h5 className="font-semibold text-green-800 mb-1">Treatment Steps:</h5>
                <p className="text-green-700 leading-relaxed">
                  {formatToShortText(analysis.treatment, 250)}
                </p>
              </div>
              
              <div>
                <h5 className="font-semibold text-green-800 mb-1">Prevention Measures:</h5>
                <p className="text-green-700 leading-relaxed">
                  {formatToShortText(analysis.prevention, 250)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tips */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
        <h4 className="text-yellow-800 font-semibold mb-2">Tips for Better Analysis</h4>
        <ul className="text-yellow-700 text-sm space-y-1">
          <li>• Take clear, well-lit photos in natural daylight</li>
          <li>• Focus on affected areas of the plant</li>
          <li>• Include both close-ups and overall plant views</li>
          <li>• Avoid blurry or dark images</li>
        </ul>
      </div>
    </div>
  );
}