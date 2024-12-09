"use server";
import { prisma } from "@/prisma";
import { ProfileInitialValues } from "@/app/(protected)/account/Components/Form/ProfileEditForm";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import email from "next-auth/providers/email";

/**
 * Get the user by id. 
 * @param data - An Object with name, role and email or an Object with error
 * @returns a success object or an error object
 */
export async function getUser(idUser: string) {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { id: idUser},
    });

    return {
      name: user?.name,
      isAdmin: user?.isAdmin,
      email: user?.email,
    };
  } catch (error:any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code == "P2025"
    ) {
      return { error: "The specified user is not found" };
    }
    return { error: "Error 500" };
  }
}
/**
 * Update the user data. 
 * @param id - id of the user
 * @param user - An Object with name, email and password. Object come from Update User Form
 * @returns a success object or an error object
 */
export async function UpdateUser(idUser: string, user: {name:string, email:string, password:string}) {
  try {
    const password = await bcrypt.hash(user.password, 10);

    await prisma.user.update({
      where: { id: idUser },
      data: {
        name: user.name,
        email: user.email,
        password,
      },
    });

    return { success: true };
  } catch (error:any) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code == "P2002"
    ) {
      return { error: "Email already in use" };
    }
    return { error: error };
  }
}
