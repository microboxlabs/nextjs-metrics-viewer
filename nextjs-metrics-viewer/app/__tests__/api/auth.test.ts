import { POST as loginHandler } from "@/app/api/auth/login/route";
import { NextRequest } from "next/server";
import bcrypt from "bcrypt";

jest.mock("@/lib/db", () => ({
    initializeDatabase: jest.fn(() => ({
        get: jest.fn(async (query: string, params: any[]) => {
            if (params[0] === "admin@example.com") {
                return {
                    id: 1,
                    email: "admin@example.com",
                    password: bcrypt.hashSync("Password@123", 10), 
                    role: "admin",
                };
            }
            return null;
        }),
    })),
}));

jest.mock("jsonwebtoken", () => ({
    sign: jest.fn(() => "mock-jwt-token"), 
}));

jest.mock("next/headers", () => ({
    cookies: jest.fn(() => ({
        get: jest.fn(() => null),
    })),
}));

describe("Auth API", () => {
    it("should return 400 if email or password is missing", async () => {
        const request = new NextRequest("http://localhost:3000/api/auth/login", {
            method: "POST",
            body: JSON.stringify({ email: "test@example.com" }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await loginHandler(request);
        expect(response.status).toBe(400);

        const json = await response.json();
        expect(json.message).toBe("Email and password are required");
    });

    it("should return 401 if credentials are invalid", async () => {
        const request = new NextRequest("http://localhost:3000/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: "admin@example.com",
                password: "InvalidPassword@123",
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await loginHandler(request);
        expect(response.status).toBe(401);

        const json = await response.json();
        expect(json.message).toBe("Invalid credentials");
    });

    it("should return 200 and token if credentials are valid", async () => {
        const request = new NextRequest("http://localhost:3000/api/auth/login", {
            method: "POST",
            body: JSON.stringify({
                email: "admin@example.com",
                password: "Password@123",
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const response = await loginHandler(request);
        expect(response.status).toBe(200);

        const json = await response.json();
        expect(json.message).toBe("Login successful");
        expect(json.token).toBeDefined(); 
        expect(json.token).toBe("mock-jwt-token"); 
    });
});
