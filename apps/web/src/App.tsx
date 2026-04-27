import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./features/auth/context/auth-context";
import { ProtectedRoute } from "./components/protected-route";
import { Layout } from "./components/layout";
import { LoginPage } from "./features/auth/pages/login-page";
import { DashboardPage } from "./features/dashboard/pages/dashboard-page";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<DashboardPage />} />
            <Route
              path="users"
              element={
                <div className="p-8 text-center text-muted-foreground bg-white rounded-xl shadow-sm border border-dashed border-slate-200">
                  <h2 className="text-xl font-bold text-slate-400">
                    Gestão de Usuários
                  </h2>
                  <p className="mt-2">
                    Módulo em desenvolvimento para a próxima fase.
                  </p>
                </div>
              }
            />
          </Route>

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
