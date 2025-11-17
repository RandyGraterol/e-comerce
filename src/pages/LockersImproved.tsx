import { useState } from 'react';
import { useLockerManagement } from '@/hooks/useLockerManagement';
import { usePreAlerts } from '@/hooks/usePreAlerts';
import { useNotifications } from '@/hooks/useNotifications';
import { DashboardLayout } from '@/components/DashboardLayout';
import { PreAlertForm } from '@/components/PreAlertForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Archive, Mail, MapPin, Package, Copy, Check, Bell } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const LockersImproved = () => {
  const { lockers, isAssigning, assignLocker, registerPackage, deactivateLocker } = useLockerManagement();
  const { preAlerts, updatePreAlertStatus } = usePreAlerts();
  const { addNotification } = useNotifications();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleAssignLocker = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim() || !email.includes('@')) {
      toast({
        title: 'Error',
        description: 'Por favor ingresa un email válido',
        variant: 'destructive',
      });
      return;
    }

    const locker = await assignLocker(email);
    
    addNotification(
      'locker',
      'Casillero Asignado',
      `Tu casillero ${locker.lockerCode} ha sido creado exitosamente`,
      { lockerId: locker.id }
    );

    toast({
      title: '¡Casillero asignado!',
      description: `Código: ${locker.lockerCode}`,
    });
    setEmail('');
  };

  const handleCopyAddress = (locker: any) => {
    const addressText = `${locker.brazilianAddress.street}, ${locker.brazilianAddress.number}
${locker.brazilianAddress.complement}
${locker.brazilianAddress.city}, ${locker.brazilianAddress.state}
${locker.brazilianAddress.postalCode}
${locker.brazilianAddress.country}`;

    navigator.clipboard.writeText(addressText);
    setCopiedId(locker.id);
    setTimeout(() => setCopiedId(null), 2000);
    
    toast({
      title: 'Dirección copiada',
      description: 'La dirección ha sido copiada al portapapeles',
    });
  };

  const handleMarkPackageReceived = (preAlertId: string, lockerCode: string) => {
    updatePreAlertStatus(preAlertId, 'received', new Date().toISOString());
    
    addNotification(
      'package',
      'Paquete Recibido',
      `Tu paquete ha llegado al casillero ${lockerCode}`,
      { lockerId: preAlertId }
    );

    toast({
      title: 'Paquete recibido',
      description: 'El paquete ha sido marcado como recibido',
    });
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-500/20 text-yellow-700 dark:text-yellow-400',
      received: 'bg-green-500/20 text-green-700 dark:text-green-400',
      forwarded: 'bg-blue-500/20 text-blue-700 dark:text-blue-400',
    };
    return colors[status as keyof typeof colors] || 'bg-muted';
  };

  const getStatusText = (status: string) => {
    const texts = {
      pending: 'Pendiente',
      received: 'Recibido',
      forwarded: 'Reenviado',
    };
    return texts[status as keyof typeof texts] || status;
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gestión de Casilleros y Pre-Alertas
          </h1>
          <p className="text-muted-foreground mt-1">
            Administra tus casilleros en Brasil y recibe notificaciones de paquetes
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-1 border-primary/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Archive className="h-5 w-5 text-primary" />
                Asignar Casillero
              </CardTitle>
              <CardDescription>
                Crea un nuevo casillero para un cliente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleAssignLocker} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="customer-email">Email del Cliente</Label>
                  <Input
                    id="customer-email"
                    type="email"
                    placeholder="cliente@ejemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    disabled={isAssigning}
                  />
                </div>
                <Button type="submit" disabled={isAssigning} className="w-full">
                  {isAssigning ? 'Asignando...' : 'Asignar Casillero'}
                </Button>
              </form>
            </CardContent>
          </Card>

          <div className="lg:col-span-2 space-y-6">
            {lockers.length === 0 ? (
              <Card>
                <CardContent className="py-16 text-center">
                  <Archive className="h-16 w-16 text-muted-foreground/40 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-muted-foreground mb-2">
                    No hay casilleros asignados
                  </h3>
                  <p className="text-muted-foreground">
                    Crea un casillero para comenzar a recibir paquetes
                  </p>
                </CardContent>
              </Card>
            ) : (
              lockers.map((locker) => {
                const lockerPreAlerts = preAlerts.filter(pa => pa.lockerId === locker.id);
                
                return (
                  <Card key={locker.id} className="border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-2xl">{locker.lockerCode}</CardTitle>
                          <div className="flex items-center gap-2 mt-2">
                            <Mail className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm text-muted-foreground">{locker.customerEmail}</span>
                          </div>
                        </div>
                        <Badge variant={locker.status === 'active' ? 'default' : 'secondary'}>
                          {locker.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-6">
                      <Tabs defaultValue="address" className="w-full">
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="address">
                            <MapPin className="h-4 w-4 mr-2" />
                            Dirección
                          </TabsTrigger>
                          <TabsTrigger value="prealerts">
                            <Bell className="h-4 w-4 mr-2" />
                            Pre-Alertas ({lockerPreAlerts.length})
                          </TabsTrigger>
                        </TabsList>

                        <TabsContent value="address" className="space-y-4">
                          <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                            <p className="font-medium text-sm">Dirección en Brasil:</p>
                            <div className="text-sm space-y-1">
                              <p>{locker.brazilianAddress.street}, {locker.brazilianAddress.number}</p>
                              <p>{locker.brazilianAddress.complement}</p>
                              <p>{locker.brazilianAddress.city}, {locker.brazilianAddress.state}</p>
                              <p>{locker.brazilianAddress.postalCode}</p>
                              <p className="font-medium">{locker.brazilianAddress.country}</p>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              variant="outline"
                              className="flex-1"
                              onClick={() => handleCopyAddress(locker)}
                            >
                              {copiedId === locker.id ? (
                                <>
                                  <Check className="mr-2 h-4 w-4" />
                                  Copiado
                                </>
                              ) : (
                                <>
                                  <Copy className="mr-2 h-4 w-4" />
                                  Copiar Dirección
                                </>
                              )}
                            </Button>
                          </div>

                          <div className="flex items-center gap-4 pt-4 border-t">
                            <div className="flex items-center gap-2">
                              <Package className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">
                                {locker.packagesReceived} paquetes recibidos
                              </span>
                            </div>
                          </div>
                        </TabsContent>

                        <TabsContent value="prealerts" className="space-y-4">
                          <PreAlertForm
                            lockerId={locker.id}
                            lockerCode={locker.lockerCode}
                            customerEmail={locker.customerEmail}
                          />

                          {lockerPreAlerts.length > 0 && (
                            <div className="space-y-3">
                              <h4 className="font-semibold text-sm">Pre-Alertas Activas:</h4>
                              {lockerPreAlerts.map((alert) => (
                                <Card key={alert.id} className="p-4">
                                  <div className="space-y-2">
                                    <div className="flex items-start justify-between">
                                      <div>
                                        <p className="font-medium text-sm">{alert.productDescription}</p>
                                        <p className="text-xs text-muted-foreground">
                                          Tracking: {alert.trackingNumber}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                          Transportista: {alert.carrier}
                                        </p>
                                      </div>
                                      <Badge className={getStatusColor(alert.status)}>
                                        {getStatusText(alert.status)}
                                      </Badge>
                                    </div>
                                    {alert.status === 'pending' && (
                                      <Button
                                        size="sm"
                                        onClick={() => handleMarkPackageReceived(alert.id, locker.lockerCode)}
                                        className="w-full"
                                      >
                                        Marcar como Recibido
                                      </Button>
                                    )}
                                  </div>
                                </Card>
                              ))}
                            </div>
                          )}

                          {lockerPreAlerts.length === 0 && (
                            <div className="text-center py-8 text-sm text-muted-foreground">
                              No hay pre-alertas para este casillero
                            </div>
                          )}
                        </TabsContent>
                      </Tabs>
                    </CardContent>
                  </Card>
                );
              })
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default LockersImproved;
