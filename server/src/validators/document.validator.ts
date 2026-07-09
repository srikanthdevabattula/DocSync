import { z } from "zod";

export const createDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Document title is required")
    .max(120, "Title cannot exceed 120 characters"),
  description: z
    .string()
    .trim()
    .max(500, "Description cannot exceed 500 characters")
    .optional()
    .default(""),
});

export const shareDocumentSchema = z.object({
  email: z.email("Please enter a valid email address"),
  role: z.enum(["editor", "viewer"], {
    error: "Role must be editor or viewer",
  }),
});

export const updateDocumentSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Document title is required")
      .max(120, "Title cannot exceed 120 characters")
      .optional(),
    content: z.string().optional(),
  })
  .refine((data) => data.title !== undefined || data.content !== undefined, {
    message: "At least one field must be provided",
  });

export const documentIdSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid document id"),
});

export const removeCollaboratorSchema = z.object({
  id: z.string().regex(/^[a-f\d]{24}$/i, "Invalid document id"),
  userId: z.string().regex(/^[a-f\d]{24}$/i, "Invalid user id"),
});

export const updateCollaboratorRoleSchema = z.object({
  role: z.enum(["editor", "viewer"], {
    error: "Role must be editor or viewer",
  }),
});

export type CreateDocumentInput = z.infer<typeof createDocumentSchema>;
export type ShareDocumentInput = z.infer<typeof shareDocumentSchema>;
export type UpdateDocumentInput = z.infer<typeof updateDocumentSchema>;
export type UpdateCollaboratorRoleInput = z.infer<typeof updateCollaboratorRoleSchema>;
