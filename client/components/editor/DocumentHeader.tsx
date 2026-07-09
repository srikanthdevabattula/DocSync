"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Clock3, FileText, Share2 } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SaveIndicator } from "@/components/editor/SaveIndicator";
import { SyncIndicator } from "@/components/editor/SyncIndicator";
import type { EditorDocument, CollaboratorRole } from "@/types/editor";
import { ROLE_BADGE_CLASS, ROLE_LABELS } from "@/utils/document-permissions";
import { cn } from "@/lib/utils";

type DocumentHeaderProps = {
  title: string;
  onTitleChange: (title: string) => void;
  canEditTitle?: boolean;
  userRole?: CollaboratorRole | null;
  document: Pick<EditorDocument, "status" | "lastSavedTime" | "connectionStatus" | "owner">;
  onShareClick: () => void;
  onVersionHistoryClick: () => void;
};

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function DocumentHeader({
  title,
  onTitleChange,
  canEditTitle = true,
  userRole,
  document,
  onShareClick,
  onVersionHistoryClick,
}: DocumentHeaderProps) {
  const [isEditingTitle, setIsEditingTitle] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-border/80 bg-white/95 backdrop-blur-md dark:bg-background/95">
      <div className="flex flex-col gap-3 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-3">
          <div className="flex min-w-0 flex-1 items-center gap-2 sm:gap-3">
            <Link
              href="/"
              aria-label="Back to documents"
              className={cn(
                buttonVariants({ variant: "ghost", size: "icon-sm" }),
                "shrink-0 rounded-xl",
              )}
            >
              <ArrowLeft className="size-4" aria-hidden="true" />
            </Link>

            <span className="hidden size-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary sm:flex">
              <FileText className="size-4" aria-hidden="true" />
            </span>

            {isEditingTitle && canEditTitle ? (
              <Input
                value={title}
                onChange={(event) => onTitleChange(event.target.value)}
                onBlur={() => setIsEditingTitle(false)}
                onKeyDown={(event) => {
                  if (event.key === "Enter") setIsEditingTitle(false);
                }}
                autoFocus
                className="h-9 max-w-md rounded-xl border-border/80 bg-white text-base font-semibold dark:bg-card"
                aria-label="Document title"
              />
            ) : (
              <button
                type="button"
                onClick={() => canEditTitle && setIsEditingTitle(true)}
                className={cn(
                  "truncate text-left text-base font-semibold tracking-tight text-foreground sm:text-lg",
                  canEditTitle && "transition-colors hover:text-primary",
                )}
              >
                {title || "Untitled Document"}
              </button>
            )}
          </div>

          <div className="hidden items-center gap-3 lg:flex">
            {userRole ? (
              <Badge
                variant="outline"
                className={cn("rounded-full", ROLE_BADGE_CLASS[userRole])}
              >
                {ROLE_LABELS[userRole]}
              </Badge>
            ) : null}
            <SaveIndicator status={document.status} lastSavedTime={document.lastSavedTime} />
          </div>

          <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="hidden rounded-xl sm:inline-flex"
              onClick={onShareClick}
            >
              <Share2 className="size-4" aria-hidden="true" />
              Share
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-xl sm:hidden"
              aria-label="Share document"
              onClick={onShareClick}
            >
              <Share2 className="size-4" aria-hidden="true" />
            </Button>

            <Button
              type="button"
              variant="outline"
              size="sm"
              className="hidden rounded-xl md:inline-flex"
              onClick={onVersionHistoryClick}
            >
              <Clock3 className="size-4" aria-hidden="true" />
              History
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              className="rounded-xl md:hidden"
              aria-label="Version history"
              onClick={onVersionHistoryClick}
            >
              <Clock3 className="size-4" aria-hidden="true" />
            </Button>

            <SyncIndicator
              connectionStatus={document.connectionStatus}
              saveStatus={document.status}
              className="hidden sm:flex"
            />

            <Avatar size="sm">
              <AvatarFallback className="bg-primary/10 text-xs font-medium text-primary">
                {getInitials(document.owner)}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>

        <div className="flex items-center justify-between lg:hidden">
          <div className="flex items-center gap-2">
            {userRole ? (
              <Badge
                variant="outline"
                className={cn("rounded-full", ROLE_BADGE_CLASS[userRole])}
              >
                {ROLE_LABELS[userRole]}
              </Badge>
            ) : null}
            <SaveIndicator status={document.status} lastSavedTime={document.lastSavedTime} />
          </div>
          <SyncIndicator
            connectionStatus={document.connectionStatus}
            saveStatus={document.status}
          />
        </div>
      </div>
    </header>
  );
}
