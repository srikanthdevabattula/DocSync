import type { Request, Response } from "express";
import {
  createDocument,
  getDocumentById,
  listDocuments,
  removeCollaborator,
  shareDocument,
  updateCollaboratorRole,
  updateDocument,
} from "@/services/document.service.js";
import { asyncHandler } from "@/utils/async-handler.js";
import { sendSuccess } from "@/utils/response.js";
import { AppError } from "@/utils/app-error.js";

export const create = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication required", 401);
  const result = await createDocument(req.user.sub, req.body);
  sendSuccess(res, "Document created successfully", result, 201);
});

export const list = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication required", 401);
  const result = await listDocuments(req.user.sub);
  sendSuccess(res, "Documents retrieved successfully", result);
});

export const getById = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication required", 401);
  const result = await getDocumentById(String(req.params.id), req.user.sub);
  sendSuccess(res, "Document retrieved successfully", result);
});

export const update = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication required", 401);
  const result = await updateDocument(String(req.params.id), req.user.sub, req.body);
  sendSuccess(res, "Document saved successfully", result);
});

export const share = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication required", 401);
  const result = await shareDocument(String(req.params.id), req.user.sub, req.body);
  sendSuccess(res, "Document shared successfully", result);
});

export const removeShare = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication required", 401);
  const result = await removeCollaborator(
    String(req.params.id),
    req.user.sub,
    String(req.params.userId),
  );
  sendSuccess(res, "Collaborator removed successfully", result);
});

export const updateShare = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication required", 401);
  const result = await updateCollaboratorRole(
    String(req.params.id),
    req.user.sub,
    String(req.params.userId),
    req.body.role,
  );
  sendSuccess(res, "Collaborator role updated successfully", result);
});
