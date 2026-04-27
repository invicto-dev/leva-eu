import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, CardContent, Badge } from '@leva-eu/ui';
import { Car, LogOut, MapPin, Navigation, User as UserIcon, RefreshCw } from 'lucide-react';
import api from '../services/api';

interface Ride {
  id: string;
  origin: string;
  destination: string;
  status: string;
  customer: {
    user: {
      name: string;
    };
  };
  price: string;
  createdAt: string;
}

export default function HomePage() {
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const user = JSON.parse(localStorage.getItem('@LevaEu:user') || '{}') as { name?: string };

  const fetchRides = useCallback(async () => {
    try {
      setLoading(true);
      const response = await api.get('/rides/pending');
      setRides(response.data.data);
    } catch (err) {
      console.error('Erro ao buscar corridas:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const init = async () => {
      try {
        const activeRes = await api.get('/rides/active');
        if (activeRes.data.data) {
          navigate('/active-ride');
          return;
        }
      } catch (err) {
        console.error('Erro ao verificar corrida ativa:', err);
      }
      
      await fetchRides();
    };
    init();
    const interval = setInterval(fetchRides, 10000);
    return () => clearInterval(interval);
  }, [navigate, fetchRides]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/');
  };

  const handleAcceptRide = async (rideId: string) => {
    try {
      await api.post(`/rides/${rideId}/accept`);
      navigate('/active-ride');
    } catch {
      alert('Erro ao aceitar corrida.');
    }
  };

  return (
    <div className="min-h-svh bg-muted/20 flex flex-col">
      {/* Header */}
      <header className="bg-background border-b px-6 py-4 flex items-center justify-between sticky top-0 z-10 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center text-primary-foreground font-bold shadow-md shadow-primary/20">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-muted-foreground leading-none mb-1">Bem-vindo,</p>
            <h1 className="text-lg font-bold tracking-tight">{user.name}</h1>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={handleLogout} className="rounded-full hover:bg-destructive/10 hover:text-destructive">
          <LogOut className="w-5 h-5" />
        </Button>
      </header>

      {/* Main Content */}
      <main className="flex-1 p-4 space-y-4 max-w-2xl mx-auto w-full">
        <div className="flex items-center justify-between px-2">
          <h2 className="text-xl font-bold flex items-center gap-2">
            Disponíveis agora
            {rides.length > 0 && (
              <span className="flex h-2 w-2 rounded-full bg-primary animate-pulse" />
            )}
          </h2>
          <Button variant="ghost" size="sm" onClick={fetchRides} disabled={loading} className="gap-2">
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>

        {rides.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center text-muted-foreground/50">
              <Car className="w-10 h-10" />
            </div>
            <div className="space-y-1">
              <p className="text-lg font-medium">Nenhuma corrida pendente</p>
              <p className="text-sm text-muted-foreground">Fique online para receber solicitações.</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {rides.map((ride) => (
              <Card key={ride.id} className="overflow-hidden border-none shadow-md hover:shadow-lg transition-shadow bg-card">
                <CardContent className="p-0">
                  <div className="p-5 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 bg-muted rounded-xl flex items-center justify-center text-muted-foreground">
                          <UserIcon className="w-6 h-6" />
                        </div>
                        <div>
                          <h3 className="font-bold text-lg leading-none mb-1">{ride.customer.user.name || 'Passageiro'}</h3>
                          <Badge variant="secondary" className="font-medium">
                            Novidade
                          </Badge>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground font-medium">
                        {new Date(ride.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </p>
                    </div>

                    <div className="space-y-3 relative before:absolute before:left-[11px] before:top-4 before:bottom-4 before:w-[2px] before:bg-muted">
                      <div className="flex items-start gap-4 relative">
                        <div className="w-6 h-6 rounded-full bg-green-500/20 border-4 border-background flex items-center justify-center z-10">
                          <MapPin className="w-3 h-3 text-green-600" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Origem</p>
                          <p className="text-sm font-medium leading-tight">{ride.origin}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start gap-4 relative">
                        <div className="w-6 h-6 rounded-full bg-primary/20 border-4 border-background flex items-center justify-center z-10">
                          <Navigation className="w-3 h-3 text-primary" />
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wider">Destino</p>
                          <p className="text-sm font-medium leading-tight">{ride.destination}</p>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t flex items-center justify-between">
                      <span className="text-sm text-muted-foreground font-medium">Ganhos estimado</span>
                      <span className="text-xl font-black text-primary">R$ {Number(ride.price).toFixed(2)}</span>
                    </div>
                  </div>

                  <div className="p-4 bg-muted/30 border-t flex gap-3">
                    <Button 
                      className="flex-1 h-12 rounded-xl font-bold bg-green-600 hover:bg-green-700 shadow-lg shadow-green-600/20"
                      onClick={() => handleAcceptRide(ride.id)}
                    >
                      Aceitar Corrida
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Tab Bar Simulação */}
      <nav className="bg-background border-t px-8 py-3 flex items-center justify-between sticky bottom-0 z-10">
        <div className="flex flex-col items-center gap-1 text-primary">
          <Navigation className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Corridas</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-muted-foreground opacity-50">
          <RefreshCw className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Histórico</span>
        </div>
        <div className="flex flex-col items-center gap-1 text-muted-foreground opacity-50">
          <UserIcon className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase">Perfil</span>
        </div>
      </nav>
    </div>
  );
}
