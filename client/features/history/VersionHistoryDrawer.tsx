"use client";

import { useCallback, useEffect, useState } from "react";
import { Eye, History, Loader2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { NoVersionHistoryEmptyState } from "@/components/common/empty-states";
import { VersionHistorySkeleton } from "@/components/common/skeletons";
import { VersionPreviewDialog } from "@/features/history/VersionPreviewDialog";
import {
  listDocumentVersions,
  restoreDocumentVersion,
} from "@/services/version.service";
import type { DocumentVersion } from "@/types/editor";
import { mapVersions } from "@/utils/document-mappers";
import { isAuthError } from "@/utils/api-error";
import { showToast } from "@/utils/toast";

type VersionHistoryDrawerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  documentId: string;
  canRestore: boolean;
  onRestore: (data: { title: string; content: string; versionCount: number }) => void;
};

export function VersionHistoryDrawer({
  open,
  onOpenChange,
  documentId,
  canRestore,
  onRestore,
}: VersionHistoryDrawerProps) {
  const [versions, setVersions] = useState<DocumentVersion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [restoringId, setRestoringId] = useState<string | null>(null);
  const [previewVersion, setPreviewVersion] = useState<DocumentVersion | null>(null);

  const loadVersions = useCallback(async () => {
    setIsLoading(true);

    try {
      const response = await listDocumentVersions(documentId);
      setVersions(mapVersions(response));
    } catch (error) {
      if (!isAuthError(error)) {
        showToast.error(
          "Could not load versions",
          error instanceof Error ? error.message : "Please try again.",
        );
      }
    } finally {
      setIsLoading(false);
    }
  }, [documentId]);

  useEffect(() => {
    if (open) {
      void loadVersions();
    }
  }, [open, loadVersions]);

  const handleRestore = async (version: DocumentVersion) => {
    if (!canRestore) {
      showToast.error("Permission denied", "You do not have permission to restore versions.");
      return;
    }

    setRestoringId(version.id);

    try {
      const restored = await restoreDocumentVersion(documentId, version.id);
      const updatedVersions = await listDocumentVersions(documentId);
      setVersions(mapVersions(updatedVersions));
      onRestore({
        title: restored.title,
        content: restored.content,
        versionCount: updatedVersions.length,
      });
      showToast.success("Version restored", `Restored to version ${version.versionNumber}.`);
      onOpenChange(false);
    } catch (error) {
      showToast.error(
        "Could not restore version",
        error instanceof Error ? error.message : "Please try again.",
      );
    } finally {
      setRestoringId(null);
    }
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-full rounded-l-2xl sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <History className="size-5 text-primary" aria-hidden="true" />
              Version History
            </SheetTitle>
            <SheetDescription>
              Browse previous versions and restore or preview changes.
            </SheetDescription>
          </SheetHeader>

          {isLoading ? (
            <VersionHistorySkeleton />
          ) : versions.length === 0 ? (
            <div className="mt-8 px-2">
              <NoVersionHistoryEmptyState />
            </div>
          ) : (
            <ScrollArea className="mt-6 h-[calc(100vh-8rem)] pr-4">
              <p className="mb-4 rounded-xl border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-primary">
                The editor shows the current version. Older snapshots below can be previewed or
                restored.
              </p>

              <div className="relative space-y-0">
                <div className="absolute top-2 bottom-2 left-[11px] w-px bg-border" aria-hidden="true" />

                {versions.map((version) => (
                  <div key={version.id} className="relative flex gap-4 pb-6">
                    <span
                      className="relative z-10 mt-1.5 flex size-6 shrink-0 items-center justify-center rounded-full border border-primary/20 bg-primary/10 text-[10px] font-semibold text-primary"
                      aria-hidden="true"
                    >
                      {version.versionNumber}
                    </span>

                    <div className="min-w-0 flex-1 rounded-xl border border-border/80 bg-white p-4 shadow-sm dark:bg-card">
                      <div>
                        <p className="text-sm font-semibold text-foreground">
                          Version {version.versionNumber}
                        </p>
                        <p className="mt-1 text-xs text-muted-foreground">
                          {version.date} · {version.time}
                        </p>
                        <p className="mt-0.5 text-xs text-muted-foreground">
                          by {version.savedByName}
                        </p>
                      </div>

                      <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
                        {version.description}
                      </p>
                      <p className="mt-1 truncate text-xs font-medium text-foreground">
                        {version.title}
                      </p>

                      <div className="mt-4 flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => setPreviewVersion(version)}
                        >
                          <Eye className="size-3.5" aria-hidden="true" />
                          Preview
                        </Button>
                        {canRestore ? (
                          <Button
                            type="button"
                            variant="secondary"
                            size="sm"
                            className="rounded-lg"
                            disabled={restoringId === version.id}
                            onClick={() => void handleRestore(version)}
                          >
                            {restoringId === version.id ? (
                              <Loader2 className="size-3.5 animate-spin" aria-hidden="true" />
                            ) : (
                              <RotateCcw className="size-3.5" aria-hidden="true" />
                            )}
                            Restore
                          </Button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </SheetContent>
      </Sheet>

      <VersionPreviewDialog
        open={Boolean(previewVersion)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setPreviewVersion(null);
        }}
        version={previewVersion}
      />
    </>
  );
}
