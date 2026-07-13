import { NextResponse } from "next/server";
import bcrypt from "bcryptjs"; // npm install bcryptjs

export async function POST(req) {
    try {
        const { username, email, password } = await req.json();

        if (!username || !email || !password) {
            return NextResponse.json({ message: "Missing fields" }, { status: 400 });
        }

        // for database guy, please update the line number 13 and 22
        const existingUser = await yourDatabase.findUserByUsername(username);
        if (existingUser) {
            return NextResponse.json({ message: "Username is already taken" }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(password, 12);

        await yourDatabase.createNewUser({
            username,
            email,
            passwordHash: hashedPassword,
        });

        return NextResponse.json({ message: "User registered successfully!" }, { status: 201 });

    } catch (error) {
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
