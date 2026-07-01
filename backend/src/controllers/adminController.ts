import { Request, Response } from 'express';
import prisma from '../config/db';
import { categoryFor } from '../utils/categories';

// @desc    Get admin dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
export const getStats = async (req: Request, res: Response) => {
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
      prisma.order.count({ where: { status: 'pending' } }),
      prisma.order.findMany({
        orderBy: { createdAt: 'desc' },
        take: 5,
        include: {
          user: { select: { name: true } },
          items: { select: { id: true } },
        },
      }),
      prisma.review.findMany({
        orderBy: { createdAt: 'desc' },
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

    const catCounts: Record<string, number> = {};
    allProducts.forEach((p) => {
      const c = categoryFor(p.name);
      catCounts[c] = (catCounts[c] || 0) + 1;
    });
    const categoryBreakdown = Object.entries(catCounts)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count);

    return res.json({
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
  } catch (error: any) {
    console.error('Stats error:', error);
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};

// @desc    Get all customers (Admin)
// @route   GET /api/admin/customers
// @access  Private/Admin
export const getCustomers = async (req: Request, res: Response) => {
  try {
    const customers = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        _count: { select: { orders: true, reviews: true } },
        orders: { select: { total: true } },
      },
    });
    const enriched = customers.map((c) => ({
      id: c.id,
      name: c.name,
      email: c.email,
      phone: c.phone,
      createdAt: c.createdAt,
      orderCount: c._count.orders,
      reviewCount: c._count.reviews,
      totalSpent: c.orders.reduce((s, o) => s + o.total, 0),
    }));
    return res.json({ customers: enriched });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};
