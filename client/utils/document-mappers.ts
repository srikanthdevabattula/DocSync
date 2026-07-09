import type { Document } from "@/types/dashboard";
import type { Collaborator, EditorDocument } from "@/types/editor";
import type { DashboardDocumentDto, DocumentDto, DocumentVersionDto } from "@/types/document";
import type { DocumentVersion } from "@/types/editor";

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function formatRelativeTime(isoDate: string): string {
  const date = new Date(isoDate);
  const diffMs = Date.now() - date.getTime();
  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) return "Just now";
  if (diffMinutes < 60) return `${diffMinutes} minute${diffMinutes === 1 ? "" : "s"} ago`;

  const diffHours = Math.floor(diffMinutes / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours === 1 ? "" : "s"} ago`;

  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 7) return `${diffDays} day${diffDays === 1 ? "" : "s"} ago`;

  return date.toLocaleDateString();
}

export function mapCollaborators(dto: DocumentDto): Collaborator[] {
  return dto.collaborators.map((collaborator) => ({
    id: collaborator.id,
    userId: collaborator.userId,
    name: collaborator.name,
    email: collaborator.email,
    role: collaborator.role,
    initials: getInitials(collaborator.name),
  }));
}

export function mapVersion(dto: DocumentVersionDto): DocumentVersion {
  const createdAt = new Date(dto.createdAt);

  return {
    id: dto.id,
    versionNumber: dto.versionNumber,
    date: createdAt.toLocaleDateString(),
    time: createdAt.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    description: dto.description,
    title: dto.title,
    content: dto.content,
    savedByName: dto.savedByName,
  };
}

export function mapVersions(dtos: DocumentVersionDto[]): DocumentVersion[] {
  return dtos.map(mapVersion);
}

export function mapToEditorDocument(dto: DocumentDto): EditorDocument {
  return {
    id: dto.id,
    title: dto.title,
    owner: dto.owner.name,
    ownerEmail: dto.owner.email,
    createdDate: new Date(dto.createdAt).toLocaleDateString(),
    lastUpdated: formatRelativeTime(dto.updatedAt),
    lastSavedTime: formatRelativeTime(dto.updatedAt),
    lastSync: formatRelativeTime(dto.updatedAt),
    wordCount: 0,
    characterCount: dto.content.length,
    status: "saved",
    versionNumber: 1,
    connectionStatus: "online",
    autoSaveEnabled: true,
    content: dto.content,
    collaborators: mapCollaborators(dto),
    versions: [],
  };
}

export function mapToDashboardDocument(dto: DashboardDocumentDto): Document {
  return {
    id: dto.id,
    title: dto.title,
    description: dto.description,
    ownerName: dto.ownerName,
    lastUpdated: dto.lastUpdated,
    status: dto.status,
  };
}
