import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import { initializeDatabase } from "@/lib/db";

const SECRET_KEY = "your-secret-key";

export async function GET() {
    const cookieStore = cookies();
    const token = cookieStore.get("token")?.value;

    if (!token) {
        return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    try {
        const decoded: any = jwt.verify(token, SECRET_KEY);

        const db = await initializeDatabase();
        const user = await db.get("SELECT id, email, role FROM users WHERE id = ?", [
            decoded.id,
        ]);

        if (!user) {
            return NextResponse.json({ message: "User not found" }, { status: 404 });
        }

        const newToken = jwt.sign({ id: user.id, role: user.role }, SECRET_KEY, { expiresIn: "2m" });


        const response = NextResponse.json({ user, token: newToken });
        response.cookies.set("token", newToken, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            path: "/",
            maxAge: 120, 
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { message: "Invalid or expired token" },
            { status: 401 }
        );
    }
}
