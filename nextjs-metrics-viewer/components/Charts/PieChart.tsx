import React, { useState } from "react";
import { Pie } from "react-chartjs-2";
import { Chart, ChartEvent, ActiveElement, ArcElement, Tooltip, Legend } from "chart.js";

Chart.register(ArcElement, Tooltip, Legend);

interface PieChartProps {
    data: { category: string; value: number; date: string }[];
}

const PieChart: React.FC<PieChartProps> = ({ data }) => {
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
            if (groupBy === "year") return true;
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
        return Object.fromEntries(sortedEntries);
    };





    let groupedData: Record<string, number> = {};
    let header = "Category Distribution";

    if (!selectedCategory) {
        groupedData = groupData("category");
    } else if (!selectedYear) {
        groupedData = groupData("year");
        header = `Yearly Distribution for ${selectedCategory}`;
    } else if (!selectedMonth) {
        groupedData = groupData("month");
        header = `Monthly Distribution for ${selectedYear}`;
    } else {
        groupedData = groupData("day");
        header = `Daily Distribution for ${selectedMonth}`;
    }

    const total = Object.values(groupedData).reduce((sum, value) => sum + value, 0);

    const chartData = {
        labels: Object.keys(groupedData),
        datasets: [
            {
                data: Object.values(groupedData),
                backgroundColor: [
                    "#FF6384", "#36A2EB", "#FFCE56", "#3CA6A6", "#E4572E",
                    "#8A89C0", "#D45087", "#FFA600", "#F95D6A", "#00CED1",
                    "#6495ED", "#1E90FF", "#FF4500", "#FF1493", "#32CD32",
                    "#FFD700", "#8B4513", "#C71585", "#20B2AA", "#D2691E",
                    "#FF7F50", "#9ACD32", "#6A5ACD", "#BA55D3", "#ADFF2F",
                    "#FFB6C1", "#7B68EE", "#48D1CC", "#F08080", "#87CEFA",
                    "#B0C4DE"
                ],

                borderColor: "#fff",
                borderWidth: 2,
                hoverOffset: 10,
            },
        ],
    };

    const chartOptions = {
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
            renderPercentage: !selectedMonth && !selectedYear, 
        },
        responsive: true,
        maintainAspectRatio: false,
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
    };



    const renderPercentagePlugin = {
        id: "renderPercentage",
        afterDraw: (chart: any) => {
            const ctx = chart.ctx;
            const dataset = chart.data.datasets[0];
            const meta = chart.getDatasetMeta(0);

            const isCategoryLevel = !selectedCategory;
            const isYearLevel = selectedCategory && !selectedYear; 

            if (!isCategoryLevel && !isYearLevel) return;

            const total = dataset.data.reduce((sum: number, value: number) => sum + value, 0);

            meta.data.forEach((element: any, index: number) => {
                const value = dataset.data[index];
                const percentage = ((value / total) * 100).toFixed(1);

                const { x, y } = element.tooltipPosition();

                ctx.save();
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 12px Arial";
                ctx.textAlign = "center";
                ctx.textBaseline = "middle";

                ctx.fillText(`${percentage}%`, x, y);
                ctx.restore();
            });
        },
    };





    Chart.register(renderPercentagePlugin);

    return (
        <div className="relative mx-auto w-full rounded-lg bg-black p-6 shadow-lg">
            <h2 className="mb-4 text-center text-2xl font-bold text-white">{header}</h2>

            <div className="h-[500px] w-full">
                <Pie data={chartData} options={chartOptions} />
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

export default PieChart;
