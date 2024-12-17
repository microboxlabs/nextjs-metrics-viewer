import React from "react";

interface SummaryProps {
    summary: {
        total: number;
        average: number;
        max: number;
        min: number;
    };
    onMetricClick: (filter: string) => void;
}

const MetricsSummary: React.FC<SummaryProps> = ({ summary, onMetricClick }) => {
    const metricIcons: { [key: string]: string } = {
        total: "📊",
        average: "📈",
        max: "🔝",
        min: "🔻",
    };


    return (
        <div className="mb-6 grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-4">
            {Object.entries(summary).map(([key, value]) => (
                <div
                    key={key}
                    className="flex flex-col items-center justify-center rounded-lg bg-secondary p-4 text-center text-white shadow-md transition-transform duration-200 hover:scale-105 sm:w-full md:w-[200px]"
                    onClick={() => onMetricClick(key)}
                >
                    <span className="mb-2 text-4xl">{metricIcons[key] || "📌"}</span>
                    <p className="text-lg font-semibold capitalize">{key}</p>
                    <p className="text-3xl font-bold">{value.toFixed(2)}</p>
                </div>
            ))}
        </div>
    );
};

export default MetricsSummary;
