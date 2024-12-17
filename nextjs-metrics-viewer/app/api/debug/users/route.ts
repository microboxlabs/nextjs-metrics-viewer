import { NextResponse } from "next/server";
import { initializeDatabase } from "@/lib/db";

export async function GET() {
    const db = await initializeDatabase();
    const users = await db.all("SELECT email, role FROM users");
    return NextResponse.json(users);
}
