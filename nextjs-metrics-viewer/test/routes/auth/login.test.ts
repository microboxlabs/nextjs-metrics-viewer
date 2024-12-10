/**
 * @jest-environment node
 */
import { createMocks, RequestMethod } from "node-mocks-http";
import type { NextApiRequest } from "next";
import { POST } from "@/app/api/auth/[...nextauth]/route";
import { AppError } from "@/lib/errors";
import { UserFactory } from "@/test/factories/users";

const mockUser = UserFactory.validUser().build();

jest.mock("@/lib/db", () => ({
  DatabaseConnection: {
    getInstance: jest.fn(() => {
      const instance = {};
      Object.defineProperty(instance, "db", {
        get: jest.fn(() => ({
          query: jest.fn().mockResolvedValue([]),
        })),
      });
      return instance;
    }),
  },
}));

jest.mock("@/app/api/auth/[...nextauth]/services/login", () => ({
  LoginService: jest.fn().mockImplementation(() => ({
    perform: jest.fn().mockResolvedValue({
      user: mockUser,
      token: "mockToken",
    }),
  })),
}));

describe("POST /api/auth/login", () => {
  function mockRequestResponse(method: RequestMethod = "POST") {
    const { req, res }: { req: NextApiRequest; res: any } = createMocks({
      method,
    });
    req.headers = {
      "Content-Type": "application/json",
    };
    return { req, res };
  }

  it("should authenticate user with valid credentials", async () => {
    const { req, res } = mockRequestResponse();
    req.body = { email: mockUser.email, password: mockUser.password };

    await POST(req, res);

    expect(res._getStatusCode()).toBe(200);
  });

  it("should return 400 if credentials are missing", async () => {
    const { req, res } = mockRequestResponse();
    req.body = {};

    await POST(req, res);

    expect(res._getStatusCode()).toBe(400);
  });

  it("should return 500 if an internal error occurs", async () => {
    jest.spyOn(console, "error").mockImplementation(() => {});

    const mockLoginService = jest.requireMock(
      "@/app/api/auth/[...nextauth]/services/login",
    ).LoginService;
    mockLoginService.mockImplementationOnce(() => {
      throw new AppError("Internal Server Error", 500);
    });

    const { req, res } = mockRequestResponse();
    req.body = { email: mockUser.email, password: mockUser.password };

    await POST(req, res);

    expect(res._getStatusCode()).toBe(500);
    jest.restoreAllMocks();
  });
});
