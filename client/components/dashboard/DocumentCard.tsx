"use client";

import {
  CloudOff,
  Copy,
  FileText,
  Loader2,
  MoreHorizontal,
  Pencil,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import type { Document, DocumentStatus } from "@/types/dashboard";

const statusConfig: Record<
  DocumentStatus,
  { label: string; className: string; icon?: React.ReactNode }
> = {
  synced: {
    label: "Synced",
    className: "border-emerald-200 bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-300",
  },
  offline: {
    label: "Offline",
    className: "border-amber-200 bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-300",
    icon: <CloudOff className="size-3" aria-hidden="true" />,
  },
  syncing: {
    label: "Syncing",
    className: "border-primary/20 bg-primary/5 text-primary",
    icon: <Loader2 className="size-3 animate-spin" aria-hidden="true" />,
  },
};

type DocumentCardProps = {
  document: Document;
  onOpen?: (document: Document) => void;
  onRename?: (document: Document) => void;
  onDelete?: (document: Document) => void;
  onDuplicate?: (document: Document) => void;
};

export function DocumentCard({
  document,
  onOpen,
  onRename,
  onDelete,
  onDuplicate,
}: DocumentCardProps) {
  const status = statusConfig[document.status];

  const handleCardClick = () => {
    onOpen?.(document);
  };

  const handleCardKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      onOpen?.(document);
    }
  };

  return (
    <Card
      role="button"
      tabIndex={0}
      onClick={handleCardClick}
      onKeyDown={handleCardKeyDown}
      aria-label={`Open document ${document.title}`}
      className="group cursor-pointer rounded-xl border-border/80 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg hover:shadow-zinc-200/60 focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:outline-none dark:bg-card dark:hover:shadow-none"
    >
      <CardContent className="relative flex h-full flex-col p-5">
        <div className="mb-4 flex items-start justify-between gap-3">
          <span className="flex size-11 shrink-0 items-center justify-center rounded-xl bg-primary/8 text-primary">
            <FileText className="size-5" aria-hidden="true" />
          </span>

          <DropdownMenu>
            <DropdownMenuTrigger
              className="rounded-lg p-1.5 text-muted-foreground opacity-0 transition-all outline-none group-hover:opacity-100 hover:bg-muted hover:text-foreground focus-visible:opacity-100 focus-visible:ring-3 focus-visible:ring-ring/50"
              aria-label={`Actions for ${document.title}`}
              onClick={(event) => event.stopPropagation()}
              onKeyDown={(event) => event.stopPropagation()}
            >
              <MoreHorizontal className="size-4" aria-hidden="true" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-44 rounded-xl">
              <DropdownMenuItem
                className="rounded-lg"
                onClick={(event) => {
                  event.stopPropagation();
                  onOpen?.(document);
                }}
              >
                Open
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg"
                onClick={(event) => {
                  event.stopPropagation();
                  onRename?.(document);
                }}
              >
                <Pencil className="size-4" aria-hidden="true" />
                Rename
              </DropdownMenuItem>
              <DropdownMenuItem
                className="rounded-lg"
                onClick={(event) => {
                  event.stopPropagation();
                  onDuplicate?.(document);
                }}
              >
                <Copy className="size-4" aria-hidden="true" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                variant="destructive"
                className="rounded-lg"
                onClick={(event) => {
                  event.stopPropagation();
                  onDelete?.(document);
                }}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <div className="flex flex-1 flex-col">
          <h3 className="line-clamp-1 text-base font-semibold tracking-tight text-foreground">
            {document.title}
          </h3>
          <p className="mt-2 line-clamp-2 min-h-10 text-sm leading-relaxed text-muted-foreground">
            {document.description}
          </p>
        </div>

        <div className="mt-5 flex items-end justify-between gap-3 border-t border-border/60 pt-4">
          <div className="min-w-0">
            <p className="truncate text-xs font-medium text-foreground">{document.ownerName}</p>
            <p className="mt-0.5 text-xs text-muted-foreground">Updated {document.lastUpdated}</p>
          </div>

          <Badge
            variant="outline"
            className={cn("shrink-0 rounded-full border px-2.5 py-0.5", status.className)}
          >
            {status.icon}
            {status.label}
          </Badge>
        </div>
      </CardContent>
    </Card>
  );
}
