import { z } from "zod";

export const versionIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid document id"),
  versionId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid version id"),
});
