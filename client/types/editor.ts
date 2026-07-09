export type SaveStatus = "saving" | "saved" | "offline";

export type ConnectionStatus = "online" | "offline";

export type CollaboratorRole = "owner" | "editor" | "viewer";

export type Collaborator = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: CollaboratorRole;
  initials: string;
};

export type ShareableRole = "editor" | "viewer";

export type DocumentVersion = {
  id: string;
  versionNumber: number;
  date: string;
  time: string;
  description: string;
  title: string;
  content: string;
  savedByName: string;
};

export type EditorDocument = {
  id: string;
  title: string;
  owner: string;
  ownerEmail: string;
  createdDate: string;
  lastUpdated: string;
  lastSavedTime: string;
  lastSync: string;
  wordCount: number;
  characterCount: number;
  status: SaveStatus;
  versionNumber: number;
  connectionStatus: ConnectionStatus;
  autoSaveEnabled: boolean;
  content: string;
  collaborators: Collaborator[];
  versions: DocumentVersion[];
};
