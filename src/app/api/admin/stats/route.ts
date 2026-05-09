import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const [products, orders, customers, reviews, revenueAgg] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.review.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
    ]);
    return NextResponse.json({
      products,
      orders,
      customers,
      reviews,
      revenue: revenueAgg._sum.total || 0,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error", error: (error as Error).message }, { status: 500 });
  }
}
