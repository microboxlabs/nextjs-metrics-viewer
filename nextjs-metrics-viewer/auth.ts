import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  secret: process.env.AUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      credentials: {
        name: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null;

        if (
          credentials.name === "admin_user" &&
          credentials.password === "admin_user"
        ) {
          user = {
            name: "Admin User",
            img: "https://flowbite.com/docs/images/people/profile-picture-1.jpg",
            isAdmin: true,
          };
        }

        if (
          credentials.name === "regular_user" &&
          credentials.password === "regular_user"
        ) {
          user = {
            name: "Regular User",
            img: "https://flowbite.com/docs/images/people/profile-picture-2.jpg",
            isAdmin: false,
          };
        }

        if (!user) {
          throw new Error("Invalid credentials.");
        }

        return user;
      },
    }),
  ],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.isAdmin = user.isAdmin;
        token.img = user.img;
      }
      return token;
    },
    session({ session, token }) {
      session.user.isAdmin = token.isAdmin;
      session.user.img = token.img;
      return session;
    },
  },
  pages: {
    signIn: "/",
  },
});
