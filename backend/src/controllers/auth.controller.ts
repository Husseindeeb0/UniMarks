import { Request, Response } from "express";
import prisma from "../config/prisma";
import bcrypt from "bcrypt";
import { generateRefreshToken, generateToken, setTokenCookies } from "../utils";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(404).json({ message: "Invalid Credentials" });
    }

    const passwordMatch = await bcrypt.compareSync(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const accessToken = generateToken(user);
    const refreshToken = generateRefreshToken(user);

    setTokenCookies(res, accessToken, refreshToken);

    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    console.error("Error logging in:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const logout = async (req: Request, res: Response) => {
  try {
    res.clearCookie("access_token");
    res.clearCookie("refresh_token");
    return res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    console.error("Error logging out:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};