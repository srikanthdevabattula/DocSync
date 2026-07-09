import type { CollaboratorRole } from "@/types/editor";

export type DocumentCollaboratorDto = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: CollaboratorRole;
};

export type DocumentOwnerDto = {
  id: string;
  name: string;
  email: string;
};

export type DocumentDto = {
  id: string;
  title: string;
  description: string;
  content: string;
  owner: DocumentOwnerDto;
  collaborators: DocumentCollaboratorDto[];
  createdAt: string;
  updatedAt: string;
};

export type DashboardDocumentDto = {
  id: string;
  title: string;
  description: string;
  ownerName: string;
  lastUpdated: string;
  status: "synced";
};

export type ShareDocumentPayload = {
  email: string;
  role: "editor" | "viewer";
};

export type CreateDocumentPayload = {
  title: string;
  description?: string;
};

export type UpdateDocumentPayload = {
  title?: string;
  content?: string;
};

export type DocumentVersionDto = {
  id: string;
  versionNumber: number;
  title: string;
  content: string;
  description: string;
  savedByName: string;
  createdAt: string;
};
