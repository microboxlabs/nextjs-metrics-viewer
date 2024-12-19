import { NextResponse } from 'next/server';
import { initializeDatabase } from '@/lib/db';

export const dynamic = 'force-dynamic';

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

type MetricsResponse = {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    summary: Summary;
    data: Metric[];
    allCategories: string[];
};

export async function GET(req: Request) {
    const db = await initializeDatabase();
    const url = new URL(req.url);
    const startDate = url.searchParams.get('startDate');
    const endDate = url.searchParams.get('endDate');
    const category = url.searchParams.get('category');
    const page = parseInt(url.searchParams.get('page') || '1', 10);
    const limit = parseInt(url.searchParams.get('limit') || '50', 10);
    const offset = (page - 1) * limit;

    let baseQuery = 'FROM metrics WHERE 1=1';
    const params: any[] = [];

    if (startDate) {
        baseQuery += ' AND date >= ?';
        params.push(startDate);
    }

    if (endDate) {
        baseQuery += ' AND date <= ?';
        params.push(endDate);
    }

    if (category) {
        baseQuery += ' AND category = ?';
        params.push(category);
    }

    const summaryQuery = `SELECT COUNT(*) as count, AVG(value) as average, MAX(value) as max, MIN(value) as min ${baseQuery}`;
    const summaryResult = await db.get<{ count: number; average: number; max: number; min: number }>(summaryQuery, params);
    const total = summaryResult?.count || 0;
    const average = summaryResult?.average || 0;
    const max = summaryResult?.max || 0;
    const min = summaryResult?.min || 0;
    const totalPages = Math.ceil(total / limit);

    const paginatedQuery = `SELECT id, date, category, value ${baseQuery} ORDER BY date DESC LIMIT ? OFFSET ?`;
    const paginatedParams = [...params, limit, offset];
    let metrics: Metric[] = [];

    try {
        metrics = await db.all<Metric[]>(paginatedQuery, paginatedParams);
    } catch (error) {
        console.error('Error fetching metrics:', error);
        return NextResponse.json(
            { message: 'Error fetching metrics', error: String(error) },
            { status: 500 }
        );
    }

    let allCategories: string[] = [];
    try {
        const categoriesQuery = `SELECT DISTINCT category FROM metrics ORDER BY category ASC`;
        const categoriesResult = await db.all<{ category: string }[]>(categoriesQuery);
        allCategories = categoriesResult.map(item => item.category);
    } catch (error) {
        console.error('Error fetching categories:', error);
    }

    const summary: Summary = {
        total,
        average,
        max,
        min,
    };

    const response: MetricsResponse = {
        page,
        limit,
        total,
        totalPages,
        summary,
        data: metrics,
        allCategories,
    };

    return NextResponse.json(response);
}
