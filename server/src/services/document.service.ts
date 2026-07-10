import { Types } from "mongoose";
import { DocumentModel, type IDocument } from "@/models/document.model.js";
import { User, type IUser } from "@/models/user.model.js";
import { AppError } from "@/utils/app-error.js";
import type { CreateDocumentInput, ShareDocumentInput, UpdateDocumentInput } from "@/validators/document.validator.js";
import {
  buildVersionDescription,
  createVersionSnapshot,
} from "@/services/document-version.service.js";

export type CollaboratorDto = {
  id: string;
  userId: string;
  name: string;
  email: string;
  role: "owner" | "editor" | "viewer";
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
  collaborators: CollaboratorDto[];
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

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

async function getOwnerDto(ownerId: Types.ObjectId): Promise<DocumentOwnerDto> {
  const owner = await User.findById(ownerId);

  if (!owner) {
    throw new AppError("Document owner not found", 404);
  }

  return {
    id: owner._id.toString(),
    name: owner.name,
    email: owner.email,
  };
}

function formatRelativeTime(date: Date): string {
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

export async function toDocumentDto(doc: IDocument): Promise<DocumentDto> {
  const owner = await getOwnerDto(doc.owner);

  const collaborators: CollaboratorDto[] = [
    {
      id: owner.id,
      userId: owner.id,
      name: owner.name,
      email: owner.email,
      role: "owner",
    },
    ...doc.collaborators.map((collaborator) => ({
      id: collaborator._id?.toString() ?? collaborator.userId.toString(),
      userId: collaborator.userId.toString(),
      name: collaborator.name,
      email: collaborator.email,
      role: collaborator.role,
    })),
  ];

  return {
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    content: doc.content,
    owner,
    collaborators,
    createdAt: doc.createdAt.toISOString(),
    updatedAt: doc.updatedAt.toISOString(),
  };
}

export async function assertDocumentAccess(doc: IDocument, userId: string): Promise<void> {
  const isOwner = doc.owner.toString() === userId;
  const isCollaborator = doc.collaborators.some((c) => c.userId.toString() === userId);

  if (!isOwner && !isCollaborator) {
    throw new AppError("You do not have access to this document", 403);
  }
}

async function assertCanManageSharing(doc: IDocument, userId: string): Promise<void> {
  if (doc.owner.toString() !== userId) {
    throw new AppError("Only the document owner can manage sharing", 403);
  }
}

export async function assertCanEdit(doc: IDocument, userId: string): Promise<void> {
  if (doc.owner.toString() === userId) return;

  const collaborator = doc.collaborators.find((entry) => entry.userId.toString() === userId);

  if (collaborator?.role === "editor") return;

  if (collaborator?.role === "viewer") {
    throw new AppError("Viewers cannot edit this document", 403);
  }

  throw new AppError("You do not have permission to edit this document", 403);
}

export async function createDocument(
  userId: string,
  input: CreateDocumentInput,
): Promise<DocumentDto> {
  const doc = await DocumentModel.create({
    title: input.title,
    description: input.description ?? "",
    content: "",
    owner: userId,
    collaborators: [],
  });

  return toDocumentDto(doc);
}

export async function getDocumentById(documentId: string, userId: string): Promise<DocumentDto> {
  const doc = await DocumentModel.findById(documentId);

  if (!doc) {
    throw new AppError("Document not found", 404);
  }

  await assertDocumentAccess(doc, userId);

  return toDocumentDto(doc);
}

export async function listDocuments(userId: string): Promise<DashboardDocumentDto[]> {
  const objectId = new Types.ObjectId(userId);

  type PopulatedOwner = Pick<IUser, "name">;

  const docs = await DocumentModel.find({
    $or: [{ owner: objectId }, { "collaborators.userId": objectId }],
  })
    .sort({ updatedAt: -1 })
    .populate<{ owner: PopulatedOwner }>("owner", "name");

  return docs.map((doc) => ({
    id: doc._id.toString(),
    title: doc.title,
    description: doc.description,
    ownerName: doc.owner.name ?? "Unknown",
    lastUpdated: formatRelativeTime(doc.updatedAt),
    status: "synced" as const,
  }));
}

export async function updateDocument(
  documentId: string,
  userId: string,
  input: UpdateDocumentInput,
): Promise<DocumentDto> {
  const doc = await DocumentModel.findById(documentId);

  if (!doc) {
    throw new AppError("Document not found", 404);
  }

  await assertDocumentAccess(doc, userId);
  await assertCanEdit(doc, userId);

  const titleChanged = input.title !== undefined && input.title !== doc.title;
  const contentChanged = input.content !== undefined && input.content !== doc.content;

  if (titleChanged || contentChanged) {
    await createVersionSnapshot(
      doc,
      userId,
      buildVersionDescription(titleChanged, contentChanged),
    );
  }

  if (input.title !== undefined) {
    doc.title = input.title;
  }

  if (input.content !== undefined) {
    doc.content = input.content;
  }

  await doc.save();

  return toDocumentDto(doc);
}

export async function shareDocument(
  documentId: string,
  userId: string,
  input: ShareDocumentInput,
): Promise<DocumentDto> {
  const doc = await DocumentModel.findById(documentId);

  if (!doc) {
    throw new AppError("Document not found", 404);
  }

  await assertCanManageSharing(doc, userId);

  const normalizedEmail = input.email.toLowerCase().trim();
  const invitee = await User.findOne({ email: normalizedEmail });

  if (!invitee) {
    throw new AppError("No account found with this email address", 404);
  }

  if (invitee._id.toString() === userId) {
    throw new AppError("You cannot share a document with yourself", 400);
  }

  if (doc.owner.toString() === invitee._id.toString()) {
    throw new AppError("This user is already the document owner", 400);
  }

  const alreadyShared = doc.collaborators.some(
    (collaborator) => collaborator.userId.toString() === invitee._id.toString(),
  );

  if (alreadyShared) {
    throw new AppError("This user already has access to the document", 409);
  }

  doc.collaborators.push({
    userId: invitee._id,
    email: invitee.email,
    name: invitee.name,
    role: input.role,
  });

  await doc.save();

  return toDocumentDto(doc);
}

export async function removeCollaborator(
  documentId: string,
  ownerUserId: string,
  collaboratorUserId: string,
): Promise<DocumentDto> {
  const doc = await DocumentModel.findById(documentId);

  if (!doc) {
    throw new AppError("Document not found", 404);
  }

  await assertCanManageSharing(doc, ownerUserId);

  if (collaboratorUserId === doc.owner.toString()) {
    throw new AppError("Cannot remove the document owner", 400);
  }

  const index = doc.collaborators.findIndex(
    (collaborator) => collaborator.userId.toString() === collaboratorUserId,
  );

  if (index === -1) {
    throw new AppError("Collaborator not found on this document", 404);
  }

  doc.collaborators.splice(index, 1);
  await doc.save();

  return toDocumentDto(doc);
}

export async function updateCollaboratorRole(
  documentId: string,
  ownerUserId: string,
  collaboratorUserId: string,
  role: "editor" | "viewer",
): Promise<DocumentDto> {
  const doc = await DocumentModel.findById(documentId);

  if (!doc) {
    throw new AppError("Document not found", 404);
  }

  await assertCanManageSharing(doc, ownerUserId);

  if (collaboratorUserId === doc.owner.toString()) {
    throw new AppError("Cannot change the document owner's role", 400);
  }

  const collaborator = doc.collaborators.find(
    (entry) => entry.userId.toString() === collaboratorUserId,
  );

  if (!collaborator) {
    throw new AppError("Collaborator not found on this document", 404);
  }

  collaborator.role = role;
  await doc.save();

  return toDocumentDto(doc);
}

export { getInitials };
