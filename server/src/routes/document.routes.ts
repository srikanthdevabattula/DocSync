import { Router } from "express";
import { create, getById, list, removeShare, share, update, updateShare } from "@/controllers/document.controller.js";
import { getVersion, listVersions, restoreVersion } from "@/controllers/document-version.controller.js";
import { authenticate } from "@/middlewares/auth.middleware.js";
import { validate } from "@/middlewares/validate.middleware.js";
import {
  createDocumentSchema,
  documentIdSchema,
  removeCollaboratorSchema,
  shareDocumentSchema,
  updateCollaboratorRoleSchema,
  updateDocumentSchema,
} from "@/validators/document.validator.js";
import { versionIdSchema } from "@/validators/document-version.validator.js";

const documentRouter = Router();

documentRouter.use(authenticate);

documentRouter.get("/", list);
documentRouter.post("/", validate(createDocumentSchema), create);
documentRouter.get("/:id", validate(documentIdSchema, "params"), getById);
documentRouter.patch(
  "/:id",
  validate(documentIdSchema, "params"),
  validate(updateDocumentSchema),
  update,
);
documentRouter.get("/:id/versions", validate(documentIdSchema, "params"), listVersions);
documentRouter.get(
  "/:id/versions/:versionId",
  validate(versionIdSchema, "params"),
  getVersion,
);
documentRouter.post(
  "/:id/versions/:versionId/restore",
  validate(versionIdSchema, "params"),
  restoreVersion,
);
documentRouter.post(
  "/:id/share",
  validate(documentIdSchema, "params"),
  validate(shareDocumentSchema),
  share,
);
documentRouter.patch(
  "/:id/share/:userId",
  validate(removeCollaboratorSchema, "params"),
  validate(updateCollaboratorRoleSchema),
  updateShare,
);
documentRouter.delete(
  "/:id/share/:userId",
  validate(removeCollaboratorSchema, "params"),
  removeShare,
);

export { documentRouter };
