import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginService } from "./services/login";
import { DatabaseConnection } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { StatusCodes } from "http-status-codes";

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
            ...user.props,
            name: user.fullName,
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
};

const authHandler = NextAuth(authOptions);

export { authHandler as GET, authHandler as POST };
