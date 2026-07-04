import { Request, Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';
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
    let user = await User.findOne({ email: customer.email });
    if (!user) {
      user = await User.create({
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
      });
    } else {
      if (user.name !== customer.name || user.phone !== customer.phone) {
        user.name = customer.name;
        user.phone = customer.phone;
        await user.save();
      }
    }

    const productIds = items.map((it: any) => String(it.id));
    const products = await Product.find({ _id: { $in: productIds } });
    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    let subtotal = 0;
    const orderItemsData = items.map((it: any) => {
      const pid = String(it.id);
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
        productId: p._id,
        name: p.name,
        quantity: qty,
        price: lineUnit,
        notes: notesParts.length > 0 ? notesParts.join(' || ') : undefined,
      };
    });

    const validPromo = lookupPromo(promoCode);
    const discount = validPromo ? Math.round(subtotal * (validPromo.percent / 100)) : 0;
    const deliveryFee = subtotal > 500 ? 0 : 40;
    const total = Math.max(0, subtotal - discount + deliveryFee);

    const orderNote = validPromo
      ? `Promo: ${validPromo.code} (−₹${discount}) | Delivery: ₹${deliveryFee} | Subtotal: ₹${subtotal}`
      : `Delivery: ₹${deliveryFee} | Subtotal: ₹${subtotal}`;

    const order = await Order.create({
      user: user._id,
      total,
      paymentMethod: paymentMethod || 'Cash',
      deliveryAddress: `${deliveryAddress}\n— ${orderNote}`,
      items: orderItemsData,
    });

    return res.status(201).json({
      message: 'Order placed',
      orderId: order._id,
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
    const orders = await Order.find({ user: req.user.id || req.user._id })
      .sort({ createdAt: -1 })
      .populate('items.productId')
      .lean();

    const formatted = orders.map((o) => ({
      ...o,
      id: o._id,
      items: o.items.map((it: any) => ({
        ...it,
        id: it._id,
        product: it.productId || { name: it.name, price: it.price },
      })),
    }));

    return res.json({ orders: formatted });
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
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate('user')
      .populate('items.productId')
      .lean();

    const formatted = orders.map((o) => ({
      ...o,
      id: o._id,
      items: o.items.map((it: any) => ({
        ...it,
        id: it._id,
        product: it.productId || { name: it.name, price: it.price },
      })),
    }));

    return res.json({ orders: formatted });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};

// @desc    Update order status (Admin)
// @route   PUT /api/orders/:id
// @access  Private/Admin
export const updateOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const { status } = req.body;
    const updated = await Order.findByIdAndUpdate(id, { status }, { new: true }).lean();
    if (!updated) {
      return res.status(404).json({ message: 'Order not found' });
    }
    return res.json({ order: { ...updated, id: updated._id } });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};

// @desc    Delete order (Admin)
// @route   DELETE /api/orders/:id
// @access  Private/Admin
export const deleteOrder = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    await Order.findByIdAndDelete(id);
    return res.json({ message: 'Order deleted' });
  } catch (error: any) {
    return res.status(500).json({ message: 'Error', error: error.message });
  }
};
