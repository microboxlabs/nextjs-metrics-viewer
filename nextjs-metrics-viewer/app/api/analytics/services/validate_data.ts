import Papa from "papaparse";
import { AnalyticsModel } from "@/domain/analytics/model";

interface ValidationResult {
  success: boolean;
  data?: AnalyticsModel[];
  error?: string;
}

class ValidateDataService {
  public constructor(private readonly __data: any) {}

  public async perform(): Promise<ValidationResult> {
    try {
      const csvContent = this.__data.buffer.toString(); // Convertir buffer a texto

      const parsedCsv = Papa.parse(csvContent, {
        header: true,
        skipEmptyLines: true,
      });

      if (parsedCsv.errors.length > 0) {
        return {
          success: false,
          error: `Error en el archivo CSV: ${parsedCsv.errors[0].message}`,
        };
      }

      const expectedHeaders = ["Date", "Category", "Value"];
      const headers = Object.keys(parsedCsv.data[0] || {});
      if (!this.validateHeaders(headers, expectedHeaders)) {
        return {
          success: false,
          error: `Encabezados inválidos. Se esperaban: ${expectedHeaders.join(
            ", ",
          )}`,
        };
      }

      const data: AnalyticsModel[] = parsedCsv.data.map((row: any) => {
        const numericValue = parseFloat(row.Value);
        if (isNaN(numericValue)) {
          throw new Error(`Valor inválido: ${row.Value}`);
        }

        return new AnalyticsModel({
          category: row.Category,
          date: new Date(row.Date),
          value: numericValue,
        });
      });

      return { success: true, data };
    } catch (error: any) {
      return {
        success: false,
        error: `Error al procesar el archivo: ${error.message}`,
      };
    }
  }

  private validateHeaders(
    headers: string[],
    expectedHeaders: string[],
  ): boolean {
    return (
      headers.length === expectedHeaders.length &&
      headers.every((header, index) => header === expectedHeaders[index])
    );
  }
}

export { ValidateDataService };
