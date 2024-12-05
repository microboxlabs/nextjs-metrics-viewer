"use client";
import ApexCharts from "apexcharts";
import { useState, useEffect } from "react";
import MetricsChart from "@/components/MetricsChart";
import UploadDataModal from "@/components/UploadDataModal";

export default function MetricsSection() {
  const [options, setOptions] = useState({
    chart: {
      height: "100%",
      maxWidth: "100%",
      type: "line",
      fontFamily: "Inter, sans-serif",
      dropShadow: {
        enabled: false,
      },
      toolbar: {
        show: false,
      },
    },
    tooltip: {
      enabled: true,
      x: {
        show: false,
      },
    },
    dataLabels: {
      enabled: false,
    },
    stroke: {
      curve: "smooth",
      width: 6,
    },
    grid: {
      show: true,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -26,
      },
    },
    series: [],
    legend: {
      show: true,
    },
  });

  interface formattedSeries {
    name: string;
    data: { x: string; y: string }[];
  }

  enum Headers {
    Date = "Date",
    Category = "Category",
    Value = "Value",
  }

  const updateOptions = (data: string, groupByKey = Headers.Category) => {
    const text = data.split("\r\n");
    const headers = text.shift()?.split(",");
    const splittedData = text.map((row) => {
      let obj: { [key in Headers]?: string } = {};
      const values = row.split(",");
      headers?.forEach((header, index) => {
        if (Object.values(Headers).includes(header as Headers)) {
          obj[header as Headers] = values[index] ?? "";
        }
      });
      return obj;
    });

    const mapData = new Map<string, formattedSeries>();

    splittedData.forEach((row) => {
      const category = row[groupByKey];
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
        ?.data.push({ x: row[Headers.Date], y: row[Headers.Value] });
    });
    const dataSeries = Array.from(mapData.values()) as [];
    setOptions((prev) => ({ ...prev, series: dataSeries }));
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
