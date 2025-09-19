'use client';

import { useState, useRef } from 'react';
import { Search, Mic, Camera, Upload, X, Loader2 } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  category: string;
  description: string;
  price: number;
  image: string;
  tags: string[];
  relevanceScore?: number;
}

interface SearchResults {
  products: Product[];
  totalResults: number;
  analysis?: any;
}

export default function SearchInterface() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResults | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Text search
  const handleTextSearch = async () => {
    if (!query.trim()) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(`/api/search/text?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error('Text search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Voice search
  const handleVoiceSearch = () => {
    if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
      alert('Speech recognition not supported in this browser');
      return;
    }

    const SpeechRecognition = (window as any).webkitSpeechRecognition || (window as any).SpeechRecognition;
    const recognition = new SpeechRecognition();
    
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsListening(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setQuery(transcript);
      setIsListening(false);
    };

    recognition.onerror = () => {
      setIsListening(false);
      alert('Voice recognition error. Please try again.');
    };

    recognition.onend = () => {
      setIsListening(false);
    };

    recognition.start();
  };

  // Image search
  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageSearch = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('/api/search/image', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      if (data.success) {
        setResults(data);
        setQuery(data.analysis?.name || 'Image search results');
      } else {
        alert('Image search failed: ' + data.error);
      }
    } catch (error) {
      console.error('Image search error:', error);
      alert('Image search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const clearImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Search Interface */}
      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleTextSearch()}
              placeholder="Search for products..."
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
          
          <button
            onClick={handleVoiceSearch}
            disabled={isListening}
            className={`p-4 rounded-xl transition-colors ${
              isListening 
                ? 'bg-red-500 text-white animate-pulse' 
                : 'bg-gray-100 hover:bg-gray-200 text-gray-600'
            }`}
          >
            <Mic className="w-5 h-5" />
          </button>

          <button
            onClick={() => fileInputRef.current?.click()}
            className="p-4 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-xl transition-colors"
          >
            <Camera className="w-5 h-5" />
          </button>

          <button
            onClick={handleTextSearch}
            disabled={isLoading}
            className="px-8 py-4 bg-blue-500 hover:bg-blue-600 text-white rounded-xl transition-colors font-medium disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Search'}
          </button>
        </div>

        {/* Image Upload Section */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
        />

        {imagePreview && (
          <div className="mt-4 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-medium text-gray-700">Selected Image</h3>
              <button
                onClick={clearImage}
                className="p-1 hover:bg-gray-200 rounded-full transition-colors"
              >
                <X className="w-4 h-4 text-gray-500" />
              </button>
            </div>
            <div className="flex items-center gap-4">
              <img
                src={imagePreview}
                alt="Selected"
                className="w-20 h-20 object-cover rounded-lg border"
              />
              <button
                onClick={handleImageSearch}
                disabled={isLoading}
                className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors font-medium disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Analyzing...
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Search by Image
                  </div>
                )}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Search Results */}
      {results && (
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-800">
              Search Results
            </h2>
            <span className="text-gray-500">
              {results.totalResults} products found
            </span>
          </div>

          {/* Image Analysis Results */}
          {results.analysis && (
            <div className="mb-6 p-4 bg-blue-50 rounded-xl">
              <h3 className="font-semibold text-blue-800 mb-2">Image Analysis</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-blue-700">Detected Object:</span>
                  <span className="ml-2 text-blue-600">{results.analysis.name}</span>
                </div>
                <div>
                  <span className="font-medium text-blue-700">Category:</span>
                  <span className="ml-2 text-blue-600">{results.analysis.category}</span>
                </div>
              </div>
            </div>
          )}

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {results.products.map((product) => (
              <div key={product.id} className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg';
                    }}
                  />
                </div>
                <div className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-blue-600 font-medium">{product.category}</span>
                    {product.relevanceScore && (
                      <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                        {product.relevanceScore}% match
                      </span>
                    )}
                  </div>
                  <h3 className="font-semibold text-gray-800 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-gray-900">${product.price}</span>
                    <button className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors text-sm font-medium">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {results.products.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">
                <Search className="w-16 h-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-600 mb-2">No products found</h3>
              <p className="text-gray-500">Try adjusting your search terms or upload a different image</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}