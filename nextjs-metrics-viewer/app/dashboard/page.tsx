'use client';

import React, { useState, useEffect } from "react";
import MetricsSummary from "@/components/Charts/MetricsSummary";
import TimeSeriesChart from "@/components/Charts/TimeSeriesChart";
import BarChart from "@/components/Charts/BarChart";
import PieChart from "@/components/Charts/PieChart";
import RadarChart from "@/components/Charts/RadarChart";
import { useWebSocket } from '@/context/WebSocketContext';
import { useSessionTimer } from "@/hooks/userSessionTimer";
import SessionTimeoutModal from "@/components/SessionTimeoutModal";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";



type Metric = {
    id: number;
    date: string;
    category: string;
    value: number;
};

type Summary = {
    total: number;
    average: number;
    max: number;
    min: number;
};

const DashboardPage = () => {
    const { token, role } = useAuth();
    const { showModal, timeLeft, renewSession, logout } = useSessionTimer(); // Usa el hook para el modal
    const { ws } = useWebSocket();
    const [metrics, setMetrics] = useState<Metric[]>([]);
    const [summary, setSummary] = useState<Summary>({
        total: 0,
        average: 0,
        max: 0,
        min: 0,
    });
    const [allCategories, setAllCategories] = useState<string[]>([]);
    const [loading, setLoading] = useState(true); // Nuevo estado de carga
    const [page, setPage] = useState<number>(1);
    const [limit] = useState<number>(50);
    const [totalPages, setTotalPages] = useState<number>(1);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();

    useEffect(() => {
        const checkAuth = async () => {
            const token = localStorage.getItem('token');

            if (!token) {
                router.push('/login');
                return;
            }

            try {
                const response = await fetch('/api/auth/me', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (response.ok) {
                    const data = await response.json();
                    if (data.user.role === 'regular' || data.user.role === 'admin') {
                        return; 
                    } else {
                        router.push('/403');
                    }
                } else {
                    router.push('/login');
                }
            } catch (error) {
                router.push('/login');
            }
        };

        checkAuth();
    }, [router]);

    const [filters, setFilters] = useState({
        startDate: "",
        endDate: new Date().toISOString().split("T")[0],
        category: "",
    });

    const fetchMetrics = async () => {
        setLoading(true);
        setError(null);
        try {
            const queryParams = new URLSearchParams({
                page: String(page),
                limit: String(limit),
            });

            if (filters.startDate) {
                queryParams.append('startDate', filters.startDate);
            }
            if (filters.endDate) {
                queryParams.append('endDate', filters.endDate);
            }
            if (filters.category) {
                queryParams.append('category', filters.category);
            }

            const response = await fetch(`/api/metrics?${queryParams.toString()}`, { cache: 'no-store' });
            if (!response.ok) {
                throw new Error(`Error fetching metrics: ${response.statusText}`);
            }
            const data = await response.json();

            setMetrics(data.data);
            setSummary(data.summary);
            setTotalPages(data.totalPages);
            setAllCategories(data.allCategories); 
        } catch (error: any) {
            console.error("Error fetching metrics:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };


    const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;

        setFilters((prev) => ({
            ...prev,
            [name]: value,
        }));
        setPage(1); 
    };




    useEffect(() => {
        fetchMetrics();
    }, [filters, page]);

    useEffect(() => {
        const handleDataUpdated = () => {
            fetchMetrics();
        };

        window.addEventListener('data-updated', handleDataUpdated);

        return () => {
            window.removeEventListener('data-updated', handleDataUpdated);
        };
    }, []);

    const handleMetricClick = (filter: string) => {
        console.log("Metric clicked:", filter);
    };


    return (
        <div className="container mx-auto p-4">
          
            {showModal && (
                <SessionTimeoutModal
                    onRenew={renewSession}
                    onLogout={logout}
                />
            )}
            <h1 className="mb-6 text-center text-3xl font-bold">Dashboard</h1>

            <div className="mb-6 flex flex-col gap-4 md:flex-row md:justify-center">
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    max={filters.endDate}
                    onChange={handleFilterChange}
                    className="rounded border px-4 py-2"
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    max={new Date().toISOString().split("T")[0]}
                    min={filters.startDate}
                    onChange={handleFilterChange}
                    className="rounded border px-4 py-2"
                />
                <select
                    name="category"
                    value={filters.category}
                    onChange={handleFilterChange}
                    className="rounded border px-4 py-2"
                >
                    <option value="">All Categories</option>
                    {allCategories.map((category) => (
                        <option key={category} value={category}>
                            {category}
                        </option>
                    ))}
                </select>
            </div>

            {loading ? (
                <p className="text-center">Loading...</p>
            ) : error ? (
                <p className="text-center text-red-500">{error}</p>
            ) : metrics.length === 0 ? (
                <p className="text-center text-gray-500">No data available</p>
            ) : (
                <>
                    <MetricsSummary summary={summary} onMetricClick={handleMetricClick} />

                    <div className="flex flex-col gap-6">
                        <TimeSeriesChart data={metrics} />

                        <BarChart data={metrics} />

                        <PieChart data={metrics} />

                        <RadarChart data={metrics} />
                    </div>


                </>
            )}
        </div>
    );

};

export default DashboardPage;
