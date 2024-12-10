/**
 * @jest-environment node
 */
import { POST } from "@/app/api/auth/[...nextauth]/route";
import { createMocks } from "node-mocks-http";

jest.mock("@/lib/db", () => ({
  DatabaseConnection: {
    getInstance: jest.fn(() => ({
      db: {
        collection: jest.fn(),
      },
    })),
  },
}));

jest.mock("@/app/api/auth/[...nextauth]/services/login", () => ({
  LoginService: jest.fn().mockImplementation(() => ({
    perform: jest.fn(() =>
      Promise.resolve({
        user: {
          id: "user-id",
          firstName: "John",
          lastName: "Doe",
          email: "test@example.com",
          isActive: true,
          role: "user",
        },
        token: "mocked-token",
      }),
    ),
  })),
}));

describe("POST /api/auth/login", () => {
  it("should authenticate user with valid credentials", async () => {
    const { req, res } = createMocks({
      method: "POST",
      body: {
        email: "test@example.com",
        password: "valid-password",
      },
      headers: {
        "Content-Type": "application/json",
      },
    });

    await POST(req, res);

    expect(res._getStatusCode()).toBe(200);
  });
});
