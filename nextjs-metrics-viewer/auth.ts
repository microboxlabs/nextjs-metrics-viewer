import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  // session: {
  //   strategy: "jwt",
  // },
  providers: [
    Credentials({
      credentials: {
        name: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        if (credentials.name === "admin" && credentials.password === "admin") {
          user = {
            name: "Admin User",
            isAdmin: true,
          };
        }

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
  ],
  pages: {
    signIn: "/",
  },
});
