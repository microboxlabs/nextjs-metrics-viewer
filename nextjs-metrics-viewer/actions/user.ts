"use server";
import { prisma } from "@/prisma";
import { ProfileInitialValues } from "@/app/(protected)/account/Components/Form/ProfileEditForm";
import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import email from "next-auth/providers/email";
//Get the session user data
export async function getUser(idUser: number) {
  try {
    const user = await prisma.user.findFirstOrThrow({
      where: { id: idUser },
    });

    return {
      name: user?.name,
      lastname: user?.lastname,
      email: user?.email,
      image: user?.image,
    };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code == "P2025"
    ) {
      return { error: "No se encuentra el usuario especificado" };
    }
    return { error: "Error 500" };
  }
}

export async function UpdateUser(idUser: number, user: ProfileInitialValues) {
  try {
    const password = await bcrypt.hash(user.password, 10);

    await prisma.user.update({
      where: { id: idUser },
      data: {
        name: user.name,
        lastname: user.lastname,
        email: user.email,
        password,
      },
    });

    return { success: true };
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code == "P2002"
    ) {
      return { error: "Credentials not valid: (email)" };
    }
    return { error: "error 500" };
  }
}
