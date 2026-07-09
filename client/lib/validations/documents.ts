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
    .or(z.literal("")),
});

export const renameDocumentSchema = z.object({
  title: z
    .string()
    .trim()
    .min(1, "Document title is required")
    .max(120, "Title cannot exceed 120 characters"),
});

export type CreateDocumentFormValues = z.infer<typeof createDocumentSchema>;
export type RenameDocumentFormValues = z.infer<typeof renameDocumentSchema>;
