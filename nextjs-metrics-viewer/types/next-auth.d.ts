import { DefaultSession } from "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    user: {
      isAdmin?: boolean;
      img?: string;
    } & DefaultSession["user"];
  }

  interface User {
    isAdmin?: boolean;
    img?: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    isAdmin?: boolean;
    img?: string;
  }
}
