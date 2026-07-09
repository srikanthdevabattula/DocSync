import type { DocumentDto } from "@/types/document";
import type { CollaboratorRole } from "@/types/editor";

export const ROLE_LABELS: Record<CollaboratorRole, string> = {
  owner: "Owner",
  editor: "Editor",
  viewer: "Viewer",
};

export const ROLE_DESCRIPTIONS: Record<CollaboratorRole, string> = {
  owner: "Full access — edit, share, and manage collaborators",
  editor: "Can view and edit document content",
  viewer: "Can view the document only (read-only)",
};

export const ROLE_BADGE_CLASS: Record<CollaboratorRole, string> = {
  owner: "border-primary/20 bg-primary/5 text-primary",
  editor:
    "border-indigo-200 bg-indigo-50 text-indigo-700 dark:border-indigo-800 dark:bg-indigo-950/40 dark:text-indigo-300",
  viewer: "border-border bg-muted text-muted-foreground",
};

const ROLE_SORT_ORDER: Record<CollaboratorRole, number> = {
  owner: 0,
  editor: 1,
  viewer: 2,
};

export function getUserDocumentRole(
  document: Pick<DocumentDto, "owner" | "collaborators">,
  userId: string,
): CollaboratorRole | null {
  if (document.owner.id === userId) return "owner";

  const collaborator = document.collaborators.find((entry) => entry.userId === userId);
  return collaborator?.role ?? null;
}

export function canEditWithRole(role: CollaboratorRole | null): boolean {
  return role === "owner" || role === "editor";
}

export function canManageSharingWithRole(role: CollaboratorRole | null): boolean {
  return role === "owner";
}

export function sortCollaboratorsByRole<T extends { role: CollaboratorRole }>(people: T[]): T[] {
  return [...people].sort((a, b) => ROLE_SORT_ORDER[a.role] - ROLE_SORT_ORDER[b.role]);
}
