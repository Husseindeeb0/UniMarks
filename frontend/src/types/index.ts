export interface UserType {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: "ADMIN" | "TEACHER" | "STUDENT";
  createdAt: Date;
  updatedAt: Date;
}
