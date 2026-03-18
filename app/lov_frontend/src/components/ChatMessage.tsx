import { type ChatSource } from "@/lib/api";
import { SourceCards } from "./SourceCards";
import { cn } from "@/lib/utils";
import { Sparkles } from "lucide-react";

interface ChatMessageProps {
  role: "user" | "assistant";
  content: string;
  sources?: ChatSource[];
  mode?: "rag" | "web" | "direct";
}

export function ChatMessage({ role, content, sources, mode }: ChatMessageProps) {
  const isUser = role === "user";

  return (
    <div
      className={cn(
        "flex gap-3 animate-slide-up",
        isUser ? "justify-end" : "justify-start"
      )}
    >
      {!isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-primary/10 mt-0.5">
          <Sparkles className="h-3.5 w-3.5 text-primary" />
        </div>
      )}

      <div
        className={cn(
          "max-w-[75%] rounded-xl px-4 py-3",
          isUser
            ? "bg-primary text-primary-foreground"
            : "bg-surface border"
        )}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{content}</p>
        {!isUser && sources && mode && (
          <SourceCards sources={sources} mode={mode} />
        )}
      </div>

      {isUser && (
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-foreground/10 mt-0.5">
          <span className="text-xs font-semibold text-foreground">U</span>
        </div>
      )}
    </div>
  );
}
