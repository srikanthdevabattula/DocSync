import type { Request, Response } from "express";
import {
  getDocumentVersion,
  listDocumentVersions,
  restoreDocumentVersion,
} from "@/services/document-version.service.js";
import { asyncHandler } from "@/utils/async-handler.js";
import { sendSuccess } from "@/utils/response.js";
import { AppError } from "@/utils/app-error.js";

export const listVersions = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication required", 401);
  const result = await listDocumentVersions(String(req.params.id), req.user.sub);
  sendSuccess(res, "Versions retrieved successfully", result);
});

export const getVersion = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication required", 401);
  const result = await getDocumentVersion(
    String(req.params.id),
    String(req.params.versionId),
    req.user.sub,
  );
  sendSuccess(res, "Version retrieved successfully", result);
});

export const restoreVersion = asyncHandler(async (req: Request, res: Response) => {
  if (!req.user) throw new AppError("Authentication required", 401);
  const result = await restoreDocumentVersion(
    String(req.params.id),
    String(req.params.versionId),
    req.user.sub,
  );
  sendSuccess(res, "Version restored successfully", result);
});
