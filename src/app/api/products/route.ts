import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();

    // Check if the request contains an array (bulk insert) or a single object
    if (Array.isArray(data)) {
      if (data.length === 0) {
        return NextResponse.json({ message: "No products to add" }, { status: 400 });
      }
      
      const savedProducts = await prisma.product.createMany({
        data: data.map((item: any) => ({
          name: item.name,
          description: item.description,
          price: parseFloat(item.price),
          image: item.image,
        })),
      });
      return NextResponse.json({ message: "Products added successfully", count: savedProducts.count }, { status: 201 });
    }

    // Single product insert
    const { name, description, price, image } = data;

    if (!name || !description || !price || !image) {
      return NextResponse.json({ message: "All fields are required" }, { status: 400 });
    }

    const newProduct = await prisma.product.create({
      data: {
        name,
        description,
        price: parseFloat(price),
        image,
      },
    });

    return NextResponse.json({ message: "Product added successfully", product: newProduct }, { status: 201 });
  } catch (error: any) {
    console.error("Error adding product:", error);
    return NextResponse.json({ message: "Error adding product", error: error.message }, { status: 500 });
  }
}

export async function GET() {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ products }, { status: 200 });
  } catch (error: any) {
    console.error("Error fetching products:", error);
    return NextResponse.json({ message: "Error fetching products", error: error.message }, { status: 500 });
  }
}
