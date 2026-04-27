import { useEffect, useState } from "react";
import {
  ChangelogCard,
  type ChangelogEntry,
} from "../components/changelog-card";
import changelogData from "../../../data/changelog.json";
import { History } from "lucide-react";

export function ChangelogPage() {
  const [entries, setEntries] = useState<ChangelogEntry[]>([]);

  useEffect(() => {
    // Filtrar entradas públicas e ordenar por data decrescente
    const publicEntries = (changelogData as any[])
      .filter((entry) => entry.isPublic)
      .sort((a, b) => {
        // Primeiro por data, depois por versão (strings semver seriam melhor comparadas com bibliotecas, mas aqui deve funcionar)
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        if (dateB !== dateA) return dateB - dateA;
        return b.version.localeCompare(a.version);
      });

    setEntries(publicEntries);
  }, []);

  return (
    <div className="max-w-4xl mx-auto space-y-12 py-4">
      {/* Header */}
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-core-blue/10 rounded-2xl text-core-blue mb-2">
          <History className="h-8 w-8" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl">
          Evolução do <span className="text-core-blue">Sistema</span>
        </h1>
      </div>

      {/* Timeline Section */}
      <div className="relative px-2">
        {/* Linha central da timeline (apenas desktop) */}
        <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-200 to-transparent hidden md:block transform -translate-x-1/2" />

        <div className="space-y-12 relative">
          {entries.map((entry, index) => (
            <div
              key={entry.version}
              className={`flex flex-col md:flex-row items-center gap-8 ${
                index % 2 === 0 ? "md:flex-row-reverse" : ""
              }`}
            >
              {/* Card Container */}
              <div className="w-full md:w-[calc(50%-2rem)]">
                <ChangelogCard entry={entry} />
              </div>

              {/* Timeline Node (apenas desktop) */}
              <div className="hidden md:flex absolute left-1/2 transform -translate-x-1/2 items-center justify-center">
                <div className="h-10 w-10 rounded-full border-4 border-slate-50 bg-core-blue flex items-center justify-center shadow-lg z-10">
                  <div className="h-2 w-2 rounded-full bg-white animate-pulse" />
                </div>
              </div>

              {/* Spacer para o outro lado */}
              <div className="hidden md:block w-[calc(50%-2rem)]" />
            </div>
          ))}
        </div>
      </div>

      {/* Empty State */}
      {entries.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <p className="text-slate-400 font-medium">
            Nenhum registro público encontrado.
          </p>
        </div>
      )}

      {/* Footer da Página */}
      <div className="pt-12 text-center border-t border-slate-100 mt-16"></div>
    </div>
  );
}
