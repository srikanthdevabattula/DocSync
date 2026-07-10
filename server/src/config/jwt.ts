import type { SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { env } from "@/config/env.js";
import type { JwtPayload, TokenPair } from "@/types/auth.js";

function toExpiresIn(value: string): SignOptions["expiresIn"] {
  return value as SignOptions["expiresIn"];
}

const accessTokenOptions: SignOptions = {
  expiresIn: toExpiresIn(env.JWT_ACCESS_EXPIRES_IN),
};

const refreshTokenOptions: SignOptions = {
  expiresIn: toExpiresIn(env.JWT_REFRESH_EXPIRES_IN),
};

export function generateAccessToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_ACCESS_SECRET, accessTokenOptions);
}

export function generateRefreshToken(payload: JwtPayload): string {
  return jwt.sign(payload, env.JWT_REFRESH_SECRET, refreshTokenOptions);
}

export function generateTokenPair(payload: JwtPayload): TokenPair {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  };
}

function assertJwtPayload(decoded: string | jwt.JwtPayload): JwtPayload {
  if (typeof decoded === "string" || !decoded.sub || typeof decoded.sub !== "string") {
    throw new Error("Invalid token payload");
  }

  if (typeof decoded.email !== "string") {
    throw new Error("Invalid token payload");
  }

  return {
    sub: decoded.sub,
    email: decoded.email,
  };
}

export function verifyAccessToken(token: string): JwtPayload {
  return assertJwtPayload(jwt.verify(token, env.JWT_ACCESS_SECRET));
}

export function verifyRefreshToken(token: string): JwtPayload {
  return assertJwtPayload(jwt.verify(token, env.JWT_REFRESH_SECRET));
}
