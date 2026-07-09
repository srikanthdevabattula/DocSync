import type { SaveStatus } from "@/types/editor";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

const statusConfig: Record<
  SaveStatus,
  { label: string; className: string; showSpinner?: boolean }
> = {
  saving: {
    label: "Saving...",
    className: "border-primary/20 bg-primary/5 text-primary",
    showSpinner: true,
  },
  saved: {
    label: "Saved",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  offline: {
    label: "Offline",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  },
};

type SaveIndicatorProps = {
  status: SaveStatus;
  lastSavedTime: string;
  className?: string;
};

export function SaveIndicator({ status, lastSavedTime, className }: SaveIndicatorProps) {
  const config = statusConfig[status];

  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Badge variant="outline" className={cn("rounded-full px-2.5 py-0.5", config.className)}>
        {config.showSpinner ? <Loader2 className="size-3 animate-spin" aria-hidden="true" /> : null}
        {config.label}
      </Badge>
      <span className="hidden text-xs text-muted-foreground sm:inline">
        Last saved {lastSavedTime}
      </span>
    </div>
  );
}
