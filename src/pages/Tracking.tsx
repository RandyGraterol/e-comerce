import { useState } from 'react';
import { useTracking } from '@/hooks/useTracking';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Package, Search, MapPin, Clock } from 'lucide-react';

const Tracking = () => {
  const [trackingInput, setTrackingInput] = useState('');
  const { isLoading, trackingInfo, trackOrder } = useTracking();

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      await trackOrder(trackingInput.trim());
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-muted',
      processing: 'bg-primary/20 text-primary',
      shipped: 'bg-accent/20 text-accent',
      in_transit: 'bg-primary/30 text-primary',
      delivered: 'bg-green-500/20 text-green-700 dark:text-green-400'
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Pendiente',
      processing: 'Procesando',
      shipped: 'Enviado',
      in_transit: 'En Tránsito',
      delivered: 'Entregado'
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Rastreo de Pedidos
          </h1>
          <p className="text-muted-foreground mt-1">
            Rastrea el estado de tus pedidos en tiempo real
          </p>
        </div>

        <Card className="p-6 mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="flex gap-4">
              <Input
                type="text"
                placeholder="Ingresa tu código de pedido o número de rastreo..."
                value={trackingInput}
                onChange={(e) => setTrackingInput(e.target.value)}
                className="flex-1"
              />
              <Button type="submit" disabled={isLoading}>
                <Search className="mr-2 h-4 w-4" />
                {isLoading ? 'Buscando...' : 'Rastrear'}
              </Button>
            </div>
          </form>
        </Card>

        {trackingInfo && (
          <div className="space-y-6">
            <Card className="p-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{trackingInfo.orderId}</h2>
                    <p className="text-muted-foreground">
                      Número de rastreo: {trackingInfo.trackingNumber}
                    </p>
                  </div>
                  <Badge className={getStatusColor(trackingInfo.currentStatus)}>
                    {getStatusText(trackingInfo.currentStatus)}
                  </Badge>
                </div>

                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Entrega estimada: {trackingInfo.estimatedDelivery}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-6">Historial de Rastreo</h3>
              <div className="space-y-6">
                {trackingInfo.events.map((event, index) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={`w-3 h-3 rounded-full ${
                        index === 0 ? 'bg-primary' : 'bg-muted'
                      }`} />
                      {index < trackingInfo.events.length - 1 && (
                        <div className="w-0.5 h-full bg-border flex-1 mt-2" />
                      )}
                    </div>
                    <div className="flex-1 pb-6">
                      <div className="flex items-start justify-between mb-1">
                        <h4 className="font-semibold">{event.status}</h4>
                        <span className="text-sm text-muted-foreground">
                          {new Date(event.timestamp).toLocaleDateString('es-ES', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                        <MapPin className="h-3 w-3" />
                        <span>{event.location}</span>
                      </div>
                      <p className="text-sm text-muted-foreground">{event.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {!trackingInfo && !isLoading && (
          <div className="text-center py-16 rounded-lg border-2 border-dashed border-muted-foreground/20">
            <Package className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-muted-foreground mb-2">
              Ingresa un código para rastrear
            </h3>
            <p className="text-muted-foreground">
              Podrás ver el estado actual y el historial de tu pedido
            </p>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Tracking;
