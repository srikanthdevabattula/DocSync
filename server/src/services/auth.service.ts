import { User, type IUser } from "@/models/user.model.js";
import { generateTokenPair } from "@/config/jwt.js";
import { AppError } from "@/utils/app-error.js";
import type { RegisterInput, LoginInput } from "@/validators/auth.validator.js";
import type { TokenPair } from "@/types/auth.js";

export type AuthUser = {
  id: string;
  name: string;
  email: string;
};

export type AuthResponse = {
  user: AuthUser;
  tokens: TokenPair;
};

function toAuthUser(user: IUser): AuthUser {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
  };
}

export async function registerUser(input: RegisterInput): Promise<AuthResponse> {
  const existingUser = await User.findOne({ email: input.email });

  if (existingUser) {
    throw new AppError("An account with this email already exists", 409);
  }

  const user = await User.create({
    name: input.name,
    email: input.email,
    password: input.password,
  });

  const tokens = generateTokenPair({
    sub: user._id.toString(),
    email: user.email,
  });

  return {
    user: toAuthUser(user),
    tokens,
  };
}

export async function loginUser(input: LoginInput): Promise<AuthResponse> {
  const user = await User.findOne({ email: input.email }).select("+password");

  if (!user) {
    throw new AppError("Invalid email or password", 401);
  }

  const isPasswordValid = await user.comparePassword(input.password);

  if (!isPasswordValid) {
    throw new AppError("Invalid email or password", 401);
  }

  const tokens = generateTokenPair({
    sub: user._id.toString(),
    email: user.email,
  });

  return {
    user: toAuthUser(user),
    tokens,
  };
}
