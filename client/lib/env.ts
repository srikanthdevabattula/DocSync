import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .url("NEXT_PUBLIC_API_URL must be a valid URL")
    .default("http://localhost:5000/api/v1"),
  NEXT_PUBLIC_APP_NAME: z
    .string()
    .trim()
    .min(1, "NEXT_PUBLIC_APP_NAME is required")
    .default("DocSync"),
});

const parsed = envSchema.safeParse({
  NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME,
});

if (!parsed.success) {
  console.error("Invalid client environment variables:", parsed.error.flatten().fieldErrors);
  throw new Error("Invalid client environment variables");
}

export const env = parsed.data;

export const appConfig = {
  name: env.NEXT_PUBLIC_APP_NAME,
  apiUrl: env.NEXT_PUBLIC_API_URL,
} as const;
