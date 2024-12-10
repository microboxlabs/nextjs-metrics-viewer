import { NextResponse } from "next/server";
import { AnalyticsMiddlewares } from "./middleware";
import { StatusCodes } from "http-status-codes";
import { ValidateDataService } from "./services/validate_data";
import { RegisterDataService } from "./services/register";
import { DatabaseConnection } from "@/lib/db";
import { GetAnalyticsService } from "./services/read";

export async function POST(req: Request) {
  try {
    const nodeReq = AnalyticsMiddlewares.toNodeReadable(
      req.body as ReadableStream,
      req.headers,
    );

    const parsedReq: any = await AnalyticsMiddlewares.analyticsMiddleware(
      nodeReq,
      {},
    );

    const file = parsedReq.file;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No se envió ningún archivo." },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    if (file.mimetype !== "text/csv") {
      return NextResponse.json(
        { success: false, message: "El archivo debe ser un CSV." },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    const validateService = new ValidateDataService(file);
    const result = await validateService.perform();

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    const registerDataService = new RegisterDataService(
      result.data!,
      DatabaseConnection.getInstance().db,
    );

    const registerResult = await registerDataService.perform();

    if (!registerResult.ok) {
      return NextResponse.json(
        { success: false, message: registerResult.message },
        { status: StatusCodes.INTERNAL_SERVER_ERROR },
      );
    }

    return NextResponse.json(
      { success: true, message: "Archivo procesado correctamente." },
      { status: StatusCodes.OK },
    );
  } catch (error: any) {
    console.error("Error al procesar el archivo de analytics:", error);
    return NextResponse.json(
      { success: false, message: "Error al procesar el archivo." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const category = url.searchParams.get("category") || undefined;
    const startDate = url.searchParams.get("startDate") || undefined;
    const endDate = url.searchParams.get("endDate") || undefined;

    const db = DatabaseConnection.getInstance().db;

    const service = new GetAnalyticsService(db);
    const result = await service.perform({ category, startDate, endDate });

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.message },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    return NextResponse.json(
      { success: true, data: result.data },
      { status: StatusCodes.OK },
    );
  } catch (error: any) {
    console.error("Error en el endpoint GET de analytics:", error.message);
    return NextResponse.json(
      { success: false, message: "Error interno del servidor." },
      { status: StatusCodes.INTERNAL_SERVER_ERROR },
    );
  }
}
