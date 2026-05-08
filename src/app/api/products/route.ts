import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { ensureSeeded, categoryFor } from "@/lib/seed";
import { verifyAdmin } from "@/lib/auth";

export async function GET() {
  try {
    await ensureSeeded();
    const products = await prisma.product.findMany({ orderBy: { id: "asc" } });
    const enriched = products.map((p) => ({ ...p, category: categoryFor(p.name) }));
    return NextResponse.json({ products: enriched }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  if (!verifyAdmin(req)) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }
  try {
    const data = await req.json();

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return NextResponse.json({ message: "No products to add" }, { status: 400 });
      }
      const saved = await prisma.product.createMany({
        data: data.map((item: any) => ({
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
          image: item.image,
        })),
      });
      return NextResponse.json({ message: "Products added", count: saved.count }, { status: 201 });
    }

    const { name, description, price, image } = data;
    if (!name || !description || !price || !image) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }
    const newProduct = await prisma.product.create({
      data: { name, description, price: parseFloat(price), image },
    });
    return NextResponse.json({ message: "Product added", product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding product:", error);
    return NextResponse.json({ message: "Error adding product", error: error.message }, { status: 500 });
  }
}
