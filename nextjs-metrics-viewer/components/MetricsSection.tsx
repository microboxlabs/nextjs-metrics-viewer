"use client";
import { useState, useEffect } from "react";
import MetricsChart from "@/components/MetricsChart";
import UploadDataModal from "@/components/UploadDataModal";
import ToggleFilters from "@/components/ToogleFilter";
import { Options, Series } from "@/interfaces";
import { INITIAL_OPTIONS, INITIAL_METRICS } from "@/contants";
import { getSummaryMetrics, ProccessTextToSeries } from "@/utils";
import { useChart } from "@/hooks/chart";
import MetricsView from "@/components/MetricsView";

export default function MetricsSection() {
  const [options, setOptions] = useState<Options>(() => {
    const savedOptions = localStorage.getItem("options") ?? "";
    if (savedOptions) return JSON.parse(savedOptions);
    return INITIAL_OPTIONS;
  });

  const [metrics, setMetrics] = useState(INITIAL_METRICS);

  const { createChart, toggleSeries } = useChart();

  const loadOptions = (data: string) => {
    const dataToSeries = ProccessTextToSeries(data);
    setOptions((prev) => ({
      ...prev,
      series: dataToSeries,
    }));
  };

  const updateMetrics = (arr: Series[]) => {
    const summaryMetrics = getSummaryMetrics(arr);
    setMetrics(summaryMetrics);
  };

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
    createChart(options);
    updateMetrics(options.series);
  }, [options]);

  return (
    <section className="flex w-full max-w-screen-xl flex-col gap-8">
      <UploadDataModal loadOptions={loadOptions} />
      <MetricsView metrics={metrics} />
      <MetricsChart />
      <ToggleFilters
        data={options}
        toggleSeries={toggleSeries}
        updateMetrics={updateMetrics}
      />
    </section>
  );
}
