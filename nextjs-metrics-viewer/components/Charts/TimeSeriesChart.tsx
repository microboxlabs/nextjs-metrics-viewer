import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface LineChartProps {
    data: { category: string; value: number; date: string }[];
}

const LineChart: React.FC<LineChartProps> = ({ data }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    const groupData = (groupBy: string) => {
        const monthMap: Record<string, number> = {
            ene: 1, feb: 2, mar: 3, abr: 4, may: 5, jun: 6,
            jul: 7, ago: 8, sept: 9, oct: 10, nov: 11, dic: 12,
        };

        const filteredData = data.filter((item) => {
            const date = new Date(item.date);
            if (groupBy === "year" && selectedCategory) return item.category === selectedCategory;
            if (groupBy === "month" && selectedYear) {
                return date.getFullYear().toString() === selectedYear;
            }
            if (groupBy === "day" && selectedMonth) {
                const [month, year] = selectedMonth.split(" ");
                const currentMonth = date.toLocaleString("es", { month: "short" });
                return year === date.getFullYear().toString() && currentMonth === month;
            }
            return true;
        });

        const grouped = filteredData.reduce((acc, item) => {
            const date = new Date(item.date);
            let key = "";

            if (groupBy === "category") key = item.category;
            else if (groupBy === "year") key = date.getFullYear().toString();
            else if (groupBy === "month") {
                key = `${date.toLocaleString("es", { month: "short" })} ${date.getFullYear()}`;
            } else if (groupBy === "day") key = `Day ${date.getDate()}`;

            acc[key] = (acc[key] || 0) + item.value;
            return acc;
        }, {} as Record<string, number>);

        return Object.entries(grouped).sort((a, b) => {
            if (groupBy === "day") {
                return parseInt(a[0].split(" ")[1]) - parseInt(b[0].split(" ")[1]);
            } else if (groupBy === "month") {
                const [monthA, yearA] = a[0].split(" ");
                const [monthB, yearB] = b[0].split(" ");
                return (
                    parseInt(yearA) - parseInt(yearB) ||
                    monthMap[monthA] - monthMap[monthB]
                );
            } else if (groupBy === "year") {
                return parseInt(a[0]) - parseInt(b[0]);
            }
            return a[0].localeCompare(b[0]);
        });
    };

    let groupedData: Record<string, number> = {};
    let header = "Category Distribution";

    if (!selectedCategory) {
        groupedData = Object.fromEntries(groupData("category"));
    } else if (!selectedYear) {
        groupedData = Object.fromEntries(groupData("year"));
        header = `Yearly Distribution for ${selectedCategory}`;
    } else if (!selectedMonth) {
        groupedData = Object.fromEntries(groupData("month"));
        header = `Monthly Distribution for ${selectedYear}`;
    } else {
        groupedData = Object.fromEntries(groupData("day"));
        header = `Daily Distribution for ${selectedMonth}`;
    }


    const total = Object.values(groupedData).reduce((sum, val) => sum + val, 0);
    const percentages = total > 0 ? Object.values(groupedData).map((val) => (val / total) * 100) : [];

    const chartData = {
        labels: Object.keys(groupedData),
        datasets: [
            {
                label: !selectedCategory
                    ? "Categories"
                    : !selectedYear
                        ? "Years"
                        : !selectedMonth
                            ? "Months"
                            : "Days",
                data: percentages.map(Number),
                borderColor: "#4bc0c0",
                backgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#3CA6A6", "#E4572E",
                    "#8A89C0", "#D45087", "#FFA600", "#F95D6A", "#00CED1",
                    "#6495ED", "#1E90FF", "#FF4500", "#FF1493", "#32CD32",
                    "#FFD700", "#8B4513", "#C71585", "#20B2AA", "#D2691E",
                    "#FF7F50", "#9ACD32", "#6A5ACD", "#BA55D3", "#ADFF2F",
                    "#FFB6C1", "#7B68EE", "#48D1CC", "#F08080", "#87CEFA",
                    "#B0C4DE"
                ],
                pointBackgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#3CA6A6", "#E4572E",
                    "#8A89C0", "#D45087", "#FFA600", "#F95D6A", "#00CED1",
                    "#6495ED", "#1E90FF", "#FF4500", "#FF1493", "#32CD32",
                    "#FFD700", "#8B4513", "#C71585", "#20B2AA", "#D2691E",
                    "#FF7F50", "#9ACD32", "#6A5ACD", "#BA55D3", "#ADFF2F",
                    "#FFB6C1", "#7B68EE", "#48D1CC", "#F08080", "#87CEFA",
                    "#B0C4DE"
                ], 
                pointBorderColor: "#fff",
                pointRadius: 5,
                pointHoverRadius: 8,
                tension: 0.4, 
            },
        ],
    };




    return (
        <div className="relative mx-auto w-full rounded-lg bg-black p-6 shadow-lg">
            <h2 className="mb-4 text-center text-2xl font-bold text-white">{header}</h2>
            <div className="h-[400px] w-full">
                <Line
                    data={chartData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            y: {
                                beginAtZero: true,
                                max: 100,
                                ticks: {
                                    color: "#FFFFFF", 
                                    callback: (value) => `${value}%`,
                                },
                            },
                            x: {
                                ticks: {
                                    color: "#FFFFFF",
                                }
                            }
                        },
                        plugins: {
                            title: {
                                display: true,
                                font: { size: 18, weight: "bold" },
                                color: "#fff",
                                padding: { top: 10, bottom: 10 },
                            },
                            legend: {
                                display: true,
                                position: "top",
                                align: "center",
                                labels: {
                                    color: "#fff",
                                    font: { size: 12 },
                                    boxWidth: 20,
                                    padding: 10,
                                },
                            },
                            tooltip: {
                                callbacks: {
                                    label: (tooltipItem: any) => {
                                        const percentage = tooltipItem.raw ?? 0;
                                        return `${tooltipItem.label}: ${percentage.toFixed(1)}%`;
                                    },
                                },
                            },
                        },

                        onClick: (_, elements) => {
                            if (elements && elements.length > 0) {
                                const index = elements[0]?.index;
                                if (index !== undefined && chartData.labels[index]) {
                                    const label = chartData.labels[index];
                                    if (!selectedCategory) setSelectedCategory(label);
                                    else if (!selectedYear) setSelectedYear(label);
                                    else if (!selectedMonth) setSelectedMonth(label);
                                }
                            }
                        },

                    }}
                />
            </div>
            {(selectedCategory || selectedYear || selectedMonth) && (
                <button
                    className="mt-4 w-full rounded bg-primary px-4 py-2 text-white hover:bg-secondary"
                    onClick={() => {
                        if (selectedMonth) setSelectedMonth(null);
                        else if (selectedYear) setSelectedYear(null);
                        else if (selectedCategory) setSelectedCategory(null);
                    }}
                >
                    Back
                </button>
            )}
            <p className="mt-4 text-center text-sm text-white">
                {selectedMonth
                    ? "Showing daily values for the selected month."
                    : selectedYear
                        ? "Click on a month to view its daily breakdown."
                        : selectedCategory
                            ? "Click on a year to view monthly breakdown."
                            : "Click on a category to view yearly breakdown."}
            </p>
        </div>
    );
};

export default LineChart;
