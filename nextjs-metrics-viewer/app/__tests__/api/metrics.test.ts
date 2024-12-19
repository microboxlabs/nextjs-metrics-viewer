import { GET as metricsHandler } from "@/app/api/metrics/route";
import { NextRequest } from "next/server";

jest.mock("next/headers", () => ({
    cookies: jest.fn(() => ({
        get: jest.fn(() => ({ value: "mock-token" })), 
    })),
}));

describe("Metrics API", () => {
    it("should return metrics within a given date range", async () => {
        const url = new URL("http://localhost:3000/api/metrics");
        url.searchParams.append("startDate", "2023-01-01");
        url.searchParams.append("endDate", "2023-12-31");

        const request = new NextRequest(url.toString(), { method: "GET" });

        const response = await metricsHandler(request);
        expect(response.status).toBe(200);

        const json = await response.json();
        expect(Array.isArray(json.data)).toBe(true); 
        expect(json.data.length).toBeGreaterThan(0); 
    });

    it("should filter metrics by category", async () => {
        const url = new URL("http://localhost:3000/api/metrics");
        url.searchParams.append("category", "Sales");

        const request = new NextRequest(url.toString(), { method: "GET" });

        const response = await metricsHandler(request);
        expect(response.status).toBe(200);

        const json = await response.json();
        expect(json.data.every((item: { category: string }) => item.category === "Sales")).toBe(true);
    });
});
