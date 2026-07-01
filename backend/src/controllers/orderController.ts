import { Request, Response } from 'express';
import prisma from '../config/db';
import { lookupPromo } from '../utils/promo';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Create new order
// @route   POST /api/orders
// @access  Public
export const createOrder = async (req: Request, res: Response) => {
  try {
    const { customer, deliveryAddress, paymentMethod, items, promoCode } = req.body;

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return res.status(400).json({ message: 'Missing customer details' });
    }
    if (!deliveryAddress?.trim()) {
      return res.status(400).json({ message: 'Missing delivery address' });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    // Find-or-create user by email
    let user = await prisma.user.findUnique({ where: { email: customer.email } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: customer.name, email: customer.email, phone: customer.phone },
      });
    } else {
      if (user.name !== customer.name || user.phone !== customer.phone) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name: customer.name, phone: customer.phone },
        });
      }
    }

    const productIds = items.map((it: any) => Number(it.id)).filter((n: any) => Number.isFinite(n));
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let subtotal = 0;
    const orderItemsData = items.map((it: any) => {
      const pid = Number(it.id);
      const p = productMap.get(pid);
      if (!p) throw new Error(`Product ${it.id} not found`);
      const qty = Math.max(1, Math.floor(it.qty || 1));
      const lineUnit = it.price && it.price >= p.price && it.price <= p.price * 5 ? it.price : p.price;
      subtotal += lineUnit * qty;
      const notesParts: string[] = [];
      if (it.customizations && it.customizations.length > 0) {
        notesParts.push(it.customizations.map((c: any) => `${c.label}: ${c.value}`).join(' | '));
      }
      if (it.note) notesParts.push(`Note: ${it.note}`);
      return {
        productId: pid,
        quantity: qty,
        price: lineUnit,
        notes: notesParts.length > 0 ? notesParts.join(' || ') : null,
      };
    });

    const validPromo = lookupPromo(promoCode);
    const discount = validPromo ? Math.round(subtotal * (validPromo.percent / 100)) : 0;
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const total = Math.max(0, subtotal - discount + deliveryFee);

    const orderNote = validPromo
      ? `Promo: ${validPromo.code} (−₹${discount}) | Delivery: ₹${deliveryFee} | Subtotal: ₹${subtotal}`
      : `Delivery: ₹${deliveryFee} | Subtotal: ₹${subtotal}`;

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        paymentMethod: paymentMethod || 'Cash',
        deliveryAddress: `${deliveryAddress}\n— ${orderNote}`,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    return res.status(201).json({
      message: 'Order placed',
      orderId: order.id,
      total: order.total,
      subtotal,
      discount,
      deliveryFee,
      promoApplied: validPromo?.code || null,
    });
  } catch (error: any) {
    console.error('Order error:', error);
    return res.status(500).json({ message: 'Could not place order', error: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/my-orders
// @access  Private
export const getMyOrders = async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ message: 'Not authorized' });
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: { include: { product: true } } },
    });
    return res.json({ orders });
  } catch (error: any) {
    console.error('Get user orders error:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get all orders (Admin)
// @route   GET /api/orders
// @access  Private/Admin
export const getAllOrders = async (req: Request, res: Response) => {
  try {
    const orders = await prisma.order.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        user: true,
        items: { include: { product: true } },
      },
    });
    return res.json({ orders });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const { status } = req.body;
    const updated = await prisma.order.update({
      where: { id },
      data: { status },
    });
    return res.json({ order: updated });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};

// @desc    Delete order (Admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    await prisma.order.delete({ where: { id } });
    return res.json({ message: 'Order deleted' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};
