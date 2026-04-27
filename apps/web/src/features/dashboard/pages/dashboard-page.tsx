export function DashboardPage() {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-xl shadow-sm border p-8 flex flex-col items-center justify-center text-center min-h-[400px]">
        <div className="w-16 h-16 bg-core-blue/10 rounded-full flex items-center justify-center mb-4">
          <span className="text-2xl font-bold text-core-blue">C</span>
        </div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-800">
          Bem-vindo ao Core Base
        </h1>
        <p className="text-muted-foreground max-w-lg mt-2">
          Este é o seu novo ponto de partida limpo e estruturado. Você pode
          começar a desenvolver seus componentes de negócio a partir daqui.
        </p>
      </div>
    </div>
  );
}
