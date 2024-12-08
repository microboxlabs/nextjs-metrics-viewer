"use client";
import ApexCharts from "apexcharts";
import { useState, useEffect } from "react";
import MetricsChart from "@/components/MetricsChart";
import UploadDataModal from "@/components/UploadDataModal";
import { INITIAL_OPTIONS } from "@/contants";
import { ProccessDataToSeries } from "@/utils";
import MetricsView from "./MetricsView";
import { Options } from "@/interfaces";

export default function MetricsSection() {
  const [options, setOptions] = useState(() => {
    const savedOptions = localStorage.getItem("options") ?? "";
    if (savedOptions) return JSON.parse(savedOptions);
    return INITIAL_OPTIONS;
  });

  const updateOptions = (data: string) => {
    setOptions((prev: Options) => ({
      ...prev,
      series: ProccessDataToSeries(data),
    }));
  };

  const updateChart = () => {
    const chartElement = document.getElementById("column-chart");
    if (chartElement && typeof ApexCharts !== "undefined") {
      chartElement.innerHTML = "";
      const chart = new ApexCharts(chartElement, options);
      chart.render();
    }
  };

  useEffect(() => {
    localStorage.setItem("options", JSON.stringify(options));
    updateChart();
  }, [options]);

  return (
    <section className="flex w-full max-w-screen-xl flex-col items-center gap-8">
      <UploadDataModal updateOptions={updateOptions} />
      <MetricsView />
      <MetricsChart />
    </section>
  );
}
