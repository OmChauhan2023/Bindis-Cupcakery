import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });
    return NextResponse.json({ orders });
  } catch (error) {
    return NextResponse.json({ message: "Error", error: (error as Error).message }, { status: 500 });
  }
}
