import { NextResponse } from "next/server";
import { cookies } from "next/headers"; 
import bcrypt from "bcrypt";
import { initializeDatabase } from "@/lib/db";

export async function POST(req: Request) {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;
    if (token) {
        return NextResponse.json({ message: "Already logged in" }, { status: 403 });
    }

    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
        return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    if (!["admin", "regular"].includes(role)) {
        return NextResponse.json({ message: "Invalid role" }, { status: 400 });
    }

    const db = await initializeDatabase();
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const existingUser = await db.get("SELECT id FROM users WHERE email = ?", [email]);
        if (existingUser) {
            return NextResponse.json(
                { message: "User already exists" },
                { status: 400 }
            );
        }

        await db.run(
            "INSERT INTO users (email, password, role) VALUES (?, ?, ?)",
            [email, hashedPassword, role]
        );
        return NextResponse.json({ message: "User registered successfully" });
    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json(
            { message: "Internal Server Error", error: String(error) },
            { status: 500 }
        );
    }
}
