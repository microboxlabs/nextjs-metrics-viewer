import { eq, and, gte, lte } from "drizzle-orm";
import { analytics } from "@/lib/db/schemas/data";
import { DatabaseConnectionHandler } from "@/lib/db";
import { AnalyticsModel } from "@/domain/analytics/model";

interface GetAnalyticsParams {
  category?: string;
  startDate?: string;
  endDate?: string;
}

interface GetAnalyticsResult {
  success: boolean;
  message?: string;
  data?: AnalyticsModel[];
}

class GetAnalyticsService {
  constructor(private readonly __db: DatabaseConnectionHandler) {}

  async perform(params: GetAnalyticsParams) {
    try {
      const { category, startDate, endDate } = params;

      const startTimestamp = startDate ? new Date(startDate).getTime() : null;
      const endTimestamp = endDate ? new Date(endDate).getTime() : null;

      if (
        (startDate && startTimestamp !== null && isNaN(startTimestamp)) ||
        (endDate && endTimestamp !== null && isNaN(endTimestamp))
      ) {
        return { success: false, message: "Formato de fecha inválido." };
      }

      const startDateObj = startTimestamp
        ? new Date(startTimestamp)
        : undefined;
      const endDateObj = endTimestamp ? new Date(endTimestamp) : undefined;

      const conditions = [];

      if (category) conditions.push(eq(analytics.category, category));

      if (startDateObj) conditions.push(gte(analytics.date, startDateObj));

      if (endDateObj) conditions.push(lte(analytics.date, endDateObj));

      const rows = await this.__db
        .select()
        .from(analytics)
        .where(conditions.length > 0 ? and(...conditions) : undefined);

      return { success: true, data: rows };
    } catch (error: any) {
      console.error("Error al obtener los datos de analytics:", error.message);
      return {
        success: false,
        message: "Error interno del servidor.",
      };
    }
  }
}

export { GetAnalyticsService };
