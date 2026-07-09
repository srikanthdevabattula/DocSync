"use client";

import { useEffect, useMemo, useState } from "react";
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import { Color } from "@tiptap/extension-color";
import { TextStyle } from "@tiptap/extension-text-style";
import Placeholder from "@tiptap/extension-placeholder";
import { DocumentHeader } from "@/components/editor/DocumentHeader";
import { DocumentInfo } from "@/components/editor/DocumentInfo";
import { EditorContent } from "@/components/editor/EditorContent";
import { EditorToolbar } from "@/components/editor/EditorToolbar";
import { StatusBar } from "@/components/editor/StatusBar";
import { ShareDocumentModal } from "@/features/sharing/ShareDocumentModal";
import { VersionHistoryDrawer } from "@/features/history/VersionHistoryDrawer";
import { useDocumentAutosave } from "@/hooks/use-document-autosave";
import { listDocumentVersions } from "@/services/version.service";
import type { CollaboratorRole, EditorDocument } from "@/types/editor";

type DocumentEditorProps = {
  document: EditorDocument;
  userRole: CollaboratorRole | null;
  currentUserId?: string;
  canEdit: boolean;
  canManageSharing: boolean;
  onCollaboratorsChange: (collaborators: EditorDocument["collaborators"]) => void;
};

export function DocumentEditor({
  document,
  userRole,
  currentUserId,
  canEdit,
  canManageSharing,
  onCollaboratorsChange,
}: DocumentEditorProps) {
  const [shareOpen, setShareOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [versionNumber, setVersionNumber] = useState(document.versionNumber);

  useEffect(() => {
    void listDocumentVersions(document.id)
      .then((versions) => setVersionNumber(versions.length + 1))
      .catch(() => undefined);
  }, [document.id]);

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
      }),
      Underline,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline underline-offset-2",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      Highlight.configure({ multicolor: true }),
      TextStyle,
      Color,
      Placeholder.configure({
        placeholder: "Start writing your document...",
      }),
    ],
    content: document.content,
    editable: canEdit,
    immediatelyRender: false,
    editorProps: {
      attributes: {
        class: "tiptap-editor focus:outline-none",
      },
    },
  });

  const { title, setTitle, saveStatus, connectionStatus, lastSavedTime, lastSync } =
    useDocumentAutosave({
      documentId: document.id,
      initialTitle: document.title,
      initialContent: document.content,
      canEdit,
      editor,
    });

  const liveDocument = useMemo<EditorDocument>(
    () => ({
      ...document,
      title,
      status: saveStatus,
      connectionStatus,
      lastSavedTime,
      lastSync,
      versionNumber,
    }),
    [document, title, saveStatus, connectionStatus, lastSavedTime, lastSync, versionNumber],
  );

  const handleRestore = (data: { title: string; content: string; versionCount: number }) => {
    setTitle(data.title);
    editor?.commands.setContent(data.content, { emitUpdate: false });
    setVersionNumber(data.versionCount + 1);
  };

  return (
    <div className="flex min-h-[calc(100dvh-5rem)] flex-col bg-zinc-50/80 dark:bg-background">
      <DocumentHeader
        title={title}
        onTitleChange={setTitle}
        canEditTitle={canEdit}
        userRole={userRole}
        document={{
          status: saveStatus,
          lastSavedTime,
          connectionStatus,
          owner: document.owner,
        }}
        onShareClick={() => setShareOpen(true)}
        onVersionHistoryClick={() => setHistoryOpen(true)}
      />

      <div className="flex flex-1 flex-col lg:flex-row">
        <div className="flex min-w-0 flex-1 flex-col">
          <EditorToolbar editor={editor} disabled={!canEdit} />
          <div className="flex-1 overflow-y-auto">
            <EditorContent editor={editor} />
          </div>
          <StatusBar
            connectionStatus={connectionStatus}
            autoSaveEnabled={canEdit}
            lastSync={lastSync}
          />
        </div>

        <div className="hidden border-t border-border/80 bg-white p-4 dark:bg-card md:block lg:hidden">
          <DocumentInfo document={liveDocument} userRole={userRole} />
        </div>

        <div className="hidden border-l border-border/80 bg-white p-4 dark:bg-card lg:block lg:p-6">
          <DocumentInfo document={liveDocument} userRole={userRole} className="sticky top-24" />
        </div>
      </div>

      <ShareDocumentModal
        open={shareOpen}
        onOpenChange={setShareOpen}
        documentId={document.id}
        collaborators={document.collaborators}
        currentUserId={currentUserId}
        canManageSharing={canManageSharing}
        onCollaboratorsChange={onCollaboratorsChange}
      />
      <VersionHistoryDrawer
        open={historyOpen}
        onOpenChange={setHistoryOpen}
        documentId={document.id}
        canRestore={canEdit}
        onRestore={handleRestore}
      />
    </div>
  );
}
