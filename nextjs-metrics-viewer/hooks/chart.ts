import { useRef } from "react";
import ApexCharts from "apexcharts";
import { Options } from "@/interfaces";

export const useChart = () => {
  const chartRef = useRef<ApexCharts | null>(null);

  const createChart = (data: Options) => {
    const chartElement = document.getElementById("column-chart");
    if (chartElement) {
      chartElement.innerHTML = "";
      chartRef.current = new ApexCharts(chartElement, data);
      chartRef.current.render();
    }
  };

  const toggleSeries = (name: string) => {
    chartRef.current?.toggleSeries(name);
  };

  return { chartRef, createChart, toggleSeries };
};
