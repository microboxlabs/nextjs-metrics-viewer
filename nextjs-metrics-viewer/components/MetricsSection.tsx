"use client";
import ApexCharts from "apexcharts";
import { useState } from "react";
import MetricsChart from "@/components/MetricsChart";
import UploadDataModal from "@/components/UploadDataModal";
import { INITIAL_OPTIONS } from "@/contants";
import { ProccessDataToSeries } from "@/utils";

export default function MetricsSection() {
  const [options, setOptions] = useState(INITIAL_OPTIONS);

  const updateOptions = (data: string) => {
    setOptions((prev) => ({ ...prev, series: ProccessDataToSeries(data) }));
  };

  const updateChart = () => {
    const chartElement = document.getElementById("column-chart");
    if (chartElement && typeof ApexCharts !== "undefined") {
      chartElement.innerHTML = "";
      const chart = new ApexCharts(chartElement, options);
      chart.render();
    }
  };

  return (
    <section className="flex w-full max-w-screen-xl flex-col items-center gap-8">
      <UploadDataModal
        updateOptions={updateOptions}
        updateChart={updateChart}
      />
      <MetricsChart />
    </section>
  );
}
