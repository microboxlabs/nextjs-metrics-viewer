import React, { useState } from "react";
import { Radar } from "react-chartjs-2";
import {
    Chart as ChartJS,
    RadialLinearScale,
    PointElement,
    LineElement,
    Filler,
    Tooltip,
    Legend,
    ChartEvent, ActiveElement
} from "chart.js";

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface RadarChartProps {
    data: { category: string; value: number; date: string }[];
}

const RadarChart: React.FC<RadarChartProps> = ({ data }) => {
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

    if (selectedCategory && !selectedYear) {
        groupedData = groupData("year"); 
        header = `Yearly Breakdown for ${selectedCategory}`;
    } else if (selectedYear && !selectedMonth) {
        groupedData = groupData("month"); 
        header = `Monthly Breakdown for ${selectedYear}`;
    } else if (selectedMonth) {
        groupedData = groupData("day"); 
        header = `Daily Breakdown for ${selectedMonth}`;
    } else {
        groupedData = groupData("category"); 
    }

    const total = Object.values(groupedData).reduce((sum, val) => sum + val, 0);


    const radarData = {
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
                data: Object.values(groupedData).map((val) => (val / total) * 100),
                backgroundColor: "fff", 
                borderColor: "#FF5733", 
                pointBackgroundColor: [
                    "#333333",
                ],
                pointBorderColor: "#333333",
                pointRadius: 6, 
                borderWidth: 2, 
            },
        ],
    };


    return (
        <div className="relative mx-auto w-full rounded-lg bg-black p-6 shadow-lg">
            <h2 className="mb-4 text-center text-2xl font-bold text-white">{header}</h2>

            <div className="h-[500px] w-full">
                <Radar
                    data={radarData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        scales: {
                            r: {
                                grid: {
                                    color: "rgba(255, 255, 255, 0.1)",
                                },
                                angleLines: {
                                    color: "rgba(255, 255, 255, 0.3)", 
                                },
                                ticks: {
                                    display: false, 
                                },
                                pointLabels: {
                                    color: "#FFD700", 
                                    font: {
                                        size: 14, 
                                        weight: "bold",
                                    },
                                },
                            },
                        },
                        plugins: {
                            tooltip: {
                                backgroundColor: "rgba(0, 0, 0, 0.8)", 
                                titleColor: "#FFD700", 
                                bodyColor: "#FF5733", 
                                callbacks: {
                                    label: (tooltipItem: any) => {
                                        const percentage = tooltipItem.raw ?? 0;
                                        return `${tooltipItem.label}: ${percentage.toFixed(1)}%`;
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
                        onClick: (_, elements) => {
                            if (elements && elements.length > 0) {
                                const index = elements[0].index;
                                const label = radarData.labels[index];
                                if (!selectedCategory) setSelectedCategory(label);
                                else if (!selectedYear) setSelectedYear(label);
                                else if (!selectedMonth) setSelectedMonth(label);
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
                    ? "Showing detailed daily values."
                    : selectedYear
                        ? "Click on a month to view its daily breakdown."
                        : selectedCategory
                            ? "Click on a year to view monthly breakdown."
                            : "Click on a category to view yearly breakdown."}
            </p>
        </div>
    );
};

export default RadarChart;
