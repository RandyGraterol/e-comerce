import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ShoppingBag, Package, DollarSign, Clock, ArrowRight, Search, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="flex items-center justify-center gap-3 mb-6 animate-fade-in">
            <ShoppingBag className="h-14 w-14 text-primary" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary via-primary to-accent bg-clip-text text-transparent animate-fade-in">
            Plataforma de Tiendas Internacionales
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-8 animate-fade-in">
            Sistema de integración Brasil-Venezuela para envíos internacionales
          </p>
          <Link to="/simulator">
            <Button size="lg" className="text-lg px-8 py-6 animate-fade-in">
              Explorar Productos
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in border-primary/20">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <ShoppingBag className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Múltiples Tiendas</h3>
            <p className="text-muted-foreground text-sm">
              Integración con Shein, Amazon y AliExpress
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in border-primary/20">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Package className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Extracción Automática</h3>
            <p className="text-muted-foreground text-sm">
              Datos del producto extraídos de URL
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in border-primary/20">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Cálculo de Costos</h3>
            <p className="text-muted-foreground text-sm">
              Desglose automático de precios y envío
            </p>
          </Card>

          <Card className="p-6 hover:shadow-lg transition-all hover:-translate-y-1 animate-fade-in border-primary/20">
            <div className="rounded-full bg-primary/10 w-12 h-12 flex items-center justify-center mb-4">
              <Clock className="h-6 w-6 text-primary" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Tiempo Estimado</h3>
            <p className="text-muted-foreground text-sm">
              Cálculo de tiempos de envío internacional
            </p>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-16">
          <Link to="/search">
            <Card className="p-8 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-primary/20 h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
                  <Search className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Búsqueda en Catálogos</h3>
                  <p className="text-muted-foreground">Explora productos de múltiples tiendas</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Ir a Búsqueda
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </Link>

          <Link to="/tracking">
            <Card className="p-8 hover:shadow-lg transition-all hover:-translate-y-1 cursor-pointer border-primary/20 h-full">
              <div className="flex items-center gap-4 mb-4">
                <div className="rounded-full bg-primary/10 w-16 h-16 flex items-center justify-center">
                  <MapPin className="h-8 w-8 text-primary" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold">Rastreo de Pedidos</h3>
                  <p className="text-muted-foreground">Rastrea tu pedido en tiempo real</p>
                </div>
              </div>
              <Button variant="outline" className="w-full">
                Ir a Rastreo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Card>
          </Link>
        </div>

        {/* CTA Section */}
        <div className="text-center max-w-3xl mx-auto">
          <Card className="p-8 md:p-12 bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              ¿Listo para comenzar?
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Explora nuestro sistema y descubre cómo funcionan las integraciones con tiendas internacionales
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/demo">
                <Button size="lg" variant="default" className="text-lg px-8 py-6">
                  Ver Demo Completo
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link to="/simulator">
                <Button size="lg" variant="outline" className="text-lg px-8 py-6">
                  Comenzar Ahora
                </Button>
              </Link>
            </div>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t mt-16 py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Plataforma de Tiendas Internacionales. Sistema de integración Brasil-Venezuela.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
