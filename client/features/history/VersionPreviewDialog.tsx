"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { DocumentVersion } from "@/types/editor";

type VersionPreviewDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  version: DocumentVersion | null;
};

export function VersionPreviewDialog({ open, onOpenChange, version }: VersionPreviewDialogProps) {
  if (!version) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] gap-0 overflow-hidden rounded-2xl p-0 sm:max-w-2xl">
        <DialogHeader className="border-b border-border/80 px-5 py-4">
          <DialogTitle>Version {version.versionNumber}</DialogTitle>
          <DialogDescription>
            {version.date} · {version.time} · Saved by {version.savedByName}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[calc(85vh-6rem)] px-5 py-4">
          <p className="mb-4 text-sm font-medium text-foreground">{version.title}</p>
          <div
            className="prose prose-sm max-w-none dark:prose-invert tiptap-editor rounded-xl border border-border/80 bg-muted/20 p-4"
            dangerouslySetInnerHTML={{ __html: version.content || "<p><em>Empty document</em></p>" }}
          />
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
