import { useState } from 'react';
import { useLockerManagement } from '@/hooks/useLockerManagement';
import { DashboardLayout } from '@/components/DashboardLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Archive, Mail, MapPin, Package, Copy, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const Lockers = () => {
  const { lockers, isAssigning, assignLocker, registerPackage, deactivateLocker } = useLockerManagement();
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

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Gestión de Casilleros
          </h1>
          <p className="text-muted-foreground mt-1">
            Asigna y administra casilleros en Brasil
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
                    Asigna un casillero a un cliente para comenzar
                  </p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {lockers.map((locker) => (
                  <Card key={locker.id} className="border-primary/20">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-xl font-mono">
                            {locker.lockerCode}
                          </CardTitle>
                          <p className="text-sm text-muted-foreground mt-1 flex items-center gap-2">
                            <Mail className="h-3 w-3" />
                            {locker.customerEmail}
                          </p>
                        </div>
                        <Badge
                          variant={locker.status === 'active' ? 'default' : 'secondary'}
                        >
                          {locker.status === 'active' ? 'Activo' : 'Inactivo'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="bg-muted/30 p-4 rounded-lg space-y-2">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-2">
                            <MapPin className="h-4 w-4 text-primary mt-0.5" />
                            <div>
                              <p className="font-semibold text-sm">Dirección Brasileña</p>
                              <p className="text-sm text-muted-foreground">
                                {locker.brazilianAddress.street}, {locker.brazilianAddress.number}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {locker.brazilianAddress.complement}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {locker.brazilianAddress.city}, {locker.brazilianAddress.state}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {locker.brazilianAddress.postalCode}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {locker.brazilianAddress.country}
                              </p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleCopyAddress(locker)}
                          >
                            {copiedId === locker.id ? (
                              <Check className="h-4 w-4 text-green-500" />
                            ) : (
                              <Copy className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Package className="h-4 w-4 text-primary" />
                          <span className="text-sm">
                            Paquetes recibidos: <strong>{locker.packagesReceived}</strong>
                          </span>
                        </div>
                        <div className="flex gap-2">
                          {locker.status === 'active' && (
                            <>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => registerPackage(locker.id)}
                              >
                                Registrar Paquete
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  deactivateLocker(locker.id);
                                  toast({
                                    title: 'Casillero desactivado',
                                    description: 'El casillero ha sido desactivado',
                                  });
                                }}
                              >
                                Desactivar
                              </Button>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
};

export default Lockers;
