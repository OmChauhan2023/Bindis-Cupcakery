import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({ message: "Database connected successfully" });
  } catch (error: any) {
    console.error("Database connection error:", error);
    return NextResponse.json({ message: "Database connection failed", error: error.message }, { status: 500 });
  }
}
