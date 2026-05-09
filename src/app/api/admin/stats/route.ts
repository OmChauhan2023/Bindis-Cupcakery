import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";
import { categoryFor } from "@/lib/categories";

export async function GET(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const [
      products,
      orders,
      customers,
      reviewsCount,
      revenueAgg,
      pendingOrders,
      recentOrders,
      recentReviews,
      orderItems,
      allProducts,
    ] = await Promise.all([
      prisma.product.count(),
      prisma.order.count(),
      prisma.user.count(),
      prisma.review.count(),
      prisma.order.aggregate({ _sum: { total: true } }),
      prisma.order.count({ where: { status: "pending" } }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { name: true } },
          items: { select: { id: true } },
        },
      }),
      prisma.review.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: {
          user: { select: { name: true } },
          product: { select: { name: true } },
        },
      }),
      prisma.orderItem.findMany({
        select: { productId: true, quantity: true, price: true },
      }),
      prisma.product.findMany({ select: { id: true, name: true, image: true } }),
    ]);

    // Top products by units sold
    const productMap = new Map(allProducts.map((p) => [p.id, p]));
    const aggMap = new Map<number, { units: number; revenue: number }>();
    orderItems.forEach((it) => {
      const cur = aggMap.get(it.productId) || { units: 0, revenue: 0 };
      cur.units += it.quantity;
      cur.revenue += it.quantity * it.price;
      aggMap.set(it.productId, cur);
    });
    const topProducts = Array.from(aggMap.entries())
      .map(([productId, agg]) => {
        const p = productMap.get(productId);
        return p
          ? { id: p.id, name: p.name, image: p.image, units: agg.units, revenue: agg.revenue }
          : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    // Category breakdown
    const catCounts: Record<string, number> = {};
    allProducts.forEach((p) => {
      const c = categoryFor(p.name);
      catCounts[c] = (catCounts[c] || 0) + 1;
    });
    const categoryBreakdown = Object.entries(catCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return NextResponse.json({
      products,
      orders,
      customers,
      reviews: reviewsCount,
      revenue: revenueAgg._sum.total || 0,
      pendingOrders,
      recentOrders: recentOrders.map((o) => ({
        id: o.id,
        customer: o.user.name,
        total: o.total,
        status: o.status,
        itemCount: o.items.length,
        createdAt: o.createdAt,
      })),
      recentReviews: recentReviews.map((r) => ({
        id: r.id,
        rating: r.rating,
        comment: r.comment,
        customer: r.user.name,
        product: r.product.name,
        createdAt: r.createdAt,
      })),
      topProducts,
      categoryBreakdown,
    });
  } catch (error) {
    return NextResponse.json({ message: "Error", error: (error as Error).message }, { status: 500 });
  }
}
