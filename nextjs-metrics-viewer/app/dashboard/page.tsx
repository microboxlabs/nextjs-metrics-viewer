import { AnalyticsModel, AnalyticsModelProps } from "@/domain/analytics/model";
import { BarChart } from "./reports/category_comparison";
import { TimeSeriesChart } from "./reports/time_series";
import { AnalyticsUtilities } from "@/domain/analytics/utilities";

async function DashboardPage() {
  const response = await fetch("http://localhost:3000/api/analytics", {
    cache: "no-store",
  });

  if (response.status === 500) {
    return <div>Error al cargar los datos</div>;
  }

  const result = await response.json();

  const analytics: AnalyticsModelProps[] = result.data.map(
    (element: any) => new AnalyticsModel({ ...element }).props,
  );

  const metrics = AnalyticsUtilities.calculateMetrics(
    result.data.map((element: any) => new AnalyticsModel({ ...element })),
  );

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <div className="grid w-full grid-cols-1 gap-3 lg:grid-cols-2">
        <div className="rounded-md bg-white p-4 shadow-md">
          <h2 className="text-lg font-semibold">Comparación de categorías</h2>
          <BarChart analytics={analytics} />
        </div>
        <div className="rounded-md bg-white p-4 shadow-md">
          <h2 className="text-lg font-semibold">Series temporales</h2>
          <TimeSeriesChart analytics={analytics} />
        </div>
      </div>
      <div className="rounded-md bg-white p-4 shadow-md">
        <h2 className="text-lg font-semibold">Métricas</h2>
        <ul className="flex list-inside list-disc flex-col gap-2 md:flex-row md:gap-5">
          <li>
            <span className="font-semibold">Total de registros:</span>{" "}
            {metrics.total}
          </li>
          <li>
            <span className="font-semibold">Promedio:</span> {metrics.average}
          </li>
          <li>
            <span className="font-semibold">Máximo:</span> {metrics.max}
          </li>
          <li>
            <span className="font-semibold">Mínimo:</span> {metrics.min}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;
