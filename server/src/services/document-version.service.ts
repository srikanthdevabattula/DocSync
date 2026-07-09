import { Types } from "mongoose";
import { DocumentModel, type IDocument } from "@/models/document.model.js";
import { DocumentVersionModel } from "@/models/document-version.model.js";
import { User } from "@/models/user.model.js";
import { AppError } from "@/utils/app-error.js";
import {
  assertCanEdit,
  assertDocumentAccess,
  type DocumentDto,
  toDocumentDto,
} from "@/services/document.service.js";

export type DocumentVersionDto = {
  id: string;
  versionNumber: number;
  title: string;
  content: string;
  description: string;
  savedByName: string;
  createdAt: string;
};

function buildVersionDescription(titleChanged: boolean, contentChanged: boolean): string {
  if (titleChanged && contentChanged) return "Title and content updated";
  if (titleChanged) return "Title updated";
  if (contentChanged) return "Content updated";
  return "Document updated";
}

async function toVersionDto(version: {
  _id: Types.ObjectId;
  versionNumber: number;
  title: string;
  content: string;
  description: string;
  savedBy: Types.ObjectId;
  createdAt: Date;
}): Promise<DocumentVersionDto> {
  const user = await User.findById(version.savedBy);

  return {
    id: version._id.toString(),
    versionNumber: version.versionNumber,
    title: version.title,
    content: version.content,
    description: version.description,
    savedByName: user?.name ?? "Unknown",
    createdAt: version.createdAt.toISOString(),
  };
}

export async function createVersionSnapshot(
  doc: IDocument,
  userId: string,
  description: string,
): Promise<void> {
  const versionNumber =
    (await DocumentVersionModel.countDocuments({ document: doc._id })) + 1;

  await DocumentVersionModel.create({
    document: doc._id,
    versionNumber,
    title: doc.title,
    content: doc.content,
    savedBy: userId,
    description,
  });
}

export async function listDocumentVersions(
  documentId: string,
  userId: string,
): Promise<DocumentVersionDto[]> {
  const doc = await DocumentModel.findById(documentId);

  if (!doc) {
    throw new AppError("Document not found", 404);
  }

  await assertDocumentAccess(doc, userId);

  const versions = await DocumentVersionModel.find({ document: documentId })
    .sort({ versionNumber: -1 })
    .lean();

  return Promise.all(versions.map((version) => toVersionDto(version)));
}

export async function getDocumentVersion(
  documentId: string,
  versionId: string,
  userId: string,
): Promise<DocumentVersionDto> {
  const doc = await DocumentModel.findById(documentId);

  if (!doc) {
    throw new AppError("Document not found", 404);
  }

  await assertDocumentAccess(doc, userId);

  const version = await DocumentVersionModel.findOne({
    _id: versionId,
    document: documentId,
  });

  if (!version) {
    throw new AppError("Version not found", 404);
  }

  return toVersionDto(version);
}

export async function restoreDocumentVersion(
  documentId: string,
  versionId: string,
  userId: string,
): Promise<DocumentDto> {
  const doc = await DocumentModel.findById(documentId);

  if (!doc) {
    throw new AppError("Document not found", 404);
  }

  await assertDocumentAccess(doc, userId);
  await assertCanEdit(doc, userId);

  const version = await DocumentVersionModel.findOne({
    _id: versionId,
    document: documentId,
  });

  if (!version) {
    throw new AppError("Version not found", 404);
  }

  const isAlreadyCurrent =
    doc.title === version.title && doc.content === version.content;

  if (!isAlreadyCurrent) {
    await createVersionSnapshot(doc, userId, "Before restore");
    doc.title = version.title;
    doc.content = version.content;
    await doc.save();
  }

  return toDocumentDto(doc);
}

export { buildVersionDescription };
