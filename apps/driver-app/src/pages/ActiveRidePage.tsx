import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Badge } from '@leva-eu/ui';
import { MapPin, Navigation, Phone, CheckCircle2, XCircle, ChevronLeft } from 'lucide-react';
import api from '../services/api';

interface ActiveRide {
  id: string;
  origin: string;
  destination: string;
  status: 'ACCEPTED' | 'IN_PROGRESS';
  price: string;
  customer: {
    user: {
      name: string;
      phone: string;
    };
  };
}

export default function ActiveRidePage() {
  const [ride, setRide] = useState<ActiveRide | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const init = async () => {
      try {
        const response = await api.get('/rides/active');
        if (!response.data.data) {
          navigate('/home');
          return;
        }
        setRide(response.data.data);
      } catch (err) {
        console.error('Erro ao buscar corrida ativa:', err);
        navigate('/home');
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [navigate]);

  const handleStartRide = async () => {
    if (!ride) return;
    try {
      await api.post(`/rides/${ride.id}/start`);
      // Recarregar dados após mudar status
      const response = await api.get('/rides/active');
      setRide(response.data.data);
    } catch {
      alert('Erro ao atualizar status.');
    }
  };

  const handleCompleteRide = async () => {
    if (!ride) return;
    try {
      await api.post(`/rides/${ride.id}/complete`);
      navigate('/home');
    } catch {
      alert('Erro ao finalizar corrida.');
    }
  };

  const handleCancelRide = async () => {
    if (!ride) return;
    try {
      await api.post(`/rides/${ride.id}/cancel-driver`);
      navigate('/home');
    } catch (err) {
      const error = err as { response?: { data?: { message?: string } } };
      const message = error.response?.data?.message || 'Erro ao cancelar.';
      alert(message);
    }
  };

  if (loading) return (
    <div className="min-h-svh flex items-center justify-center bg-background">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  if (!ride) return null;

  return (
    <div className="min-h-svh bg-muted/20 flex flex-col">
      {/* Header */}
      <header className="bg-background border-b px-6 py-4 flex items-center gap-4 sticky top-0 z-10">
        <Button variant="ghost" size="icon" onClick={() => navigate('/home')} className="rounded-full">
          <ChevronLeft className="w-6 h-6" />
        </Button>
        <h1 className="text-lg font-bold">Corrida em Andamento</h1>
      </header>

      <main className="flex-1 p-4 max-w-2xl mx-auto w-full space-y-6">
        {/* Status Badge */}
        <div className="flex justify-center">
          <Badge className={`px-4 py-1 text-sm font-bold uppercase tracking-widest ${
            ride.status === 'ACCEPTED' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-green-600 hover:bg-green-700'
          }`}>
            {ride.status === 'ACCEPTED' ? 'A caminho da origem' : 'Em percurso'}
          </Badge>
        </div>

        {/* Customer Card */}
        <Card className="border-none shadow-xl overflow-hidden bg-card">
          <CardContent className="p-0">
            <div className="p-6 bg-primary/5 border-b flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold text-xl shadow-lg shadow-primary/20">
                  {ride.customer.user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <h2 className="text-xl font-bold leading-none mb-1">{ride.customer.user.name}</h2>
                  <p className="text-sm text-muted-foreground">Cliente Leva Eu</p>
                </div>
              </div>
              <Button size="icon" className="rounded-full h-12 w-12 bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20">
                <a href={`tel:${ride.customer.user.phone}`}>
                  <Phone className="w-6 h-6" />
                </a>
              </Button>
            </div>

            <div className="p-6 space-y-6">
              {/* Route */}
              <div className="space-y-4 relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-muted">
                <div className="flex items-start gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-green-500/20 border-4 border-background flex items-center justify-center z-10">
                    <MapPin className="w-3 h-3 text-green-600" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Local de Embarque</p>
                    <p className="text-lg font-medium leading-tight">{ride.origin}</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-4 relative">
                  <div className="w-6 h-6 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center z-10">
                    <Navigation className="w-3 h-3 text-primary" />
                  </div>
                  <div className="space-y-0.5">
                    <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Destino Final</p>
                    <p className="text-lg font-medium leading-tight">{ride.destination}</p>
                  </div>
                </div>
              </div>

              {/* Price Info */}
              <div className="pt-4 border-t flex justify-between items-center">
                <span className="text-muted-foreground font-medium">Valor da Corrida</span>
                <span className="text-2xl font-black text-primary">R$ {Number(ride.price).toFixed(2)}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions Area */}
        <div className="space-y-3 pt-4">
          {ride.status === 'ACCEPTED' ? (
            <>
              <Button 
                className="w-full h-16 text-lg font-bold rounded-2xl bg-blue-600 hover:bg-blue-700 shadow-xl shadow-blue-600/20 flex gap-3"
                onClick={handleStartRide}
              >
                <CheckCircle2 className="w-6 h-6" />
                Cheguei no Local
              </Button>
              <Button 
                variant="outline"
                className="w-full h-14 font-bold rounded-2xl border-destructive/20 text-destructive hover:bg-destructive/10 flex gap-2"
                onClick={handleCancelRide}
              >
                <XCircle className="w-5 h-5" />
                Cancelar (Tolerância 2 min)
              </Button>
            </>
          ) : (
            <Button 
              className="w-full h-16 text-xl font-bold rounded-2xl bg-green-600 hover:bg-green-700 shadow-xl shadow-green-600/20 flex gap-3"
              onClick={handleCompleteRide}
            >
              <CheckCircle2 className="w-6 h-6" />
              Finalizar Corrida
            </Button>
          )}
        </div>
      </main>

      {/* Helper Footer */}
      <footer className="p-4 text-center">
        <p className="text-xs text-muted-foreground">
          Dica: Use o botão de telefone para contatar o passageiro se não o encontrar.
        </p>
      </footer>
    </div>
  );
}
