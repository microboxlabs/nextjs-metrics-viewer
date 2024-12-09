
import type { NextAuthConfig } from "next-auth"
import Credentials from "next-auth/providers/credentials"
import {prisma} from "@/prisma"

import bcrypt from 'bcryptjs'

export default {
    providers: [
        Credentials({
          name: "Credentials",
          credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
          },
          async authorize(credentials: any) {
            const user = await prisma.user.findUnique({
                where: {
                  email: credentials.email,
                },
              });
              if (!user || !user.password) {
                throw new Error("Invalid credentials");
              }
              const isValid = await bcrypt.compare(
                credentials.password,
                user.password,
              );
      
              if (!isValid) {
                throw new Error("Invalid credentials");
              }
      
              return user;
          },
        }),
      ]
} satisfies NextAuthConfig