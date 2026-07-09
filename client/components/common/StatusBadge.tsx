import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { DocumentStatus } from "@/types/dashboard";
import type { SaveStatus } from "@/types/editor";

type StatusBadgeProps = {
  status: DocumentStatus | SaveStatus;
  className?: string;
};

const config: Record<string, { label: string; className: string }> = {
  synced: {
    label: "Synced",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  saved: {
    label: "Saved",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  offline: {
    label: "Offline",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
  },
  syncing: {
    label: "Syncing",
    className: "border-primary/20 bg-primary/5 text-primary",
  },
  saving: {
    label: "Saving...",
    className: "border-primary/20 bg-primary/5 text-primary",
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const item = config[status];

  return (
    <Badge variant="outline" className={cn("rounded-full", item.className, className)}>
      {item.label}
    </Badge>
  );
}
