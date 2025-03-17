import NextAuth, { DefaultSession, DefaultUser } from "next-auth";

declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
      role?: "EMPLOYEE" | "MANAGER" | null;
      wagePerHour?: number | null;
      contactNumber?: string | null;
      managerName?: string | null;
      bsb?: string | null; // Add bsb field
      accountNumber?: string | null; // Add accountNumber field
    } & DefaultSession["user"];
  }

  interface User extends DefaultUser {
    id: string;
    role?: "EMPLOYEE" | "MANAGER"; // Optional: Adding role for later use
  }
}