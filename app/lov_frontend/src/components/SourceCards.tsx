import { type ChatSource } from "@/lib/api";
import { FileText, Globe, ExternalLink } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface SourceCardsProps {
  sources: ChatSource[];
  mode: "rag" | "web" | "direct";
}

export function SourceCards({ sources, mode }: SourceCardsProps) {
  if (!sources.length) return null;

  return (
    <div className="mt-3">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-2">
        {mode === "web" ? "Web Sources" : "Document Sources"}
      </p>
      <div className="flex gap-2 overflow-x-auto scrollbar-thin pb-1">
        {sources.map((s, i) => (
          <Tooltip key={`${s.id}-${i}`}>
            <TooltipTrigger asChild>
              <a
                href={mode === "web" ? s.source : undefined}
                target={mode === "web" ? "_blank" : undefined}
                rel="noopener noreferrer"
                className="flex items-start gap-2 rounded-md border bg-surface p-2.5 min-w-[200px] max-w-[240px] shrink-0 hover:border-primary/30 transition-colors duration-150 cursor-pointer group"
              >
                <div className="rounded bg-muted p-1 shrink-0">
                  {mode === "web" ? (
                    <Globe className="h-3 w-3 text-primary" />
                  ) : (
                    <FileText className="h-3 w-3 text-primary" />
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium truncate group-hover:text-primary transition-colors">
                    {s.title || s.source}
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-2 mt-0.5">
                    {s.preview}
                  </p>
                </div>
                {mode === "web" && (
                  <ExternalLink className="h-3 w-3 text-muted-foreground shrink-0 mt-0.5" />
                )}
              </a>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-xs">
              <p className="text-xs">Score: {s.score.toFixed(2)}</p>
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    </div>
  );
}
