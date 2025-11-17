import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useDataManagement } from '@/hooks/useDataManagement';
import { useToast } from '@/hooks/use-toast';
import { 
  RefreshCcw, 
  Database, 
  Download, 
  Trash2,
  Package,
  ShoppingCart,
  Inbox,
  TrendingUp,
  FileJson
} from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';

const Admin = () => {
  const { resetAllData, getSystemStats, exportData, clearDataType, loading } = useDataManagement();
  const { toast } = useToast();
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    loadStats();
  }, []);

  const loadStats = () => {
    const response = getSystemStats();
    if (response.success) {
      setStats(response.data);
    }
  };

  const handleResetAll = async () => {
    const confirmed = window.confirm('¿Estás seguro de que quieres reiniciar todos los datos? Esta acción no se puede deshacer.');
    
    if (confirmed) {
      const response = await resetAllData();
      
      if (response.success) {
        toast({
          title: 'Éxito',
          description: 'Todos los datos han sido reiniciados',
        });
        loadStats();
        // Recargar la página para reflejar los cambios
        setTimeout(() => window.location.reload(), 1000);
      } else {
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive'
        });
      }
    }
  };

  const handleExportData = () => {
    const response = exportData();
    
    if (response.success) {
      const dataStr = JSON.stringify(response.data, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `casillero-data-${new Date().toISOString().split('T')[0]}.json`;
      link.click();
      
      toast({
        title: 'Exportación exitosa',
        description: 'Los datos han sido descargados',
      });
    } else {
      toast({
        title: 'Error',
        description: response.message,
        variant: 'destructive'
      });
    }
  };

  const handleClearData = async (type: 'products' | 'orders' | 'lockers' | 'cart') => {
    const typeLabels = {
      products: 'productos',
      orders: 'órdenes',
      lockers: 'casilleros',
      cart: 'carrito'
    };

    const confirmed = window.confirm(`¿Estás seguro de que quieres limpiar todos los ${typeLabels[type]}?`);
    
    if (confirmed) {
      const response = await clearDataType(type);
      
      if (response.success) {
        toast({
          title: 'Limpieza exitosa',
          description: `Se han limpiado los ${typeLabels[type]}`,
        });
        loadStats();
      } else {
        toast({
          title: 'Error',
          description: response.message,
          variant: 'destructive'
        });
      }
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Panel de Administración
          </h1>
          <p className="text-muted-foreground mt-1">
            Gestiona los datos de prueba y configuración del sistema
          </p>
        </div>

        <Alert>
          <Database className="h-4 w-4" />
          <AlertTitle>Sistema de Simulación</AlertTitle>
          <AlertDescription>
            Este panel te permite gestionar los datos de prueba almacenados en localStorage.
            Los cambios afectarán inmediatamente la experiencia de simulación.
          </AlertDescription>
        </Alert>

        {/* Estadísticas del Sistema */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Productos</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.products.total}</div>
                <div className="flex gap-2 mt-2">
                  <Badge variant="outline">Shein: {stats.products.byStore.shein}</Badge>
                  <Badge variant="outline">Amazon: {stats.products.byStore.amazon}</Badge>
                  <Badge variant="outline">AliExpress: {stats.products.byStore.aliexpress}</Badge>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Órdenes</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.orders.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {Object.keys(stats.orders.byStatus).length} estados diferentes
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Casilleros</CardTitle>
                <Inbox className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.lockers.total}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.lockers.active} activos
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Carrito</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.cart.items}</div>
                <p className="text-xs text-muted-foreground mt-1">
                  ${stats.cart.totalValue.toFixed(2)} en total
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Acciones Globales */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Globales</CardTitle>
            <CardDescription>
              Gestiona todos los datos del sistema de una vez
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button 
                onClick={handleResetAll}
                disabled={loading}
                variant="default"
                className="w-full"
              >
                <RefreshCcw className="mr-2 h-4 w-4" />
                Reiniciar Datos
              </Button>

              <Button 
                onClick={handleExportData}
                variant="outline"
                className="w-full"
              >
                <Download className="mr-2 h-4 w-4" />
                Exportar JSON
              </Button>

              <Button 
                onClick={() => loadStats()}
                variant="outline"
                className="w-full"
              >
                <FileJson className="mr-2 h-4 w-4" />
                Actualizar Stats
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Limpieza Selectiva */}
        <Card>
          <CardHeader>
            <CardTitle>Limpieza Selectiva</CardTitle>
            <CardDescription>
              Limpia categorías específicas de datos sin afectar el resto
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button 
                onClick={() => handleClearData('products')}
                disabled={loading}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpiar Productos
              </Button>

              <Button 
                onClick={() => handleClearData('orders')}
                disabled={loading}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpiar Órdenes
              </Button>

              <Button 
                onClick={() => handleClearData('lockers')}
                disabled={loading}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpiar Casilleros
              </Button>

              <Button 
                onClick={() => handleClearData('cart')}
                disabled={loading}
                variant="destructive"
                size="sm"
                className="w-full"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Limpiar Carrito
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Estados de Órdenes */}
        {stats && (
          <Card>
            <CardHeader>
              <CardTitle>Distribución de Estados de Órdenes</CardTitle>
              <CardDescription>
                Vista detallada de los estados actuales de las órdenes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {Object.entries(stats.orders.byStatus).map(([status, count]: [string, any]) => (
                  <div key={status} className="flex flex-col items-center p-3 border rounded-lg">
                    <Badge variant="secondary" className="mb-2">{status}</Badge>
                    <span className="text-2xl font-bold">{count}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Información del Sistema */}
        <Card>
          <CardHeader>
            <CardTitle>Información del Sistema</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Método de Almacenamiento:</span>
              <span className="font-medium">LocalStorage</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Modo:</span>
              <span className="font-medium">Simulación</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Tiendas Soportadas:</span>
              <span className="font-medium">Shein, Amazon, AliExpress</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Última Actualización:</span>
              <span className="font-medium">{new Date().toLocaleString('es-VE')}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default Admin;
