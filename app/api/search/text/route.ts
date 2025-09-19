import { NextRequest, NextResponse } from 'next/server';

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

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.toLowerCase() || '';

  if (!query) {
    return NextResponse.json({ products: PRODUCTS, totalResults: PRODUCTS.length });
  }

  const searchTerms = query.split(' ').filter(term => term.length > 0);

  const matchedProducts = PRODUCTS.filter(product => {
    const productText = [
      product.name.toLowerCase(),
      product.category.toLowerCase(),
      product.description.toLowerCase(),
      ...product.tags
    ].join(' ');

    return searchTerms.some(term => productText.includes(term));
  });

  return NextResponse.json({
    products: matchedProducts,
    totalResults: matchedProducts.length,
    query
  });
}