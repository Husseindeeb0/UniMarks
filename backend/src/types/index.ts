import { Role } from "@prisma/client";

export interface UserType {
  id: number;
  name: string;
  email: string;
  password?: string;
  role: Role;
  refreshToken?: string | null;
  updatedAt?: Date;
  createdAt?: Date;
}

declare global {
  namespace Express {
    interface Request {
      userId?: number;
      user?: {
        id: number;
        email: string;
        role: Role;
        name?: string;
      };
    }
  }
}