import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const { username, password } = await req.json();
    if (!username || !password) {
      return NextResponse.json({ message: "Username and password are required" }, { status: 400 });
    }

    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    const isValidPassword = await bcrypt.compare(password, admin.password);
    if (!isValidPassword) {
      return NextResponse.json({ message: "Invalid credentials" }, { status: 401 });
    }

    // Generate JWT token
    const token = jwt.sign({ id: admin.id, role: admin.role }, process.env.JWT_SECRET!, {
      expiresIn: "1h",
    });

    const response = NextResponse.json({ message: "Login successful" });
    response.cookies.set("adminToken", token, {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 3600,
    });

    return response;
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
