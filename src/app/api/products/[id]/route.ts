import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { verifyAdmin } from "@/lib/auth";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  try {
    const { id } = await ctx.params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }
    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { reviews: { include: { user: true } } },
    });
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }
    return NextResponse.json({ product }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Server error", error: (error as Error).message }, { status: 500 });
  }
}

export async function PUT(req: NextRequest, ctx: Ctx) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    const productId = parseInt(id);
    const { name, description, price, image } = await req.json();
    if (isNaN(productId)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }
    const updated = await prisma.product.update({
      where: { id: productId },
      data: {
        name,
        description,
        price: price !== undefined ? parseFloat(price) : undefined,
        image,
      },
    });
    return NextResponse.json({ message: "Product updated", product: updated }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error updating product", error: (error as Error).message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, ctx: Ctx) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const { id } = await ctx.params;
    const productId = parseInt(id);
    if (isNaN(productId)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }
    await prisma.product.delete({ where: { id: productId } });
    return NextResponse.json({ message: "Product deleted" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: "Error deleting product", error: (error as Error).message }, { status: 500 });
  }
}
