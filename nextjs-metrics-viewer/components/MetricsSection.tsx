"use client";
import ApexCharts from "apexcharts";
import { useState, useEffect } from "react";
import MetricsChart from "@/components/MetricsChart";
import UploadDataModal from "@/components/UploadDataModal";
import { INITIAL_OPTIONS, INITIAL_METRICS } from "@/contants";
import { getSummaryMetrics, ProccessDataToSeries } from "@/utils";
import MetricsView from "./MetricsView";
import { Options, Metrics } from "@/interfaces";

const updateChart = (data: Options) => {
  const chartElement = document.getElementById("column-chart");
  if (chartElement && typeof ApexCharts !== "undefined") {
    chartElement.innerHTML = "";
    const chart = new ApexCharts(chartElement, data);
    chart.render();
  }
};

export default function MetricsSection() {
  const [options, setOptions] = useState<Options>(() => {
    const savedOptions = localStorage.getItem("options") ?? "";
    if (savedOptions) return JSON.parse(savedOptions);
    return INITIAL_OPTIONS;
  });

  const [metrics, setMetrics] = useState<Metrics>(INITIAL_METRICS);

  const updateOptions = (data: string) => {
    const dataToSeries = ProccessDataToSeries(data);
    setOptions((prev) => ({
      ...prev,
      series: dataToSeries,
    }));
  };

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
    updateChart(options);

    const summaryMetrics = getSummaryMetrics(options.series);
    setMetrics(summaryMetrics);
  }, [options]);

  return (
    <section className="flex w-full max-w-screen-xl flex-col gap-8">
      <UploadDataModal updateOptions={updateOptions} />
      <MetricsView metrics={metrics} />
      <MetricsChart />
    </section>
  );
}
