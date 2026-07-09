import { FileStack, Search, Share2, History, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateBaseProps = {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

function EmptyStateBase({
  icon,
  title,
  subtitle,
  actionLabel,
  onAction,
  className,
}: EmptyStateBaseProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-white px-6 py-16 text-center shadow-sm dark:bg-card",
        className,
      )}
    >
      <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
        {icon}
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">{title}</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">{subtitle}</p>
      {actionLabel && onAction ? (
        <Button
          type="button"
          onClick={onAction}
          className="mt-8 h-10 rounded-xl px-5 shadow-sm shadow-primary/15"
        >
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}

export function NoDocumentsEmptyState({
  onCreateDocument,
  className,
}: {
  onCreateDocument?: () => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center rounded-2xl border border-dashed border-border/80 bg-white px-6 py-16 text-center shadow-sm dark:bg-card",
        className,
      )}
    >
      <div className="mb-6 flex size-20 items-center justify-center rounded-2xl bg-muted/60 text-muted-foreground">
        <FileStack className="size-10" aria-hidden="true" />
      </div>
      <h3 className="text-lg font-semibold tracking-tight text-foreground">No documents yet</h3>
      <p className="mt-2 max-w-sm text-sm leading-relaxed text-muted-foreground">
        Create your first document to start collaborating.
      </p>
      {onCreateDocument ? (
        <Button
          type="button"
          onClick={onCreateDocument}
          className="mt-8 h-10 rounded-xl px-5 shadow-sm shadow-primary/15"
        >
          <Plus className="size-4" aria-hidden="true" />
          Create New Document
        </Button>
      ) : null}
    </div>
  );
}

export function SearchEmptyState({
  query,
  className,
}: {
  query?: string;
  className?: string;
}) {
  return (
    <EmptyStateBase
      icon={<Search className="size-10" aria-hidden="true" />}
      title="No results found"
      subtitle={
        query
          ? `No documents match "${query}". Try a different search term.`
          : "No documents match your search. Try a different search term."
      }
      className={className}
    />
  );
}

export function NoSharedDocumentsEmptyState({ className }: { className?: string }) {
  return (
    <EmptyStateBase
      icon={<Share2 className="size-10" aria-hidden="true" />}
      title="No shared documents"
      subtitle="Documents shared with you will appear here."
      className={className}
    />
  );
}

export function NoVersionHistoryEmptyState({ className }: { className?: string }) {
  return (
    <EmptyStateBase
      icon={<History className="size-10" aria-hidden="true" />}
      title="No version history"
      subtitle="Document versions will appear here as you make changes."
      className={className}
    />
  );
}

// Backward-compatible export
export function EmptyState({
  onCreateDocument,
  className,
}: {
  onCreateDocument?: () => void;
  className?: string;
}) {
  return <NoDocumentsEmptyState onCreateDocument={onCreateDocument} className={className} />;
}
