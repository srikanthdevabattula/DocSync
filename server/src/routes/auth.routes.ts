import { Router } from "express";
import { login, register } from "@/controllers/auth.controller.js";
import { validate } from "@/middlewares/validate.middleware.js";
import { loginSchema, registerSchema } from "@/validators/auth.validator.js";

const authRouter = Router();

authRouter.post("/register", validate(registerSchema), register);
authRouter.post("/login", validate(loginSchema), login);

export { authRouter };
