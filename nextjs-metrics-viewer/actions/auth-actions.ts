"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/prisma";
import { Values } from "@/components/Login/LoginComponent";
import { RegisterValues } from "@/components/Register/RegisterComponent";
import bcrypt from "bcryptjs";

export const loginAction = async (values: Values) => {
  try {
    await signIn("credentials", {
      email: values.email,
      password: values.password,
      redirect: false,
    });
    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "error 500" };
  }
};

export const signOutAction = async () => {
  try {
    await signOut();
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "error 500" };
  }
};

export const RegisterAction = async (values: RegisterValues) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: values.email,
      },
    });
    if (user) {
      return {
        error: "User Alredy Exists",
      };
    }

    const password = await bcrypt.hash(values.password, 10);

    await prisma.user.create({
      data: {
        name: values.name,
        email: values.email,
        password,
        role: 1,
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: error };
  }
};
