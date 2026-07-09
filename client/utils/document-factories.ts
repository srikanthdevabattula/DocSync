import type { DashboardStat, Document } from "@/types/dashboard";
import type { EditorDocument } from "@/types/editor";

const EMPTY_VALUE = "—";

export function computeDashboardStats(documents: Document[]): DashboardStat[] {
  return [
    { id: "total", title: "Total Documents", value: documents.length, icon: "documents" },
    {
      id: "shared",
      title: "Shared With Me",
      value: 0,
      icon: "shared",
    },
    {
      id: "offline",
      title: "Offline Documents",
      value: documents.filter((doc) => doc.status === "offline").length,
      icon: "offline",
    },
    {
      id: "recent",
      title: "Recently Updated",
      value: documents.length > 0 ? Math.min(documents.length, 4) : 0,
      icon: "recent",
    },
  ];
}

export function createDashboardDocument(
  input: Pick<Document, "id" | "title" | "description" | "ownerName">,
): Document {
  return {
    id: input.id,
    title: input.title,
    description: input.description,
    ownerName: input.ownerName,
    lastUpdated: "Just now",
    status: "synced",
  };
}

export function createEmptyEditorDocument(
  id: string,
  owner?: { name: string; email: string },
): EditorDocument {
  const ownerName = owner?.name ?? "You";
  const ownerEmail = owner?.email ?? "";

  return {
    id,
    title: "Untitled Document",
    owner: ownerName,
    ownerEmail,
    createdDate: EMPTY_VALUE,
    lastUpdated: EMPTY_VALUE,
    lastSavedTime: EMPTY_VALUE,
    lastSync: EMPTY_VALUE,
    wordCount: 0,
    characterCount: 0,
    status: "saved",
    versionNumber: 1,
    connectionStatus: "online",
    autoSaveEnabled: true,
    content: "",
    collaborators: owner
      ? [
          {
            id: "owner",
            userId: "owner",
            name: owner.name,
            email: owner.email,
            role: "owner",
            initials: getInitials(owner.name),
          },
        ]
      : [],
    versions: [],
  };
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}
