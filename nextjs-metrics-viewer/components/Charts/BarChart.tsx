import React, { useState } from "react";
import { Bar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ChartEvent, ActiveElement
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface BarChartProps {
    data: { category: string; value: number; date: string }[];
}

const BarChart: React.FC<BarChartProps> = ({ data }) => {
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [selectedYear, setSelectedYear] = useState<string | null>(null);
    const [selectedMonth, setSelectedMonth] = useState<string | null>(null);

    // Agrupar datos
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
            } else if (groupBy === "day") {
                key = `Day ${date.getDate()}`;
            }

            acc[key] = (acc[key] || 0) + item.value;
            return acc;
        }, {} as Record<string, number>);

        const sortedEntries = Object.entries(grouped).sort((a, b) => {
            if (groupBy === "day") {
                const dayA = parseInt(a[0].split(" ")[1]);
                const dayB = parseInt(b[0].split(" ")[1]);
                return dayA - dayB;
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

        return Object.fromEntries(sortedEntries);
    };


    let groupedData: Record<string, number> = {};
    let header = "Category Breakdown";

    if (!selectedCategory) {
        groupedData = groupData("category");
    } else if (!selectedYear) {
        groupedData = groupData("year");
        header = `Yearly Breakdown for ${selectedCategory}`;
    } else if (!selectedMonth) {
        groupedData = groupData("month");
        header = `Monthly Breakdown for ${selectedYear}`;
    } else {
        groupedData = groupData("day");
        header = `Daily Breakdown for ${selectedMonth}`;
    }

    const total = Object.values(groupedData).reduce((sum, val) => sum + val, 0);

    const percentages = total > 0
        ? Object.values(groupedData).map((val) => ((val / total) * 100).toFixed(2))
        : Object.values(groupedData).map(() => "0.00");


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
                backgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#3CA6A6", "#E4572E",
                    "#8A89C0", "#D45087", "#FFA600", "#F95D6A", "#00CED1",
                    "#6495ED", "#1E90FF", "#FF4500", "#FF1493", "#32CD32",
                    "#FFD700", "#8B4513", "#C71585", "#20B2AA", "#D2691E",
                    "#FF7F50", "#9ACD32", "#6A5ACD", "#BA55D3", "#ADFF2F",
                    "#FFB6C1", "#7B68EE", "#48D1CC", "#F08080", "#87CEFA",
                    "#B0C4DE"
                ],
                hoverBackgroundColor: "rgba(75,192,192,0.9)",
                borderColor: "#fff",
                borderWidth: 2,
            },
        ],
    };


    return (
        <div className="relative mx-auto w-full rounded-lg bg-black p-6 shadow-lg dark:bg-gray-800">
            <h2 className="mb-4 text-center text-xl font-bold text-white dark:text-gray-200">
                {header}
            </h2>
            <div className="h-[400px] w-full">
                <Bar
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
                                    color: "#FFFFFF"
                                }
                            }
                        },
                        plugins: {
                            tooltip: {
                                callbacks: {
                                    label: (tooltipItem: any) => {
                                        const currentDataset = tooltipItem.dataset.data;
                                        const totalValues = currentDataset.reduce((sum: number, val: number) => sum + val, 0);
                                        const mean = (totalValues / currentDataset.length).toFixed(2);

                                        const value = tooltipItem.raw; 
                                        const percentage = ((value / total) * 100).toFixed(2);

                                        return `${tooltipItem.label}: ${percentage}% (Mean: ${mean})`;
                                    },
                                },
                            },

                            legend: {
                                display: true,
                                labels: {
                                    color: "#fff",
                                    font: { size: 12 },
                                    boxWidth: 20,
                                    padding: 10,
                                },
                            },
                        },
                        onClick: (_: ChartEvent, elements: ActiveElement[]) => {
                            if (elements.length > 0) {
                                const index = elements[0].index;
                                const selectedLabel = chartData.labels[index] as string;

                                if (!selectedCategory) {
                                    setSelectedCategory(selectedLabel);
                                } else if (!selectedYear) {
                                    setSelectedYear(selectedLabel);
                                } else if (!selectedMonth) {
                                    setSelectedMonth(selectedLabel);
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

export default BarChart;
