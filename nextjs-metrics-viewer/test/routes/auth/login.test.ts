import { StatusCodes } from "http-status-codes";
import { POST } from "@/app/api/auth/[...nextauth]/route";
import { DatabaseConnection } from "@/lib/db";
import { users } from "@/lib/db/schemas/user";
import { UserFactory } from "@/test/factories/users";
import UserUtilities from "@/users/utilities";
import { eq } from "drizzle-orm";

jest.mock("next/server", () => ({
  NextResponse: {
    json: jest.fn((data, { status }) => ({
      json: () => data,
      status,
    })),
  },
}));

describe("POST /app/api/auth/[...nextauth]/route", () => {
  const mockUser = UserFactory.validUser().build();

  beforeAll(async () => {
    const db = DatabaseConnection.getInstance().db;
    await db.insert(users).values({
      ...mockUser,
      password: await UserUtilities.encryptPassword(mockUser.password),
    });
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  afterAll(async () => {
    const db = DatabaseConnection.getInstance().db;
    await db.delete(users).where(eq(users.email, mockUser.email));
  });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and user data on successful login", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({
        email: mockUser.email,
        password: mockUser.password,
      }),
    });

    const res = await POST(req);

    expect(res.status).toBe(StatusCodes.OK);
  });

  it("should return 400 when email or password is missing", async () => {
    const req = new Request("http://localhost/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: mockUser.email }),
    });

    const res = await POST(req);

    expect(res.status).toBe(StatusCodes.BAD_REQUEST);
  });
});
