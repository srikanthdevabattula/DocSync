import type { ConnectionStatus, SaveStatus } from "@/types/editor";
import { cn } from "@/lib/utils";
import { Cloud, CloudOff, Loader2 } from "lucide-react";

type SyncIndicatorProps = {
  connectionStatus: ConnectionStatus;
  saveStatus?: SaveStatus;
  className?: string;
};

export function SyncIndicator({
  connectionStatus,
  saveStatus = "saved",
  className,
}: SyncIndicatorProps) {
  const isOnline = connectionStatus === "online";
  const isSyncing = saveStatus === "saving";

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium",
        isOnline
          ? "text-emerald-700 dark:text-emerald-300"
          : "text-amber-700 dark:text-amber-300",
        className,
      )}
      title={isOnline ? "Connected" : "Offline"}
    >
      {isSyncing ? (
        <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
      ) : isOnline ? (
        <Cloud className="size-3.5" aria-hidden="true" />
      ) : (
        <CloudOff className="size-3.5" aria-hidden="true" />
      )}
      <span className="hidden sm:inline">{isSyncing ? "Syncing" : isOnline ? "Synced" : "Offline"}</span>
    </div>
  );
}
