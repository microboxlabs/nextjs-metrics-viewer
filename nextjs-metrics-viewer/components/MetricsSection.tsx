"use client";
import ApexCharts from "apexcharts";
import { useState, useEffect } from "react";
import MetricsChart from "@/components/MetricsChart";
import UploadDataModal from "@/components/UploadDataModal";

export default function MetricsSection() {
  const [options, setOptions] = useState({
    colors: ["#84b6f4", "#fdfd96", "#77dd77", "#ff6961", "#fdcae1"],
    series: [
      {
        name: "Organic",
        data: [
          { x: "Mon", y: 231 },
          { x: "Tue", y: 122 },
          { x: "Wed", y: 63 },
          { x: "Thu", y: 421 },
          { x: "Fri", y: 122 },
          { x: "Sat", y: 323 },
          { x: "Sun", y: 111 },
        ],
      },
      {
        name: "Social media",
        data: [
          { x: "Mon", y: 232 },
          { x: "Tue", y: 113 },
          { x: "Wed", y: 341 },
          { x: "Thu", y: 224 },
          { x: "Fri", y: 522 },
          { x: "Sat", y: 411 },
          { x: "Sun", y: 243 },
        ],
      },
    ],
    chart: {
      type: "bar",
      height: "420px",
      fontFamily: "Inter, sans-serif",
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "70%",
        borderRadiusApplication: "end",
        borderRadius: 8,
      },
    },
    tooltip: {
      shared: true,
      intersect: false,
      style: {
        fontFamily: "Inter, sans-serif",
      },
    },
    states: {
      hover: {
        filter: {
          type: "darken",
          value: 1,
        },
      },
    },
    stroke: {
      show: true,
      width: 0,
      colors: ["transparent"],
    },
    grid: {
      show: false,
      strokeDashArray: 4,
      padding: {
        left: 2,
        right: 2,
        top: -14,
      },
    },
    dataLabels: {
      enabled: false,
    },
    legend: {
      show: true,
    },
    xaxis: {
      floating: false,
      labels: {
        show: true,
        style: {
          fontFamily: "Inter, sans-serif",
          cssClass: "text-xs font-normal fill-gray-400",
        },
      },
      axisBorder: {
        show: false,
      },
      axisTicks: {
        show: false,
      },
    },
    yaxis: {
      show: false,
    },
    fill: {
      opacity: 1,
    },
  });

  // useEffect(() => {
  //   const chartElement = document.getElementById("column-chart");
  //   if (chartElement && typeof ApexCharts !== "undefined") {
  //     chartElement.innerHTML = "";
  //     const chart = new ApexCharts(chartElement, options);
  //     chart.render();
  //   }
  // }, []);

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
