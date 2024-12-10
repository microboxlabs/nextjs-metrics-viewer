import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import { UserRole } from "./domain/users/model";

export async function middleware(req: NextRequest) {
  const token = await getToken({ req });
  const url = req.nextUrl.clone();

  if (!token) {
    url.pathname = "/auth/login";
    return NextResponse.redirect(url);
  }

  const adminRoutes = ["/upload_data"];
  if (
    adminRoutes.includes(req.nextUrl.pathname) &&
    token.role !== UserRole.Admin
  ) {
    url.pathname = "/unauthorized";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/upload_data"],
};
