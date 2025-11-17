import { useState } from 'react';
import { usePreAlerts } from '@/hooks/usePreAlerts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface PreAlertFormProps {
  lockerId: string;
  lockerCode: string;
  customerEmail: string;
  onSuccess?: () => void;
}

export const PreAlertForm = ({ lockerId, lockerCode, customerEmail, onSuccess }: PreAlertFormProps) => {
  const { createPreAlert, isCreating } = usePreAlerts();
  const { toast } = useToast();
  const [trackingNumber, setTrackingNumber] = useState('');
  const [carrier, setCarrier] = useState('');
  const [productDescription, setProductDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!trackingNumber.trim() || !carrier || !productDescription.trim()) {
      toast({
        title: 'Error',
        description: 'Por favor completa todos los campos',
        variant: 'destructive',
      });
      return;
    }

    try {
      await createPreAlert(
        lockerId,
        lockerCode,
        customerEmail,
        trackingNumber,
        carrier,
        productDescription
      );

      toast({
        title: '¡Pre-alerta creada!',
        description: 'Te notificaremos cuando tu paquete llegue al casillero',
      });

      // Limpiar formulario
      setTrackingNumber('');
      setCarrier('');
      setProductDescription('');
      
      if (onSuccess) onSuccess();
    } catch (error) {
      toast({
        title: 'Error',
        description: 'No se pudo crear la pre-alerta',
        variant: 'destructive',
      });
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="h-5 w-5 text-primary" />
          Crear Pre-Alerta
        </CardTitle>
        <CardDescription>
          Notifícanos que un paquete está en camino a tu casillero {lockerCode}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="tracking">Número de Rastreo</Label>
            <Input
              id="tracking"
              placeholder="Ej: BR123456789"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              disabled={isCreating}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrier">Empresa de Envío</Label>
            <Select value={carrier} onValueChange={setCarrier} disabled={isCreating}>
              <SelectTrigger id="carrier">
                <SelectValue placeholder="Selecciona la empresa" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="correios">Correios (Brasil)</SelectItem>
                <SelectItem value="fedex">FedEx</SelectItem>
                <SelectItem value="dhl">DHL</SelectItem>
                <SelectItem value="ups">UPS</SelectItem>
                <SelectItem value="other">Otra</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Descripción del Producto</Label>
            <Textarea
              id="description"
              placeholder="Ej: Vestido azul, talla M - Pedido de Shein"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              disabled={isCreating}
              rows={3}
            />
          </div>

          <Button type="submit" disabled={isCreating} className="w-full">
            {isCreating ? 'Creando...' : 'Crear Pre-Alerta'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
