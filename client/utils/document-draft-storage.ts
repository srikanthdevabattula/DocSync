export type DocumentDraft = {
  documentId: string;
  title: string;
  content: string;
  updatedAt: string;
  pendingSync: boolean;
};

const DRAFT_PREFIX = "docsync_draft_";

function getDraftKey(documentId: string): string {
  return `${DRAFT_PREFIX}${documentId}`;
}

export function saveDraft(draft: DocumentDraft): void {
  if (typeof window === "undefined") return;

  localStorage.setItem(getDraftKey(draft.documentId), JSON.stringify(draft));
}

export function getDraft(documentId: string): DocumentDraft | null {
  if (typeof window === "undefined") return null;

  const raw = localStorage.getItem(getDraftKey(documentId));
  if (!raw) return null;

  try {
    return JSON.parse(raw) as DocumentDraft;
  } catch {
    return null;
  }
}

export function clearDraft(documentId: string): void {
  if (typeof window === "undefined") return;

  localStorage.removeItem(getDraftKey(documentId));
}

export function applyDraftIfNewer<T extends { title: string; content: string; updatedAt: string }>(
  document: T,
  documentId: string,
): T {
  const draft = getDraft(documentId);
  if (!draft) return document;

  const serverTime = new Date(document.updatedAt).getTime();
  const draftTime = new Date(draft.updatedAt).getTime();

  if (!draft.pendingSync && draftTime <= serverTime) {
    return document;
  }

  return {
    ...document,
    title: draft.title,
    content: draft.content,
  };
}
