import { DatabaseConnectionHandler } from "@/lib/db";
import { users } from "@/lib/db/schemas/user";
import { NewUser, UserModel, UserRole } from "@/users/model";
import UserUtilities from "@/users/utilities";
import { eq } from "drizzle-orm";
import jwt from "jsonwebtoken";

export class UserAuthRegisterService {
  private readonly __db: DatabaseConnectionHandler;
  private readonly __user: NewUser;
  private readonly __jwtSecret = process.env.JWT_SECRET;

  constructor(user: NewUser, db: DatabaseConnectionHandler) {
    this.__user = user;
    this.__db = db;
  }

  async perform() {
    const existingUser = await this.__db
      .select()
      .from(users)
      .where(eq(users.email, this.__user.email))
      .execute();
    if (existingUser.length) throw new Error("User already exists");

    const hashedPassword = await UserUtilities.encryptPassword(
      this.__user.password!,
    );

    const [user] = await this.__db
      .insert(users)
      .values({ ...this.__user, password: hashedPassword })
      .returning({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        role: users.role,
        isActive: users.isActive,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      });

    const token = jwt.sign(
      { id: user.id, email: user.email },
      this.__jwtSecret!,
      { expiresIn: "24h" },
    );

    return {
      user: new UserModel({
        ...user,
        role: user.role as UserRole,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
      }),
      token,
    };
  }
}
