// lib/db.ts
import sqlite3 from 'sqlite3';
import { open, Database } from 'sqlite';
import path from 'path';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

dotenv.config();

let db: Database | null = null;

const dbPath = path.join(process.cwd(), 'database.sqlite');

export const initializeDatabase = async (): Promise<Database> => {
    if (!db) {
        try {
            db = await open({
                filename: dbPath,
                driver: sqlite3.Database,
            });

            await db.exec(`PRAGMA journal_mode = WAL;`);
            await db.exec(`PRAGMA synchronous = NORMAL;`);
            await db.exec(`PRAGMA temp_store = MEMORY;`);
            await db.exec(`PRAGMA cache_size = 10000;`);

            await db.exec(`
                CREATE TABLE IF NOT EXISTS metrics (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    date TEXT NOT NULL,
                    category TEXT NOT NULL,
                    value REAL NOT NULL
                );
            `);

            await db.exec(`CREATE INDEX IF NOT EXISTS idx_metrics_date ON metrics(date);`);
            await db.exec(`CREATE INDEX IF NOT EXISTS idx_metrics_category ON metrics(category);`);
            await db.exec(`CREATE INDEX IF NOT EXISTS idx_metrics_date_category ON metrics(date, category);`);

            await db.exec(`
                CREATE TABLE IF NOT EXISTS users (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    email TEXT NOT NULL UNIQUE,
                    password TEXT NOT NULL,
                    role TEXT NOT NULL CHECK(role IN ('admin', 'regular'))
                );
            `);
        } catch (error) {
            console.error('Error initializing database:', error);
            throw error;
        }
    }

    return db;
};

export async function closeDatabase() {
    if (db) {
        await db.close();
        db = null;
        console.log('Database connection closed.');
    }
}

export const getDatabase = (): Database | null => db;

export const createUser = async (email: string, password: string, role: 'admin' | 'regular') => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    await db.run(
        `INSERT INTO users (email, password, role) VALUES (?, ?, ?)`,
        [email, hashedPassword, role]
    );
};

export const verifyUser = async (email: string, password: string): Promise<boolean> => {
    if (!db) {
        throw new Error('Database not initialized');
    }
    const user = await db.get(`SELECT * FROM users WHERE email = ?`, [email]);
    if (!user) return false;
    return await bcrypt.compare(password, user.password);
};
