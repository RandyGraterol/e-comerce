import { useState } from 'react';
import { STORE_CATALOGS } from '@/lib/storeCatalogs';
import { Order } from '@/types/business';
import { generateTrackingEvents } from '@/lib/orderSimulator';
import { calculateCostBreakdown, calculateRevenueBreakdown } from '@/lib/costCalculator';
import { createSuccessResponse, createErrorResponse, ErrorCodes } from '@/lib/apiResponse';

/**
 * Hook para gestionar y reiniciar datos de prueba del sistema
 */
export function useDataManagement() {
  const [loading, setLoading] = useState(false);

  /**
   * Reinicia todos los datos a su estado inicial
   */
  const resetAllData = async () => {
    setLoading(true);
    try {
      // Limpiar datos existentes
      localStorage.removeItem('simulated_products');
      localStorage.removeItem('customer_orders');
      localStorage.removeItem('customer_lockers');
      localStorage.removeItem('shopping_cart');
      localStorage.removeItem('app_initialized');

      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 500));

      // Re-inicializar con datos predeterminados
      initializeDefaultData();

      return createSuccessResponse(null, 'Datos reiniciados exitosamente');
    } catch (error) {
      return createErrorResponse(
        'Error al reiniciar datos',
        ErrorCodes.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Error desconocido'
      );
    } finally {
      setLoading(false);
    }
  };

  /**
   * Obtiene estadísticas del sistema
   */
  const getSystemStats = () => {
    try {
      const products = JSON.parse(localStorage.getItem('simulated_products') || '[]');
      const orders = JSON.parse(localStorage.getItem('customer_orders') || '[]');
      const lockers = JSON.parse(localStorage.getItem('customer_lockers') || '[]');
      const cart = JSON.parse(localStorage.getItem('shopping_cart') || '[]');

      return createSuccessResponse({
        products: {
          total: products.length,
          byStore: {
            shein: products.filter((p: any) => p.store === 'shein').length,
            amazon: products.filter((p: any) => p.store === 'amazon').length,
            aliexpress: products.filter((p: any) => p.store === 'aliexpress').length
          }
        },
        orders: {
          total: orders.length,
          byStatus: orders.reduce((acc: any, order: Order) => {
            acc[order.status] = (acc[order.status] || 0) + 1;
            return acc;
          }, {})
        },
        lockers: {
          total: lockers.length,
          active: lockers.filter((l: any) => l.status === 'active').length
        },
        cart: {
          items: cart.length,
          totalValue: cart.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0)
        }
      });
    } catch (error) {
      return createErrorResponse(
        'Error al obtener estadísticas',
        ErrorCodes.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Error desconocido'
      );
    }
  };

  /**
   * Exporta todos los datos como JSON
   */
  const exportData = () => {
    try {
      const data = {
        products: JSON.parse(localStorage.getItem('simulated_products') || '[]'),
        orders: JSON.parse(localStorage.getItem('customer_orders') || '[]'),
        lockers: JSON.parse(localStorage.getItem('customer_lockers') || '[]'),
        cart: JSON.parse(localStorage.getItem('shopping_cart') || '[]'),
        exportedAt: new Date().toISOString()
      };

      return createSuccessResponse(data, 'Datos exportados exitosamente');
    } catch (error) {
      return createErrorResponse(
        'Error al exportar datos',
        ErrorCodes.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Error desconocido'
      );
    }
  };

  /**
   * Limpia solo un tipo específico de datos
   */
  const clearDataType = async (type: 'products' | 'orders' | 'lockers' | 'cart') => {
    setLoading(true);
    try {
      const storageKeys = {
        products: 'simulated_products',
        orders: 'customer_orders',
        lockers: 'customer_lockers',
        cart: 'shopping_cart'
      };

      localStorage.removeItem(storageKeys[type]);
      
      // Simular delay
      await new Promise(resolve => setTimeout(resolve, 300));

      return createSuccessResponse(null, `${type} limpiados exitosamente`);
    } catch (error) {
      return createErrorResponse(
        `Error al limpiar ${type}`,
        ErrorCodes.INTERNAL_ERROR,
        error instanceof Error ? error.message : 'Error desconocido'
      );
    } finally {
      setLoading(false);
    }
  };

  return {
    resetAllData,
    getSystemStats,
    exportData,
    clearDataType,
    loading
  };
}

/**
 * Inicializa datos predeterminados
 */
function initializeDefaultData() {
  // Inicializar productos del catálogo
  const allProducts: any[] = [];
  STORE_CATALOGS.forEach(catalog => {
    allProducts.push(...catalog.products);
  });
  localStorage.setItem('simulated_products', JSON.stringify(allProducts));

  // Inicializar órdenes de ejemplo con diferentes estados
  const sampleOrders: Order[] = [
    // Orden recién creada
    {
      id: 'ORD-1730000001-A1B2C3',
      productId: 'sh_001',
      customerId: 'cust_001',
      customerEmail: 'maria@ejemplo.com',
      status: 'created',
      trackingNumber: 'TR7300000001',
      trackingEvents: [],
      shippingAddress: {
        fullName: 'María González',
        phone: '+58 412 1234567',
        address: 'Av. Francisco de Miranda, Torre Europa, Piso 12',
        city: 'Caracas',
        state: 'Miranda',
        postalCode: '1060',
        country: 'Venezuela'
      },
      costBreakdown: calculateCostBreakdown(29.99, 0.5),
      revenueBreakdown: calculateRevenueBreakdown(calculateCostBreakdown(29.99, 0.5)),
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000).toISOString()
    },
    // Orden en proceso de compra
    {
      id: 'ORD-1730000002-D4E5F6',
      productId: 'am_001',
      customerId: 'cust_002',
      customerEmail: 'carlos@ejemplo.com',
      status: 'purchasing',
      trackingNumber: 'TR7300000002',
      trackingEvents: [],
      shippingAddress: {
        fullName: 'Carlos Rodríguez',
        phone: '+58 414 9876543',
        address: 'Calle Principal, Edificio Central',
        city: 'Valencia',
        state: 'Carabobo',
        postalCode: '2001',
        country: 'Venezuela'
      },
      costBreakdown: calculateCostBreakdown(89.99, 0.2),
      revenueBreakdown: calculateRevenueBreakdown(calculateCostBreakdown(89.99, 0.2)),
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000).toISOString()
    },
    // Orden en tránsito
    {
      id: 'ORD-1730000003-G7H8I9',
      productId: 'al_001',
      customerId: 'cust_003',
      customerEmail: 'ana@ejemplo.com',
      status: 'in_transit',
      trackingNumber: 'TR7300000003',
      trackingEvents: [],
      shippingAddress: {
        fullName: 'Ana Martínez',
        phone: '+58 424 5551234',
        address: 'Av. Bolívar Norte, Residencias El Parque',
        city: 'Maracaibo',
        state: 'Zulia',
        postalCode: '4001',
        country: 'Venezuela'
      },
      costBreakdown: calculateCostBreakdown(34.99, 0.8),
      revenueBreakdown: calculateRevenueBreakdown(calculateCostBreakdown(34.99, 0.8)),
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString()
    },
    // Orden en reparto
    {
      id: 'ORD-1730000004-J1K2L3',
      productId: 'sh_003',
      customerId: 'cust_004',
      customerEmail: 'luis@ejemplo.com',
      status: 'in_delivery',
      trackingNumber: 'TR7300000004',
      trackingEvents: [],
      shippingAddress: {
        fullName: 'Luis Pérez',
        phone: '+58 416 7778899',
        address: 'Urbanización Los Palos Grandes, Quinta Las Rosas',
        city: 'Caracas',
        state: 'Miranda',
        postalCode: '1062',
        country: 'Venezuela'
      },
      costBreakdown: calculateCostBreakdown(34.99, 0.4),
      revenueBreakdown: calculateRevenueBreakdown(calculateCostBreakdown(34.99, 0.4)),
      createdAt: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000).toISOString()
    },
    // Orden entregada
    {
      id: 'ORD-1730000005-M4N5O6',
      productId: 'am_003',
      customerId: 'cust_005',
      customerEmail: 'sofia@ejemplo.com',
      status: 'delivered',
      trackingNumber: 'TR7300000005',
      trackingEvents: [],
      shippingAddress: {
        fullName: 'Sofía Ramírez',
        phone: '+58 412 3334455',
        address: 'Av. Universidad, Edificio Santa Fe',
        city: 'Maracay',
        state: 'Aragua',
        postalCode: '2103',
        country: 'Venezuela'
      },
      costBreakdown: calculateCostBreakdown(139.99, 0.25),
      revenueBreakdown: calculateRevenueBreakdown(calculateCostBreakdown(139.99, 0.25)),
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  // Generar eventos de tracking
  sampleOrders.forEach(order => {
    order.trackingEvents = generateTrackingEvents(order);
  });

  localStorage.setItem('customer_orders', JSON.stringify(sampleOrders));

  // Inicializar casilleros de ejemplo
  const sampleLockers = [
    {
      id: 'lock_1730000001',
      lockerCode: 'VE123456',
      brazilianAddress: {
        street: 'Av. Paulista',
        number: '1578',
        complement: 'Casillero VE123456',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01310-100',
        country: 'Brasil'
      },
      customerEmail: 'maria@ejemplo.com',
      status: 'active' as const,
      packagesReceived: 5,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'lock_1730000002',
      lockerCode: 'VE789012',
      brazilianAddress: {
        street: 'Rua Oscar Freire',
        number: '842',
        complement: 'Casillero VE789012',
        city: 'São Paulo',
        state: 'SP',
        postalCode: '01310-100',
        country: 'Brasil'
      },
      customerEmail: 'carlos@ejemplo.com',
      status: 'active' as const,
      packagesReceived: 2,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'lock_1730000003',
      lockerCode: 'VE345678',
      brazilianAddress: {
        street: 'Av. Atlântica',
        number: '1500',
        complement: 'Casillero VE345678',
        city: 'Rio de Janeiro',
        state: 'RJ',
        postalCode: '22021-000',
        country: 'Brasil'
      },
      customerEmail: 'ana@ejemplo.com',
      status: 'active' as const,
      packagesReceived: 8,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];

  localStorage.setItem('customer_lockers', JSON.stringify(sampleLockers));
  localStorage.setItem('app_initialized', 'true');
}
