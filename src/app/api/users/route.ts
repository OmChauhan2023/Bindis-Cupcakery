import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import UserModel from "@/models/User";  // Ensure correct import

export async function POST(req: Request) {
  try {
    console.log("Connecting to database...");
    await connectDB(); // Ensure DB connection

    const body = await req.json();
    console.log("Received data:", body);

    const { name, email, phone } = body;

    if (!name || !email || !phone) {
      console.warn("Validation error: Missing fields");
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const existingUser = await UserModel.findOne({ email });
    if (existingUser) {
      console.warn(`User with email ${email} already exists`);
      return NextResponse.json({ message: "Email already in use" }, { status: 400 });
    }

    const newUser = new UserModel({ name, email, phone });
    const savedUser = await newUser.save();

    console.log("User created successfully:", savedUser);

    return NextResponse.json({ message: "User created successfully", user: savedUser }, { status: 201 });

  } catch (error: unknown) {
    console.error("Error creating user:", error);

    return NextResponse.json(
      { message: "Error creating user", error: error.message || error },
      { status: 500 }
    );
  }
}
