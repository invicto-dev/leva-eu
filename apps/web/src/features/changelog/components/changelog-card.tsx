import { Badge, Card, CardContent, CardHeader, CardTitle } from "@core/ui";
import { CheckCircle2, Rocket, Sparkles, Wrench, Calendar } from "lucide-react";

export type ChangelogType = "feat" | "fix" | "perf" | "refactor" | "chore";

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  description: string;
  type: ChangelogType;
  items: string[];
}

const typeMap: Record<
  ChangelogType,
  { label: string; icon: any; color: string; bg: string }
> = {
  feat: {
    label: "Novidade",
    icon: Rocket,
    color: "text-emerald-600",
    bg: "bg-emerald-500",
  },
  fix: {
    label: "Correção",
    icon: CheckCircle2,
    color: "text-rose-600",
    bg: "bg-rose-500",
  },
  perf: {
    label: "Melhoria",
    icon: Sparkles,
    color: "text-amber-600",
    bg: "bg-amber-500",
  },
  refactor: {
    label: "Interno",
    icon: Wrench,
    color: "text-slate-600",
    bg: "bg-slate-500",
  },
  chore: {
    label: "Estrutura",
    icon: Calendar,
    color: "text-blue-600",
    bg: "bg-blue-500",
  },
};

export function ChangelogCard({ entry }: { entry: ChangelogEntry }) {
  const config = typeMap[entry.type] || typeMap.chore;
  const Icon = config.icon;

  return (
    <Card className="relative overflow-hidden border-none shadow-sm transition-all hover:shadow-md bg-white group">
      <div className={`absolute top-0 left-0 h-full w-1 ${config.bg}`} />
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div
              className={`p-2 rounded-lg text-white ${config.bg} shadow-sm group-hover:scale-110 transition-transform`}
            >
              <Icon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-xl font-bold text-slate-800 tracking-tight">
                {entry.title}
              </CardTitle>
              <div className="flex items-center gap-2 mt-0.5">
                <Badge
                  variant="outline"
                  className="text-[10px] uppercase font-bold tracking-wider text-slate-400 border-slate-200"
                >
                  {entry.date}
                </Badge>
                <span
                  className={`text-[10px] font-bold uppercase tracking-widest ${config.color}`}
                >
                  {config.label}
                </span>
              </div>
            </div>
          </div>
          <Badge
            className={`${config.bg} border-none shadow-sm px-3 py-1 text-sm font-mono`}
          >
            v{entry.version}
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 pt-4">
        <p className="text-slate-600 leading-relaxed text-base font-medium">
          {entry.description}
        </p>

        <div className="pt-4 border-t border-slate-50">
          <h4 className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-3">
            <span className={`h-1.5 w-1.5 rounded-full ${config.bg}`} />
            Destaques da Atualização
          </h4>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {entry.items.map((item, index) => (
              <li
                key={index}
                className="flex gap-3 text-sm text-slate-500 items-start group/item"
              >
                <div
                  className={`mt-1.5 h-1 w-1 rounded-full shrink-0 ${config.bg} opacity-40 group-hover/item:opacity-100 transition-opacity`}
                />
                <span className="group-hover/item:text-slate-700 transition-colors">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
