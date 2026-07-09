import type { ConnectionStatus } from "@/types/editor";
import { cn } from "@/lib/utils";

type StatusBarProps = {
  connectionStatus: ConnectionStatus;
  autoSaveEnabled: boolean;
  lastSync: string;
  className?: string;
};

export function StatusBar({
  connectionStatus,
  autoSaveEnabled,
  lastSync,
  className,
}: StatusBarProps) {
  const isOnline = connectionStatus === "online";

  return (
    <footer
      className={cn(
        "flex flex-wrap items-center justify-between gap-3 border-t border-border/80 bg-white px-4 py-2 text-xs text-muted-foreground dark:bg-card sm:px-6",
        className,
      )}
    >
      <div className="flex items-center gap-4">
        <span className="inline-flex items-center gap-2">
          <span
            className={cn(
              "size-2 rounded-full",
              isOnline ? "bg-emerald-500" : "bg-amber-500",
            )}
            aria-hidden="true"
          />
          {isOnline ? "Online" : "Offline"}
        </span>
        <span>Auto Save: {autoSaveEnabled ? "On" : "Off"}</span>
      </div>

      <div className="flex items-center gap-4">
        <span>Last Sync: {lastSync}</span>
        <span>
          Connection:{" "}
          <span className={isOnline ? "text-emerald-700 dark:text-emerald-300" : "text-amber-700 dark:text-amber-300"}>
            {isOnline ? "Stable" : "Disconnected"}
          </span>
        </span>
      </div>
    </footer>
  );
}
