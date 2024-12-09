import { NextResponse } from "next/server";
import { AnalyticsMiddlewares } from "./middleware";
import { StatusCodes } from "http-status-codes";
import { ValidateDataService } from "./services/validate_data";
import { RegisterDataService } from "./services/register";
import { DatabaseConnection } from "@/lib/db";

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

    // Validar el archivo
    const validateService = new ValidateDataService(file);
    const result = await validateService.perform();

    if (!result.success) {
      return NextResponse.json(
        { success: false, message: result.error },
        { status: StatusCodes.BAD_REQUEST },
      );
    }

    // Registrar los datos validados
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
