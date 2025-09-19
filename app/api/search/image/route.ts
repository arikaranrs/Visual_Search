import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize Google AI
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_VISION_API_KEY!);

// Sample product database - replace with your actual database
const PRODUCTS = [
  {
    id: '1',
    name: 'Wireless Bluetooth Headphones',
    category: 'Electronics',
    description: 'Premium wireless headphones with noise cancellation',
    price: 199.99,
    image: 'https://images.pexels.com/photos/3394650/pexels-photo-3394650.jpeg',
    tags: ['headphones', 'wireless', 'bluetooth', 'audio', 'music', 'black']
  },
  {
    id: '2',
    name: 'Smartphone',
    category: 'Electronics',
    description: 'Latest smartphone with advanced camera',
    price: 699.99,
    image: 'https://images.pexels.com/photos/699122/pexels-photo-699122.jpeg',
    tags: ['phone', 'smartphone', 'mobile', 'device', 'technology', 'black']
  },
  {
    id: '3',
    name: 'Laptop Computer',
    category: 'Electronics',
    description: 'High-performance laptop for work and gaming',
    price: 1299.99,
    image: 'https://images.pexels.com/photos/205421/pexels-photo-205421.jpeg',
    tags: ['laptop', 'computer', 'technology', 'work', 'gaming', 'silver']
  },
  {
    id: '4',
    name: 'Coffee Mug',
    category: 'Home',
    description: 'Ceramic coffee mug with elegant design',
    price: 15.99,
    image: 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg',
    tags: ['mug', 'coffee', 'ceramic', 'drink', 'white', 'kitchen']
  },
  {
    id: '5',
    name: 'Running Shoes',
    category: 'Sports',
    description: 'Comfortable running shoes for athletes',
    price: 129.99,
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg',
    tags: ['shoes', 'running', 'sports', 'athletic', 'footwear', 'white']
  }
];

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('image') as File;

    if (!file) {
      return NextResponse.json({ error: 'No image file provided' }, { status: 400 });
    }

    // Convert file to base64
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');

    // Use Google Gemini Vision for image analysis
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const prompt = `Analyze this image and identify the main object/product. Provide:
    1. Object name
    2. Category (Electronics, Home, Sports, Fashion, etc.)
    3. Key visual features (color, shape, material)
    4. Relevant search keywords
    
    Format your response as JSON with these fields: name, category, features, keywords`;

    const imagePart = {
      inlineData: {
        data: base64Image,
        mimeType: file.type,
      },
    };

    const result = await model.generateContent([prompt, imagePart]);
    const response = await result.response;
    const analysisText = response.text();

    // Parse AI response
    let analysis;
    try {
      // Extract JSON from response
      const jsonMatch = analysisText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        analysis = JSON.parse(jsonMatch[0]);
      } else {
        // Fallback parsing
        analysis = {
          name: 'Unknown Product',
          category: 'General',
          features: ['object'],
          keywords: ['product']
        };
      }
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      analysis = {
        name: 'Unknown Product',
        category: 'General',
        features: ['object'],
        keywords: ['product']
      };
    }

    // Find matching products based on analysis
    const searchTerms = [
      analysis.name?.toLowerCase() || '',
      analysis.category?.toLowerCase() || '',
      ...(analysis.features || []).map((f: string) => f.toLowerCase()),
      ...(analysis.keywords || []).map((k: string) => k.toLowerCase())
    ].filter(term => term.length > 0);

    const matchedProducts = PRODUCTS.filter(product => {
      const productTerms = [
        product.name.toLowerCase(),
        product.category.toLowerCase(),
        product.description.toLowerCase(),
        ...product.tags
      ];

      return searchTerms.some(searchTerm => 
        productTerms.some(productTerm => 
          productTerm.includes(searchTerm) || searchTerm.includes(productTerm)
        )
      );
    });

    // Calculate relevance scores
    const scoredProducts = matchedProducts.map(product => {
      let score = 0;
      const productTerms = [
        product.name.toLowerCase(),
        product.category.toLowerCase(),
        ...product.tags
      ];

      searchTerms.forEach(searchTerm => {
        productTerms.forEach(productTerm => {
          if (productTerm.includes(searchTerm)) score += 2;
          if (searchTerm.includes(productTerm)) score += 1;
        });
      });

      return { ...product, relevanceScore: score };
    });

    // Sort by relevance and return top results
    const sortedProducts = scoredProducts
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 10);

    return NextResponse.json({
      success: true,
      analysis,
      products: sortedProducts,
      totalResults: sortedProducts.length
    });

  } catch (error) {
    console.error('Image search error:', error);
    return NextResponse.json(
      { error: 'Failed to process image search' },
      { status: 500 }
    );
  }
}