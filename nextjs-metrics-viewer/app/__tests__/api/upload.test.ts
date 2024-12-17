import { POST as uploadHandler } from "@/app/api/upload/route";
import { NextRequest } from "next/server";
import fs from "fs";
import path from "path";
import jwt from "jsonwebtoken";


jest.mock("@/lib/db", () => ({
    initializeDatabase: jest.fn(() => ({
        exec: jest.fn(async () => Promise.resolve(true)),
        run: jest.fn(async () => Promise.resolve(true)), 
    })),
}));

jest.mock("axios", () => ({
    post: jest.fn(() => Promise.resolve({ status: 200 })),
}));

beforeAll(() => {
    jest.spyOn(console, "error").mockImplementation(() => { });
    jest.spyOn(console, "warn").mockImplementation(() => { });
});

afterAll(() => {
    (console.error as jest.Mock).mockRestore();
    (console.warn as jest.Mock).mockRestore();
});

describe("Upload API", () => {
    it("should return 200 for valid CSV upload", async () => {
        const filePath = path.join(__dirname, "__mocks__/metrics-test.csv");

        // Asegurar que el archivo existe
        if (!fs.existsSync(filePath)) {
            fs.mkdirSync(path.dirname(filePath), { recursive: true });
            fs.writeFileSync(
                filePath,
                "Date,Category,Value\n2024-03-01,Marketing,521.01\n2024-07-19,Expenses,609.25"
            );
        }

        const token = jwt.sign({ role: "admin" }, "your-secret-key", { expiresIn: "1h" });

        const boundary = "boundary123";
        const csvContent = fs.readFileSync(filePath, "utf-8");
        const body = Buffer.from(
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="file"; filename="metrics-test.csv"\r\n` +
            `Content-Type: text/csv\r\n\r\n` +
            csvContent +
            `\r\n--${boundary}--`
        );

        const request = new NextRequest("http://localhost:3000/api/upload", {
            method: "POST",
            headers: {
                "Content-Type": `multipart/form-data; boundary=${boundary}`,
                "Authorization": `Bearer ${token}`,
                "Content-Length": body.length.toString(),
            },
            body: body, 
        });

        const response = await uploadHandler(request);

        expect(response.status).toBe(200);
        const json = await response.json();
        expect(json.message).toBe("File uploaded and data stored successfully");
    });

    it("should return 400 if no file is uploaded", async () => {
        const request = new NextRequest("http://localhost:3000/api/upload", { method: "POST" });

        const response = await uploadHandler(request);
        expect(response.status).toBe(400);

        const json = await response.json();
        expect(json.message).toBe("No file provided");
    });

    it("should return 500 for invalid CSV format", async () => {
        const invalidFilePath = path.join(__dirname, "__mocks__/invalid-metrics.csv");

        if (!fs.existsSync(invalidFilePath)) {
            fs.mkdirSync(path.dirname(invalidFilePath), { recursive: true });
            fs.writeFileSync(invalidFilePath, "InvalidHeader,Category,Value\n2023-01-01,Sales,100");
        }

        const boundary = "boundary";
        const body =
            `--${boundary}\r\n` +
            `Content-Disposition: form-data; name="file"; filename="invalid-metrics.csv"\r\n` +
            `Content-Type: text/csv\r\n\r\n` +
            fs.readFileSync(invalidFilePath, "utf-8") +
            `\r\n--${boundary}--`;

        const request = new NextRequest("http://localhost:3000/api/upload", {
            method: "POST",
            headers: {
                "Content-Type": `multipart/form-data; boundary=${boundary}`,
            },
            body: Buffer.from(body),
        });

        const response = await uploadHandler(request);
        expect(response.status).toBe(500);

        const json = await response.json();
        expect(json.message).toBe("Error processing file");
    });
});
