import type { Request, Response } from "express";
import {
  getDocumentVersion,
  listDocumentVersions,
  restoreDocumentVersion,
} from "@/services/document-version.service.js";
import { asyncHandler } from "@/utils/async-handler.js";
import { getAuthenticatedUser } from "@/utils/get-authenticated-user.js";
import { sendSuccess } from "@/utils/response.js";

export const listVersions = asyncHandler(async (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const result = await listDocumentVersions(String(req.params.id), user.sub);
  sendSuccess(res, "Versions retrieved successfully", result);
});

export const getVersion = asyncHandler(async (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const result = await getDocumentVersion(
    String(req.params.id),
    String(req.params.versionId),
    user.sub,
  );
  sendSuccess(res, "Version retrieved successfully", result);
});

export const restoreVersion = asyncHandler(async (req: Request, res: Response) => {
  const user = getAuthenticatedUser(req);
  const result = await restoreDocumentVersion(
    String(req.params.id),
    String(req.params.versionId),
    user.sub,
  );
  sendSuccess(res, "Version restored successfully", result);
});
