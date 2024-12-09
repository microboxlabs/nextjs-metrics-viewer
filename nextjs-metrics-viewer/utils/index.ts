import ApexCharts from "apexcharts";
import { INITIAL_METRICS } from "@/contants";
import { Headers, Options, Series } from "@/interfaces";

export function ProccessTextToSeries(data: string) {
  const text = data.split("\r\n");
  const headers = text.shift()?.split(",");
  const splittedData = text.map((row) => {
    let obj: { [key in Headers]?: string } = {};
    const values = row.split(",");
    headers?.forEach((header, index) => {
      obj[header as Headers] = values[index];
    });
    return obj;
  });

  const allDates = Array.from(
    new Set(splittedData.map((row) => row[Headers.Date])),
  );

  const allCategories = Array.from(
    new Set(splittedData.map((row) => row[Headers.Category])),
  );

  const normalizedData = allDates.flatMap((date) => {
    return allCategories.map((category) => {
      let obj: { [key in Headers]?: string } = {};
      const entry = splittedData.find(
        (item) =>
          item[Headers.Date] === date && item[Headers.Category] === category,
      );
      obj[Headers.Date] = date;
      obj[Headers.Category] = category;
      obj[Headers.Value] = entry?.[Headers.Value] ?? "0";
      return obj;
    });
  });

  const mapData = new Map<string, Series>();

  normalizedData.forEach((row) => {
    const category = row[Headers.Category];
    if (!category) return;
    if (!mapData.has(category)) {
      mapData.set(category, {
        name: category,
        data: [],
      });
    }
    if (!row[Headers.Date] || !row[Headers.Value]) return;
    mapData
      .get(category)
      ?.data.push({ x: row[Headers.Date], y: Number(row[Headers.Value]) });
  });

  const dataSeries = Array.from(mapData.values()) as [];

  return dataSeries;
}

export function getSummaryMetrics(series: Series[]) {
  if (!series.length) return INITIAL_METRICS;

  const max = series.reduce((acc, curr) => {
    return Math.max(
      acc,
      curr.data.reduce((acc, curr) => Math.max(acc, curr.y), 0),
    );
  }, 0);

  const min = series.reduce((acc, curr) => {
    return Math.min(
      acc,
      curr.data.reduce((acc, curr) => Math.min(acc, curr.y), 0),
    );
  }, 0);

  const total = series.reduce((acc, curr) => {
    return (
      Number(acc) +
      curr.data.reduce((acc, curr) => Number(acc) + Number(curr.y), 0)
    );
  }, 0);

  const average =
    Math.round((100 * total) / (series.length * series[0].data.length)) / 100;

  return {
    max,
    min,
    total,
    average,
  };
}

export const createChart = (data: Options) => {
  const chartElement = document.getElementById("column-chart");
  if (chartElement && typeof ApexCharts !== "undefined") {
    chartElement.innerHTML = "";
    return new ApexCharts(chartElement, data);
  }
};

export const toggleSeries = (chart: ApexCharts, name: string) => {
  chart.toggleSeries(name);
};
