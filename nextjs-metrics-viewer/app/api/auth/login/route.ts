import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import { initializeDatabase } from "@/lib/db";

const SECRET_KEY = "your-secret-key";


export async function POST(req: Request) {
    const { email, password } = await req.json();

    if (!email || !password) {
        return NextResponse.json({ message: "Email and password are required" }, { status: 400 });
    }

    const db = await initializeDatabase();
    const user = await db.get("SELECT * FROM users WHERE email = ?", [email]);

    if (!user || !(await bcrypt.compare(password, user.password))) {
        return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const tokenData = { id: user.id, role: user.role };
    const newToken = jwt.sign(tokenData, SECRET_KEY, { expiresIn: "2m" });

    const response = NextResponse.json({
        message: "Login successful",
        token: newToken, 
    });

    response.cookies.set("token", newToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 120,
    });

    return response;
}

