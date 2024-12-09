"use server";

import { signIn, signOut } from "@/auth";
import { AuthError } from "next-auth";
import { prisma } from "@/prisma";
import { Values } from "@/app/components/Login/LoginComponent";
import { RegisterValues } from "@/app/components/Register/RegisterComponent";
import bcrypt from "bcryptjs";

/**
 * A function that recives a value (login credentials) and return a boolean representing the status of login
 * @param values  - user input credentials
 * @returns a success object or an error object
 */
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
/**
 * A function that closes the active user session
 * 
 * @returns a object error if there is an error in Authjs
 */
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
/**
 * A function that performs the logic to register the user. It validates if there is an existing mail in the database and returns a registration status object or an error object.
 * @param values  - user register input credentials
 * @returns a success object or an error object
 */
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
      },
    });

    return { success: true };
  } catch (error) {
    if (error instanceof AuthError) {
      return { error: error.cause?.err?.message };
    }
    return { error: "Could not registate user. Please, try again" };
  }
};
