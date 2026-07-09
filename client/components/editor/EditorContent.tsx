"use client";

import type { Editor } from "@tiptap/react";
import { EditorContent as TiptapEditorContent } from "@tiptap/react";
import { cn } from "@/lib/utils";

type EditorContentProps = {
  editor: Editor | null;
  className?: string;
};

export function EditorContent({ editor, className }: EditorContentProps) {
  return (
    <div className={cn("flex-1 bg-zinc-50/50 dark:bg-background", className)}>
      <div className="mx-auto max-w-4xl px-4 py-6 sm:px-8 sm:py-8">
        <div className="min-h-[60vh] rounded-2xl border border-border/60 bg-white px-5 py-6 shadow-sm sm:px-8 sm:py-10 dark:bg-card">
          <TiptapEditorContent editor={editor} />
        </div>
      </div>
    </div>
  );
}
