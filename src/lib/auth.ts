import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export interface AdminPayload {
  id: number;
  role: string;
}

export function verifyAdmin(req: NextRequest): AdminPayload | null {
  try {
    const token = req.cookies.get("adminToken")?.value;
    if (!token) return null;
    const payload = jwt.verify(token, process.env.JWT_SECRET!) as AdminPayload;
    if (!payload || payload.role !== "admin") return null;
    return payload;
  } catch {
    return null;
  }
}

export function requireAdmin(req: NextRequest) {
  const admin = verifyAdmin(req);
  if (!admin) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  return null;
}
