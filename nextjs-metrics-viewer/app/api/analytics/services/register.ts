import { DatabaseConnectionHandler } from "@/lib/db";
import { analytics } from "@/lib/db/schemas/data";
import { AnalyticsModel } from "@/domain/analytics/model";

class RegisterDataService {
  private __parsedData: AnalyticsModel[];

  constructor(
    parsedData: AnalyticsModel[],
    private readonly __db: DatabaseConnectionHandler,
  ) {
    this.__parsedData = parsedData;
  }

  async perform() {
    try {
      if (this.__parsedData.length === 0) {
        return { ok: false, message: "No hay datos para registrar." };
      }

      await Promise.all(
        this.__parsedData.map((element) =>
          this.__db.insert(analytics).values(element.props),
        ),
      );

      return { ok: true, message: "Datos registrados satisfactoriamente" };
    } catch (error) {
      console.error("Error al registrar los datos de analytics:", error);
      return { ok: false, message: "Error al registrar los datos." };
    }
  }
}

export { RegisterDataService };
