import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";

export type DatabaseConnectionHandler = ReturnType<typeof drizzle>;

export class DatabaseConnection {
  private static __databaseConnection: DatabaseConnection | null = null;
  private readonly _db: DatabaseConnectionHandler;

  // We use the singleton pattern to ensure that we only have one instance of the database connection,
  // so we don't have to open a new connection every time we want to interact with the database.
  // This is important because opening a new connection could be an expensive operation.
  private constructor(databaseUrl: string) {
    const sqlite = new Database(databaseUrl);

    this._db = drizzle(sqlite);
  }

  static getInstance() {
    if (!DatabaseConnection.__databaseConnection)
      DatabaseConnection.__databaseConnection = new DatabaseConnection(
        process.env.DATABASE_URL || "../../../database.sqlite",
      );
    return DatabaseConnection.__databaseConnection;
  }

  get db() {
    return this._db;
  }
}
