import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAppSelector } from "../../store/hooks";
import { selectChartData } from '../../store/slices/productsSlice';
import CSS from "csstype";


const Chart = dynamic(() => import("react-apexcharts"), { ssr: false });

export default function BarChartMetrics() {

  const chartData = useAppSelector(selectChartData);

  const [isLoading, setIsLoading] = useState(true);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (Object.keys(chartData).length > 0) {
      setIsLoading(false);
      setIsReady(true);
    }
  }, [chartData]);

  const dataSample = {
    options: {
      chart: {
        id: "bar",
      },
      xaxis: {
        categories: chartData.dates,
      },
      title: {
        text: 'Barchart in time',
        offsetX: 60,
      },
    },
    series: [
      {
        name: "Sales",
        data: chartData.sales,
      },
      {
        name: "Expenses",
        data: chartData.expenses,
      },
      {
        name: "Marketing",
        data: chartData.marketing,
      },
    ],
  };

  const divStyle: CSS.Properties = {
    height: "50%",
    minHeight: "15rem"
  }

  return (
    <div style={divStyle}>
      { isReady ? 
      <Chart
        options={dataSample.options}
        series={dataSample.series}
        type="bar"
        width={"100%"}
        height={"100%"}
      />
      : 
      <div>Loading chart data...</div>
    }
    </div>
  );
}