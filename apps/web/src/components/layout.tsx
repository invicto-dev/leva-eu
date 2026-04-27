import { Outlet, Link, useNavigate } from "react-router-dom";
import { Button } from "@core/ui/components/button";
import { Badge } from "@core/ui";
import { useAuth } from "../contexts/auth-context";
import { LogOut, User as UserIcon } from "lucide-react";
import pkg from "../../package.json";

export function Layout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans">
      {/* Institutional Header */}
      <header className="border-b bg-white shadow-sm sticky top-0 z-40">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <Link
            to="/"
            className="flex items-center gap-2 transition-opacity hover:opacity-80"
          >
            <div className="h-8 w-8 rounded-lg bg-core-blue flex items-center justify-center">
              <span className="text-white font-bold text-xs">C</span>
            </div>
            <span className="text-xl font-bold tracking-tight text-core-blue">
              Core <span className="text-core-gold font-heading">Base</span>
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-4">
            <Link to="/">
              <Button variant="ghost">Dashboard</Button>
            </Link>
            <Link to="/users">
              <Button variant="ghost">Usuários</Button>
            </Link>
          </nav>

          <div className="flex items-center gap-4 border-l pl-4 ml-4">
            <div className="hidden lg:flex flex-col items-end">
              <span className="text-sm font-semibold text-slate-700">
                {user?.name}
              </span>
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-bold">
                {user?.role}
              </span>
            </div>

            <div className="h-8 w-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500">
              <UserIcon className="h-4 w-4" />
            </div>

            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto py-8 px-4">
        <Outlet />
      </main>

      <footer className="border-t bg-white mt-auto py-6">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
          <div className="font-medium">
            © {new Date().getFullYear()} CORE. Todos os direitos reservados.
          </div>

          <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-slate-50 border border-slate-100 shadow-sm">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              Versão
            </span>
            <Badge
              variant="secondary"
              className="font-mono text-[11px] py-0 border-none bg-white shadow-sm"
            >
              v{pkg.version}
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
}
