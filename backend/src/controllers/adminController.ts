import { Request, Response } from 'express';
import Product from '../models/Product';
import Order from '../models/Order';
import User from '../models/User';
import Review from '../models/Review';
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
      allProducts,
      itemAgg,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments(),
      Review.countDocuments(),
      Order.aggregate([{ $group: { _id: null, total: { $sum: '$total' } } }]),
      Order.countDocuments({ status: 'pending' }),
      Order.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name').lean(),
      Review.find().sort({ createdAt: -1 }).limit(5).populate('user', 'name').populate('product', 'name').lean(),
      Product.find().select('name image category').lean(),
      Order.aggregate([
        { $unwind: '$items' },
        {
          $group: {
            _id: '$items.productId',
            units: { $sum: '$items.quantity' },
            revenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          },
        },
      ]),
    ]);

    const productMap = new Map(allProducts.map((p) => [p._id.toString(), p]));

    const topProducts = itemAgg
      .map((agg: any) => {
        const p = productMap.get(agg._id.toString());
        return p
          ? { id: p._id, name: p.name, image: p.image, units: agg.units, revenue: agg.revenue }
          : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null)
      .sort((a, b) => b.units - a.units)
      .slice(0, 5);

    const catCounts: Record<string, number> = {};
    allProducts.forEach((p) => {
      const c = p.category || categoryFor(p.name);
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
      revenue: revenueAgg.length > 0 ? revenueAgg[0].total : 0,
      pendingOrders,
      recentOrders: recentOrders.map((o: any) => ({
        id: o._id,
        customer: o.user?.name || 'Guest',
        total: o.total,
        status: o.status,
        itemCount: o.items.length,
        createdAt: o.createdAt,
      })),
      recentReviews: recentReviews.map((r: any) => ({
        id: r._id,
        rating: r.rating,
        comment: r.comment,
        customer: r.user?.name || 'Guest',
        product: r.product?.name || 'Product',
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
    const [customers, allOrders, allReviews] = await Promise.all([
      User.find().sort({ createdAt: -1 }).lean(),
      Order.find().select('user total').lean(),
      Review.find().select('user').lean(),
    ]);

    const orderStats = new Map<string, { count: number; totalSpent: number }>();
    allOrders.forEach((o: any) => {
      const uid = o.user?.toString();
      if (!uid) return;
      const cur = orderStats.get(uid) || { count: 0, totalSpent: 0 };
      cur.count += 1;
      cur.totalSpent += o.total || 0;
      orderStats.set(uid, cur);
    });

    const reviewStats = new Map<string, number>();
    allReviews.forEach((r: any) => {
      const uid = r.user?.toString();
      if (!uid) return;
      reviewStats.set(uid, (reviewStats.get(uid) || 0) + 1);
    });

    const enriched = customers.map((c) => {
      const uid = c._id.toString();
      const oStat = orderStats.get(uid) || { count: 0, totalSpent: 0 };
      const rCount = reviewStats.get(uid) || 0;
      return {
        id: c._id,
        name: c.name,
        email: c.email,
        phone: c.phone,
        createdAt: c.createdAt,
        orderCount: oStat.count,
        reviewCount: rCount,
        totalSpent: oStat.totalSpent,
      };
    });

    return res.json({ customers: enriched });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};
