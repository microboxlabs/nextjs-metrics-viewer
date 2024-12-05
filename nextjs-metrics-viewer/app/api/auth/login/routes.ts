import { DatabaseConnection } from "@/lib/db";
import { AppError } from "@/lib/errors";
import { UserAuthLoginService } from "@/users/services/auth/login";
import { StatusCodes } from "http-status-codes";

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      throw new AppError(
        "Email and password are required",
        StatusCodes.BAD_REQUEST,
      );
    }

    const db = DatabaseConnection.getInstance().db;

    const loginService = new UserAuthLoginService(email, password, db);
    const result = await loginService.perform();

    return Response.json(result, { status: StatusCodes.OK });
  } catch (error: any) {
    if (error instanceof AppError) {
      return Response.json(
        { error: error.message },
        { status: error.statusCode },
      );
    }

    console.error("Unhandled error:", error);
    return Response.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
