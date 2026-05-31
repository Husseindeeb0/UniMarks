import jwt from "jsonwebtoken";
import { Response } from "express";
import dotenv from "dotenv";
import { UserType } from "../types";

dotenv.config();

const generateToken = (user: UserType) => {
  const secret = process.env.ACCESS_SECRET_TOKEN;
  if (!secret) {
    throw new Error(
      "ACCESS_SECRET_TOKEN is not defined in environment variables",
    );
  }

  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    {
      expiresIn: "1h",
    },
  );
};

const generateRefreshToken = (user: UserType) => {
  const secret = process.env.REFRESH_SECRET_TOKEN;
  if (!secret) {
    throw new Error(
      "REFRESH_SECRET_TOKEN is not defined in environment variables",
    );
  }

  return jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    secret,
    { expiresIn: "7d" },
  );
};

const setTokenCookies = async (
  res: Response,
  accessToken: string,
  refreshToken: string,
): Promise<void> => {
  res.cookie("access_token", accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 1000,
  });

  res.cookie("refresh_token", refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

const verifyToken = (
  token: string,
  type: "access" | "refresh" = "access",
) => {
  try {
    const secret =
      type === "access"
        ? process.env.ACCESS_SECRET_TOKEN
        : process.env.REFRESH_SECRET_TOKEN;
    if (!secret) {
      throw new Error(
        "ACCESS_SECRET_TOKEN or REFRESH_SECRET_TOKEN is not defined in environment variables",
      );
    }
    return jwt.verify(token, secret);
  } catch (error) {
    console.error(`Token verification failed (${type}):`, error);
    return null;
  }
};

export { generateRefreshToken, generateToken, setTokenCookies, verifyToken }