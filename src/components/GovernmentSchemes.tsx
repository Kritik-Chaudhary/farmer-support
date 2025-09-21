'use client';

import { useState, useEffect } from 'react';
import { FileText, ChevronRight, Search, ExternalLink } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Scheme {
  id: number;
  name: string;
  category: string;
  description: string;
  benefits: string[];
  eligibility: string[];
  documents: string[];
  applicationProcess: string[];
  website: string;
  launchYear: number;
  ministry: string;
}

export default function GovernmentSchemes() {
  const { t, i18n } = useTranslation();
  const [schemes, setSchemes] = useState<Scheme[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedScheme, setSelectedScheme] = useState<Scheme | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSchemes();
  }, [selectedCategory, searchTerm, i18n.language]); // fetchSchemes is stable

  const fetchSchemes = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (selectedCategory !== 'all') params.append('category', selectedCategory);
      if (searchTerm) params.append('search', searchTerm);
      params.append('language', i18n.language);

      const response = await fetch(`/api/government-schemes?${params}`);
      const data = await response.json();
      setSchemes(data.schemes || []);
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching schemes:', error);
    } finally {
      setLoading(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    const icons: { [key: string]: string } = {
      'Financial Support': '💰',
      'Crop Insurance': '🛡️',
      'Soil Management': '🌱',
      'Solar Energy': '☀️',
      'Market Access': '🏪'
    };
    return icons[category] || '📋';
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="h-6 w-6 mr-2 text-green-600" />
          {t('schemes.title')}
        </h2>
        
        {/* Search and Filter */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t('schemes.search')}
              className="pl-10 pr-3 py-2 w-full border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900 font-medium placeholder-gray-500 bg-white"
            />
          </div>
          
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 text-gray-900 font-medium bg-white"
          >
            <option value="all" className="text-gray-900 font-medium">{t('schemes.allCategories')}</option>
            {categories.map(cat => (
              <option key={cat} value={cat} className="text-gray-900 font-medium">{cat}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Schemes Grid */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[...Array(6)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-start space-x-3 flex-1">
                  <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
                  <div className="flex-1">
                    <div className="h-5 bg-gray-200 rounded animate-pulse mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded animate-pulse w-3/4"></div>
                  </div>
                </div>
                <div className="w-16 h-5 bg-gray-200 rounded animate-pulse"></div>
              </div>
              
              <div className="h-4 bg-gray-200 rounded animate-pulse mb-4"></div>
              
              <div className="space-y-2 mb-4">
                <div className="flex items-start space-x-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse mt-1"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse flex-1"></div>
                </div>
                <div className="flex items-start space-x-2">
                  <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse mt-1"></div>
                  <div className="h-3 bg-gray-200 rounded animate-pulse flex-1"></div>
                </div>
              </div>
              
              <div className="h-4 bg-gray-200 rounded animate-pulse w-24"></div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-3">
                    <span className="text-2xl">{getCategoryIcon(scheme.category)}</span>
                    <div>
                      <h3 className="text-lg font-bold text-gray-900">{scheme.name}</h3>
                      <p className="text-sm text-gray-600 font-medium">{scheme.ministry}</p>
                    </div>
                  </div>
                  <span className="text-xs bg-gray-100 text-gray-700 font-semibold px-2 py-1 rounded border border-gray-200">
                    {t('schemes.since')} {scheme.launchYear}
                  </span>
                </div>
                
                <p className="text-gray-700 font-medium mb-4">{scheme.description}</p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex items-start space-x-2">
                    <span className="text-green-500">✓</span>
                    <span className="text-sm text-gray-700">{scheme.benefits[0]}</span>
                  </div>
                  {scheme.benefits.length > 1 && (
                    <div className="flex items-start space-x-2">
                      <span className="text-green-500">✓</span>
                      <span className="text-sm text-gray-700">{scheme.benefits[1]}</span>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setSelectedScheme(scheme)}
                  className="text-green-600 font-medium text-sm flex items-center hover:text-green-700"
                >
                  {t('schemes.viewDetails')} <ChevronRight className="h-4 w-4 ml-1" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Modal */}
      {selectedScheme && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end md:items-center justify-center md:p-4 z-50">
          <div className="bg-white rounded-t-xl md:rounded-lg w-full md:max-w-4xl max-h-[85vh] md:max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b p-4 md:p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1 mr-2">
                  <h2 className="text-lg md:text-2xl font-bold text-gray-900">{selectedScheme.name}</h2>
                  <p className="text-xs md:text-sm text-gray-600 font-medium">{selectedScheme.ministry}</p>
                </div>
                <button
                  onClick={() => setSelectedScheme(null)}
                  className="text-gray-600 hover:text-gray-800 text-2xl p-1 font-bold"
                >
                  ✕
                </button>
              </div>
            </div>
            
            <div className="p-4 md:p-6 space-y-4 md:space-y-6">
              <div>
                <h3 className="font-bold text-gray-900 mb-2">{t('schemes.description')}</h3>
                <p className="text-gray-700 font-medium">{selectedScheme.description}</p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('schemes.benefits')}</h3>
                <ul className="space-y-2">
                  {selectedScheme.benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-green-600 mt-0.5 font-bold">✓</span>
                      <span className="text-gray-700 font-medium">{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('schemes.eligibility')}</h3>
                <ul className="space-y-2">
                  {selectedScheme.eligibility.map((criteria, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="text-blue-600 mt-0.5 font-bold">•</span>
                      <span className="text-gray-700 font-medium">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('schemes.documents')}</h3>
                <div className="grid grid-cols-2 gap-2">
                  {selectedScheme.documents.map((doc, index) => (
                    <div key={index} className="bg-gray-50 px-3 py-2 rounded text-sm text-gray-700">
                      {doc}
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 mb-2">{t('schemes.process')}</h3>
                <ol className="space-y-2">
                  {selectedScheme.applicationProcess.map((step, index) => (
                    <li key={index} className="flex items-start space-x-2">
                      <span className="bg-green-100 text-green-800 border border-green-200 px-2 py-0.5 rounded-full text-xs font-bold">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 font-medium">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
              
              <div className="pt-4 border-t">
                <a
                  href={selectedScheme.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center space-x-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors"
                >
                  <span>{t('schemes.visitWebsite')}</span>
                  <ExternalLink className="h-4 w-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}