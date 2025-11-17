import { useEffect } from 'react';
import { Order, ProductData } from '@/types/business';
import { generateTrackingEvents } from '@/lib/orderSimulator';
import { STORE_CATALOGS } from '@/lib/storeCatalogs';
import { calculateCostBreakdown, calculateRevenueBreakdown } from '@/lib/costCalculator';

export const useInitialData = () => {
  useEffect(() => {
    // Verificar que existan todos los datos necesarios
    const hasOrders = localStorage.getItem('customer_orders');
    const hasProducts = localStorage.getItem('simulated_products');
    const hasLockers = localStorage.getItem('customer_lockers');
    const hasNotifications = localStorage.getItem('user_notifications');
    const hasPreAlerts = localStorage.getItem('package_prealerts');
    
    // Si falta alguno de los datos principales, reinicializar todo
    if (!hasOrders || !hasProducts || !hasLockers || !hasNotifications || !hasPreAlerts) {
      console.log('Inicializando datos de prueba...');
      initializeDefaultData();
    } else {
      // Verificar que los datos no estén vacíos o corruptos
      try {
        const orders = JSON.parse(hasOrders);
        const products = JSON.parse(hasProducts);
        const lockers = JSON.parse(hasLockers);
        
        // Si algún array está vacío, reinicializar
        if (orders.length === 0 || products.length === 0 || lockers.length === 0) {
          console.log('Datos vacíos detectados, reinicializando...');
          initializeDefaultData();
        }
      } catch (error) {
        console.error('Error al leer datos, reinicializando...', error);
        initializeDefaultData();
      }
    }
  }, []);
};

/**
 * Inicializa datos predeterminados del sistema
 */
function initializeDefaultData() {
  // Initialize with sample products from catalogs (ahora con más productos)
  const allProducts: ProductData[] = [];
  STORE_CATALOGS.forEach(catalog => {
    allProducts.push(...catalog.products);
  });
  localStorage.setItem('simulated_products', JSON.stringify(allProducts));

  // Initialize with complete sample orders with tracking - Múltiples escenarios
  const sampleOrders: Order[] = [
    // Escenario 1: Orden recién creada
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
    // Escenario 2: Orden en proceso de compra
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
    // Escenario 3: Orden en tránsito
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
    // Escenario 4: Orden en reparto
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
    // Escenario 5: Orden entregada
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

  // Generar eventos de tracking para cada orden
  sampleOrders.forEach(order => {
    order.trackingEvents = generateTrackingEvents(order);
  });

  localStorage.setItem('customer_orders', JSON.stringify(sampleOrders));

  // Initialize with sample lockers - Múltiples casilleros activos
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
  
  // Inicializar notificaciones de ejemplo
  const sampleNotifications = [
    {
      id: 'notif_1',
      type: 'order_status',
      title: 'Orden Entregada',
      message: 'Tu orden ORD-1730000005-M4N5O6 ha sido entregada exitosamente',
      orderId: 'ORD-1730000005-M4N5O6',
      status: 'delivered',
      read: false,
      createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif_2',
      type: 'order_status',
      title: 'Orden en Tránsito',
      message: 'Tu orden ORD-1730000003-G7H8I9 está en camino',
      orderId: 'ORD-1730000003-G7H8I9',
      status: 'in_transit',
      read: false,
      createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif_3',
      type: 'locker',
      title: 'Casillero Asignado',
      message: 'Tu casillero VE123456 ha sido creado exitosamente',
      lockerId: 'lock_1730000001',
      read: true,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  localStorage.setItem('user_notifications', JSON.stringify(sampleNotifications));

  // Inicializar pre-alertas de ejemplo
  const samplePreAlerts = [
    {
      id: 'prealert_1',
      lockerId: 'lock_1730000001',
      lockerCode: 'VE123456',
      customerEmail: 'maria@ejemplo.com',
      trackingNumber: 'BR123456789',
      carrier: 'correios',
      productDescription: 'Vestido floral azul, talla M - Pedido Shein',
      estimatedArrival: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'prealert_2',
      lockerId: 'lock_1730000002',
      lockerCode: 'VE789012',
      customerEmail: 'carlos@ejemplo.com',
      trackingNumber: 'BR987654321',
      carrier: 'fedex',
      productDescription: 'Smartwatch deportivo negro - Amazon',
      estimatedArrival: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      status: 'pending',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
    }
  ];
  localStorage.setItem('package_prealerts', JSON.stringify(samplePreAlerts));
  
  localStorage.setItem('app_initialized', 'true');
}
