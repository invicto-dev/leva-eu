import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@leva-eu/ui';
import { Input } from '@leva-eu/ui';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@leva-eu/ui';
import { Label } from '@leva-eu/ui';
import { Car, Lock, Phone } from 'lucide-react';
import api from '../services/api';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', { email, password });
      const { access_token, user } = response.data.data;

      if (!user) {
        throw new Error('Falha na autenticação: Dados do usuário não recebidos.');
      }

      if (user.role !== 'DRIVER' && user.role !== 'ADMIN') {
        throw new Error('Acesso restrito a motoristas.');
      }

      localStorage.setItem('@LevaEu:token', access_token);
      localStorage.setItem('@LevaEu:user', JSON.stringify(user));

      navigate('/home');
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Erro ao realizar login.';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-svh flex items-center justify-center bg-muted/30 p-4">
      <Card className="w-full max-w-md border-none shadow-xl">
        <CardHeader className="space-y-1 text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-primary rounded-2xl shadow-lg shadow-primary/20">
              <Car className="w-10 h-10 text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Leva Eu</CardTitle>
          <CardDescription className="text-lg">
            Área do Motorista
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 bg-destructive/10 border border-destructive/20 text-destructive text-sm rounded-lg text-center">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">E-mail ou Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="text"
                  placeholder="motorista@exemplo.com"
                  className="pl-10 h-12 text-lg"
                  value={email}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Senha</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  className="pl-10 h-12 text-lg"
                  value={password}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                  required
                />
              </div>
            </div>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full h-14 text-xl font-semibold rounded-xl transition-all hover:scale-[1.02] active:scale-[0.98]" 
              type="submit"
              disabled={loading}
            >
              {loading ? 'Entrando...' : 'Entrar no App'}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
