"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { Editor } from "@tiptap/react";
import { updateDocument } from "@/services/document.service";
import type { ConnectionStatus, SaveStatus } from "@/types/editor";
import { clearDraft, getDraft, saveDraft } from "@/utils/document-draft-storage";
import { formatRelativeTime } from "@/utils/document-mappers";

const AUTO_SAVE_DELAY_MS = 1000;

type UseDocumentAutosaveOptions = {
  documentId: string;
  initialTitle: string;
  initialContent: string;
  canEdit: boolean;
  editor: Editor | null;
};

type UseDocumentAutosaveResult = {
  title: string;
  setTitle: (title: string) => void;
  saveStatus: SaveStatus;
  connectionStatus: ConnectionStatus;
  lastSavedTime: string;
  lastSync: string;
};

export function useDocumentAutosave({
  documentId,
  initialTitle,
  initialContent,
  canEdit,
  editor,
}: UseDocumentAutosaveOptions): UseDocumentAutosaveResult {
  const [title, setTitleState] = useState(initialTitle);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>(() =>
    getDraft(documentId)?.pendingSync ? "offline" : "saved",
  );
  const [connectionStatus, setConnectionStatus] = useState<ConnectionStatus>(() =>
    typeof navigator !== "undefined" && navigator.onLine ? "online" : "offline",
  );
  const [lastSavedTime, setLastSavedTime] = useState("Just now");
  const [lastSync, setLastSync] = useState("Just now");

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const latestContentRef = useRef(initialContent);
  const titleRef = useRef(initialTitle);
  const isSavingRef = useRef(false);

  useEffect(() => {
    setTitleState(initialTitle);
    titleRef.current = initialTitle;
    latestContentRef.current = initialContent;
  }, [documentId, initialTitle, initialContent]);

  const persistDraft = useCallback(
    (nextTitle: string, nextContent: string) => {
      saveDraft({
        documentId,
        title: nextTitle,
        content: nextContent,
        updatedAt: new Date().toISOString(),
        pendingSync: true,
      });
    },
    [documentId],
  );

  const performSave = useCallback(
    async (nextTitle: string, nextContent: string) => {
      if (!canEdit) return;

      titleRef.current = nextTitle;
      latestContentRef.current = nextContent;

      if (!navigator.onLine) {
        persistDraft(nextTitle, nextContent);
        setSaveStatus("offline");
        setConnectionStatus("offline");
        return;
      }

      if (isSavingRef.current) return;

      isSavingRef.current = true;
      setSaveStatus("saving");
      setConnectionStatus("online");

      try {
        const updated = await updateDocument(documentId, {
          title: nextTitle,
          content: nextContent,
        });
        clearDraft(documentId);
        setSaveStatus("saved");
        setConnectionStatus("online");
        setLastSavedTime("Just now");
        setLastSync(formatRelativeTime(updated.updatedAt));
      } catch {
        persistDraft(nextTitle, nextContent);
        setSaveStatus("offline");
      } finally {
        isSavingRef.current = false;
      }
    },
    [canEdit, documentId, persistDraft],
  );

  const scheduleSave = useCallback(
    (nextTitle: string, nextContent: string) => {
      if (!canEdit) return;

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }

      saveTimeoutRef.current = setTimeout(() => {
        void performSave(nextTitle, nextContent);
      }, AUTO_SAVE_DELAY_MS);
    },
    [canEdit, performSave],
  );

  const setTitle = useCallback(
    (nextTitle: string) => {
      setTitleState(nextTitle);
      titleRef.current = nextTitle;
      scheduleSave(nextTitle, editor?.getHTML() ?? latestContentRef.current);
    },
    [editor, scheduleSave],
  );

  useEffect(() => {
    if (!editor || !canEdit) return;

    const handleUpdate = () => {
      const content = editor.getHTML();
      latestContentRef.current = content;
      scheduleSave(titleRef.current, content);
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, canEdit, scheduleSave]);

  useEffect(() => {
    if (!canEdit) return;

    const draft = getDraft(documentId);
    if (draft?.pendingSync && navigator.onLine) {
      void performSave(draft.title, draft.content);
    }
  }, [canEdit, documentId, performSave]);

  useEffect(() => {
    const handleOnline = () => {
      setConnectionStatus("online");

      const draft = getDraft(documentId);
      if (draft?.pendingSync) {
        void performSave(draft.title, draft.content);
      }
    };

    const handleOffline = () => {
      setConnectionStatus("offline");
      setSaveStatus("offline");
    };

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);

      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
    };
  }, [documentId, performSave]);

  useEffect(() => {
    return () => {
      if (!canEdit || !saveTimeoutRef.current) return;

      clearTimeout(saveTimeoutRef.current);
      void performSave(titleRef.current, latestContentRef.current);
    };
  }, [canEdit, performSave]);

  return {
    title,
    setTitle,
    saveStatus,
    connectionStatus,
    lastSavedTime,
    lastSync,
  };
}
