"use server";

import { auth } from "@/auth";
/**
 * Get the Session of the logged user.
 * @returns Session or Null
 */
export default async function GetSession() {
  const session = await auth();
  return session;
}
