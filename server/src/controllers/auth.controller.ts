import type { Request, Response } from "express";
import { loginUser, registerUser } from "@/services/auth.service.js";
import { asyncHandler } from "@/utils/async-handler.js";
import { sendSuccess } from "@/utils/response.js";

export const register = asyncHandler(async (req: Request, res: Response) => {
  const result = await registerUser(req.body);
  sendSuccess(res, "Account created successfully", result, 201);
});

export const login = asyncHandler(async (req: Request, res: Response) => {
  const result = await loginUser(req.body);
  sendSuccess(res, "Signed in successfully", result);
});
