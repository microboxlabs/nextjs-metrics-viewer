"use client";

import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Registrar componentes de Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

// Tipos para el dataset
interface Category {
  category: string;
  value: number;
}

interface DataEntry {
  date: string;
  categories: Category[];
}

interface BarChartProps {
  data: DataEntry[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
  // Transformar datos
  const chartData = transformData(data);

  // Opciones del gráfico
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    aspectRatio: 1,
    plugins: {
      legend: {
        position: "top" as const,
      },
      title: {
        display: true,
        text: "Comparison of categories by date",
      },
    },
    scales: {
      x: {
        title: {
          display: true,
          text: "Dates",
        },
      },
      y: {
        title: {
          display: true,
          text: "Values",
        },
      },
    },
  };

  return(
    <div className="h-64 w-full md:h-96">
      <Bar data={chartData} options={options} />
    </div>
  ) 
};

// Helper function para transformar los datos
const transformData = (data: DataEntry[]) => {
  const dates = data.map((item) => item.date);
  const categories = Array.from(
    new Set(data.flatMap((item) => item.categories.map((cat) => cat.category))),
  );

  const datasets = categories.map((category) => {
    const categoryData = data.map((item) => {
      const match = item.categories.find((cat) => cat.category === category);
      return match ? match.value : 0; // Rellenar con 0 si no hay datos
    });

    return {
      label: category,
      data: categoryData,
      backgroundColor:
        category === "Expenses"
          ? "rgba(255, 99, 132, 0.5)"
          : category === "Sales"
            ? "rgba(54, 162, 235, 0.5)"
            : "rgba(75, 192, 192, 0.5)", // Color genérico para otras categorías
      borderColor:
        category === "Expenses"
          ? "rgba(255, 99, 132, 1)"
          : category === "Sales"
            ? "rgba(54, 162, 235, 1)"
            : "rgba(75, 192, 192, 1)",
      borderWidth: 1,
    };
  });

  return {
    labels: dates,
    datasets,
  };
};

export default BarChart;