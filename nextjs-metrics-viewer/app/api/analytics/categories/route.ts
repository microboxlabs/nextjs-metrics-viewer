import { DatabaseConnection } from "@/lib/db";
import { analytics } from "@/lib/db/schemas/data";
import { StatusCodes } from "http-status-codes";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const db = DatabaseConnection.getInstance().db;

    const categories = await db
      .selectDistinct({ category: analytics.category })
      .from(analytics)
      .orderBy(analytics.category);

    return NextResponse.json(
      { success: true, data: categories },
      { status: StatusCodes.OK },
    );
  } catch (error: any) {
    console.error("Error en el endpoint GET de categorias:", error.message);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
