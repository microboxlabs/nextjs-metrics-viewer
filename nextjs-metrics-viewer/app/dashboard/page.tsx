import { AnalyticsModel, AnalyticsModelProps } from "@/domain/analytics/model";
import { BarChart } from "./reports/category_comparison";
import { AnalyticsUtilities } from "@/domain/analytics/utilities";
import { DashboardFilters } from "./components/filters";
import { TimeSeriesChart } from "./reports/time_series";

type DashboardPageProps = {
  searchParams: { category?: string; initDate?: string; endDate?: string };
};

async function DashboardPage({ searchParams }: DashboardPageProps) {
  const { category, initDate, endDate } = searchParams;

  const queryParamsUrl = `${category ? `category=${category}` : ""}${initDate ? `&startDate=${initDate}` : ""}${endDate ? `&endDate=${endDate}` : ""}`;

  const analyticsFetch = await fetch(
    `http://localhost:3000/api/analytics${queryParamsUrl.length > 0 ? `?${queryParamsUrl}` : ""}`,
    {
      cache: "no-store",
    },
  );

  if (analyticsFetch.status === 500) {
    return <div>Error al cargar los datos</div>;
  }

  const analyticsResult = await analyticsFetch.json();

  const analytics: AnalyticsModelProps[] = analyticsResult.data.map(
    (element: any) =>
      new AnalyticsModel({ ...element, date: new Date(element.date) }).props,
  );

  const metrics = AnalyticsUtilities.calculateMetrics(
    analyticsResult.data.map(
      (element: any) => new AnalyticsModel({ ...element }),
    ),
  );

  const categoriesFetch = await fetch(
    "http://localhost:3000/api/analytics/categories",
    {
      cache: "no-store",
    },
  );

  const categories = await categoriesFetch.json();

  return (
    <div className="flex h-full w-full flex-col gap-5">
      <DashboardFilters
        categories={
          categories.data.map((element: any) => element.category) || []
        }
      />
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
            {metrics.total.toFixed(2)}
          </li>
          <li>
            <span className="font-semibold">Promedio:</span>{" "}
            {metrics.average.toFixed(2)}
          </li>
          <li>
            <span className="font-semibold">Máximo:</span>{" "}
            {metrics.max.toFixed(2)}
          </li>
          <li>
            <span className="font-semibold">Mínimo:</span>{" "}
            {metrics.min.toFixed(2)}
          </li>
        </ul>
      </div>
    </div>
  );
}

export default DashboardPage;
