import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { username, password, role } = body;

    if (!username || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newAdmin = await prisma.admin.create({
      data: { username, password: hashedPassword, role }
    });

    return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
  } catch (error: any) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
