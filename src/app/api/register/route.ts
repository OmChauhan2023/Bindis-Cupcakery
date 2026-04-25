import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectDB } from "@/lib/mongodb";
import Admin from '@/models/admin';

export async function POST(req: NextRequest) {
  try {
    await connectDB();

    // Log incoming request body
    const body = await req.json();
    console.log("Incoming Request Body:", body);

    const { username, password, role } = body;

    // Check if password is missing
    if (!username || !password || !role) {
      return NextResponse.json({ message: "Missing required fields" }, { status: 400 });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create and save admin
    const newAdmin = new Admin({ username, password: hashedPassword, role });
    await newAdmin.save();

    return NextResponse.json({ message: "Admin created successfully" }, { status: 201 });
  } catch (error) {
    console.error("Error creating admin:", error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}
