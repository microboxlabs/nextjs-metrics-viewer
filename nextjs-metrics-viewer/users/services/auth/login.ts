import { DatabaseConnectionHandler } from "@/lib/db";
import { users } from "@/lib/db/schemas/user";
import { UnauthorizedError } from "@/lib/errors";
import { UserModel, UserRole } from "@/users/model";
import UserUtilities from "@/users/utilities";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export class UserAuthLoginService {
  private readonly __db: DatabaseConnectionHandler;
  private readonly __email: string;
  private readonly __password: string;
  private readonly __jwtSecret = process.env.JWT_SECRET;

  constructor(email: string, password: string, db: DatabaseConnectionHandler) {
    this.__email = email;
    this.__password = password;
    this.__db = db;
  }

  async perform() {
    const [user] = await this.__db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        password: users.password,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(users)
      .where(eq(users.email, this.__email))
      .execute();

    if (!user) throw new UnauthorizedError("Invalid email or password");

    const isValidPassword = await UserUtilities.verifyPassword({
      hashedPassword: user.password,
      inputPassword: this.__password,
    });

    if (!isValidPassword)
      throw new UnauthorizedError("Invalid email or password");

    const token = jwt.sign(
      {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
      },
      this.__jwtSecret!,
      { expiresIn: "24h" },
    );

    return {
      user: new UserModel({
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role as UserRole,
        isActive: user.isActive,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }),
      token,
    };
  }
}
