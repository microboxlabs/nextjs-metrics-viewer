import { AppError } from "@/lib/errors";
import { StatusCodes } from "http-status-codes";
import { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginService } from "../services/login";
import { DatabaseConnection } from "@/lib/db";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Contraseña", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials || !credentials.email || !credentials.password)
            throw new AppError(
              "Correo y contraseña son requeridos para iniciar sesión",
              StatusCodes.BAD_REQUEST,
            );

          const loginService = new LoginService(
            credentials.email,
            credentials.password,
            DatabaseConnection.getInstance().db,
          );

          const { user, token } = await loginService.perform();

          return {
            firstName: user.firstName,
            lastName: user.lastName,
            email: user.email,
            isActive: user.isActive,
            role: user.role,
            id: user.id!,
            token,
          };
        } catch (error) {
          if (error instanceof AppError)
            throw new AppError(error.message, error.statusCode);

          console.error("Unhandled error:", error);
          throw new AppError(
            "Internal Server Error",
            StatusCodes.INTERNAL_SERVER_ERROR,
          );
        }
      },
    }),
  ],
  pages: {
    signIn: "/auth/login",
  },
  callbacks: {
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        firstName: token.firstName as string,
        lastName: token.lastName as string,
        role: token.role as string,
        isActive: token.isActive as boolean,
      };
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.firstName = user.firstName;
        token.lastName = user.lastName;
        token.role = user.role;
        token.isActive = user.isActive;
      }
      return token;
    },
  },
};
