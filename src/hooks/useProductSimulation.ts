import { useState, useEffect } from 'react';

export interface SimulatedProduct {
  id: string;
  url: string;
  store: 'shein' | 'amazon' | 'aliexpress';
  title: string;
  price: number;
  currency: string;
  image: string;
  description: string;
  variants: string[];
  shippingTime: string;
  affiliateLink: string;
  costBreakdown: {
    productPrice: number;
    serviceFee: number;
    shippingCost: number;
    total: number;
  };
  createdAt: string;
}

const STORAGE_KEY = 'simulated_products';

const mockProducts: Record<string, Partial<SimulatedProduct>> = {
  shein: {
    store: 'shein',
    title: 'Vestido Floral de Verano - Shein',
    description: 'Hermoso vestido floral perfecto para el verano. Material ligero y cómodo.',
    variants: ['S', 'M', 'L', 'XL'],
    shippingTime: '15-25 días',
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400',
  },
  amazon: {
    store: 'amazon',
    title: 'Smartwatch Deportivo - Amazon',
    description: 'Reloj inteligente con monitor de frecuencia cardíaca y GPS integrado.',
    variants: ['Negro', 'Azul', 'Rosa'],
    shippingTime: '10-20 días',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  },
  aliexpress: {
    store: 'aliexpress',
    title: 'Auriculares Bluetooth Premium - AliExpress',
    description: 'Auriculares inalámbricos con cancelación de ruido y 30 horas de batería.',
    variants: ['Negro', 'Blanco'],
    shippingTime: '20-35 días',
    image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400',
  },
};

export const useProductSimulation = () => {
  const [products, setProducts] = useState<SimulatedProduct[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setProducts(JSON.parse(stored));
    }
  }, []);

  const saveProducts = (newProducts: SimulatedProduct[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newProducts));
    setProducts(newProducts);
  };

  const simulateExtraction = (url: string): SimulatedProduct => {
    const store = url.includes('shein') 
      ? 'shein' 
      : url.includes('amazon') 
      ? 'amazon' 
      : 'aliexpress';

    const basePrice = Math.random() * 50 + 20;
    const serviceFee = basePrice * 0.12;
    const shippingCost = 25 + Math.random() * 10;
    const total = basePrice + serviceFee + shippingCost;

    const mockData = mockProducts[store];

    const product: SimulatedProduct = {
      id: `sim_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      url,
      store,
      title: mockData.title!,
      price: parseFloat(basePrice.toFixed(2)),
      currency: 'USD',
      image: mockData.image!,
      description: mockData.description!,
      variants: mockData.variants!,
      shippingTime: mockData.shippingTime!,
      affiliateLink: `https://affiliate.link/${store}/${Date.now()}`,
      costBreakdown: {
        productPrice: parseFloat(basePrice.toFixed(2)),
        serviceFee: parseFloat(serviceFee.toFixed(2)),
        shippingCost: parseFloat(shippingCost.toFixed(2)),
        total: parseFloat(total.toFixed(2)),
      },
      createdAt: new Date().toISOString(),
    };

    const newProducts = [product, ...products];
    saveProducts(newProducts);
    return product;
  };

  const deleteProduct = (id: string) => {
    const newProducts = products.filter(p => p.id !== id);
    saveProducts(newProducts);
  };

  const clearAll = () => {
    localStorage.removeItem(STORAGE_KEY);
    setProducts([]);
  };

  return {
    products,
    simulateExtraction,
    deleteProduct,
    clearAll,
  };
};
