import { useState } from 'react';

export interface SearchProduct {
  id: string;
  title: string;
  price: number;
  currency: string;
  image: string;
  store: 'shein' | 'amazon' | 'aliexpress';
  rating: number;
  reviews: number;
  url: string;
  inStock: boolean;
}

const mockSearchResults: Record<string, SearchProduct[]> = {
  shein: [
    {
      id: 'sh1',
      title: 'Vestido Floral de Verano',
      price: 29.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
      store: 'shein',
      rating: 4.5,
      reviews: 1234,
      url: 'https://www.shein.com/product1',
      inStock: true,
    },
    {
      id: 'sh2',
      title: 'Blusa Casual Elegante',
      price: 19.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1564257577-86fb8bc1677a?w=400',
      store: 'shein',
      rating: 4.3,
      reviews: 856,
      url: 'https://www.shein.com/product2',
      inStock: true,
    },
    {
      id: 'sh3',
      title: 'Pantalones Deportivos',
      price: 24.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1517649763962-0c623066013b?w=400',
      store: 'shein',
      rating: 4.7,
      reviews: 2341,
      url: 'https://www.shein.com/product3',
      inStock: true,
    },
  ],
  amazon: [
    {
      id: 'am1',
      title: 'Smartwatch Deportivo',
      price: 89.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
      store: 'amazon',
      rating: 4.6,
      reviews: 5678,
      url: 'https://www.amazon.com/product1',
      inStock: true,
    },
    {
      id: 'am2',
      title: 'Auriculares Bluetooth',
      price: 49.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
      store: 'amazon',
      rating: 4.4,
      reviews: 3421,
      url: 'https://www.amazon.com/product2',
      inStock: true,
    },
    {
      id: 'am3',
      title: 'Teclado Mecánico RGB',
      price: 129.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400',
      store: 'amazon',
      rating: 4.8,
      reviews: 8765,
      url: 'https://www.amazon.com/product3',
      inStock: true,
    },
  ],
  aliexpress: [
    {
      id: 'al1',
      title: 'Funda para iPhone 14',
      price: 9.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1601593346740-925612772716?w=400',
      store: 'aliexpress',
      rating: 4.2,
      reviews: 9876,
      url: 'https://www.aliexpress.com/product1',
      inStock: true,
    },
    {
      id: 'al2',
      title: 'Lámpara LED Inteligente',
      price: 34.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=400',
      store: 'aliexpress',
      rating: 4.5,
      reviews: 6543,
      url: 'https://www.aliexpress.com/product2',
      inStock: true,
    },
    {
      id: 'al3',
      title: 'Power Bank 20000mAh',
      price: 24.99,
      currency: 'USD',
      image: 'https://images.unsplash.com/photo-1609091839311-d5365f9ff1c5?w=400',
      store: 'aliexpress',
      rating: 4.6,
      reviews: 4321,
      url: 'https://www.aliexpress.com/product3',
      inStock: true,
    },
  ],
};

export const useSearchProducts = () => {
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchProduct[]>([]);

  const searchProducts = async (
    query: string,
    store?: 'shein' | 'amazon' | 'aliexpress'
  ): Promise<SearchProduct[]> => {
    setIsSearching(true);

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    let searchResults: SearchProduct[] = [];

    if (store) {
      searchResults = mockSearchResults[store] || [];
    } else {
      // Search across all stores
      searchResults = [
        ...mockSearchResults.shein,
        ...mockSearchResults.amazon,
        ...mockSearchResults.aliexpress,
      ];
    }

    // Filter by query
    if (query.trim()) {
      searchResults = searchResults.filter(product =>
        product.title.toLowerCase().includes(query.toLowerCase())
      );
    }

    setResults(searchResults);
    setIsSearching(false);
    return searchResults;
  };

  const clearResults = () => {
    setResults([]);
  };

  return {
    isSearching,
    results,
    searchProducts,
    clearResults,
  };
};
