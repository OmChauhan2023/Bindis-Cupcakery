import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface IncomingItem {
  id: string | number;
  qty: number;
  price: number;
  customizations?: { label: string; value: string }[];
  note?: string;
}

interface CreateOrderBody {
  customer: { name: string; email: string; phone: string };
  deliveryAddress: string;
  paymentMethod: string;
  items: IncomingItem[];
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateOrderBody;
    const { customer, deliveryAddress, paymentMethod, items } = body;

    if (!customer?.name || !customer?.email || !customer?.phone) {
      return NextResponse.json({ message: "Missing customer details" }, { status: 400 });
    }
    if (!deliveryAddress?.trim()) {
      return NextResponse.json({ message: "Missing delivery address" }, { status: 400 });
    }
    if (!Array.isArray(items) || items.length === 0) {
      return NextResponse.json({ message: "Cart is empty" }, { status: 400 });
    }

    // Find-or-create user by email
    let user = await prisma.user.findUnique({ where: { email: customer.email } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: customer.name, email: customer.email, phone: customer.phone },
      });
    } else {
      // Refresh phone/name if changed
      if (user.name !== customer.name || user.phone !== customer.phone) {
        user = await prisma.user.update({
          where: { id: user.id },
          data: { name: customer.name, phone: customer.phone },
        });
      }
    }

    // Validate products exist + recompute total server-side
    const productIds = items.map((it) => Number(it.id)).filter((n) => Number.isFinite(n));
    const products = await prisma.product.findMany({ where: { id: { in: productIds } } });
    const productMap = new Map(products.map((p) => [p.id, p]));

    let total = 0;
    const orderItemsData = items.map((it) => {
      const pid = Number(it.id);
      const p = productMap.get(pid);
      if (!p) throw new Error(`Product ${it.id} not found`);
      const qty = Math.max(1, Math.floor(it.qty || 1));
      // Trust client-side line price (allows for premium-box surcharge etc.) but cap at 5x base price
      const lineUnit = it.price && it.price >= p.price && it.price <= p.price * 5 ? it.price : p.price;
      total += lineUnit * qty;
      const notesParts: string[] = [];
      if (it.customizations && it.customizations.length > 0) {
        notesParts.push(it.customizations.map((c) => `${c.label}: ${c.value}`).join(" | "));
      }
      if (it.note) notesParts.push(`Note: ${it.note}`);
      return {
        productId: pid,
        quantity: qty,
        price: lineUnit,
        notes: notesParts.length > 0 ? notesParts.join(" || ") : null,
      };
    });

    const order = await prisma.order.create({
      data: {
        userId: user.id,
        total,
        paymentMethod: paymentMethod || "Cash",
        deliveryAddress,
        items: { create: orderItemsData },
      },
      include: { items: true },
    });

    return NextResponse.json(
      { message: "Order placed", orderId: order.id, total: order.total },
      { status: 201 }
    );
  } catch (error) {
    console.error("Order error:", error);
    return NextResponse.json(
      { message: "Could not place order", error: (error as Error).message },
      { status: 500 }
    );
  }
}
