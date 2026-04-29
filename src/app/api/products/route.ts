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

const MOCK_PRODUCTS = [
  {
    id: 1,
    name: 'Classic Vanilla Cupcake',
    description: 'A timeless classic. Soft vanilla sponge topped with creamy vanilla buttercream.',
    price: 80,
    image: '/images/vanilla-cupcake.jpg'
  },
  {
    id: 2,
    name: 'Double Chocolate Fudge',
    description: 'For the chocolate lovers. Rich chocolate cake with a decadent fudge core and chocolate frosting.',
    price: 120,
    image: '/images/chocolate-cupcake.jpg'
  },
  {
    id: 3,
    name: 'Strawberry Dream',
    description: 'Fresh strawberry cake topped with light strawberry whipped cream.',
    price: 90,
    image: '/images/strawberry-cupcake.jpg'
  },
  {
    id: 4,
    name: 'Red Velvet Royale',
    description: 'Classic red velvet cake with a smooth cream cheese frosting.',
    price: 110,
    image: '/images/red-velvet.jpg'
  },
  {
    id: 5,
    name: 'Lemon Meringue',
    description: 'Zesty lemon cupcake filled with lemon curd and topped with toasted meringue.',
    price: 100,
    image: '/images/lemon-meringue.jpg'
  },
  {
    id: 6,
    name: 'Salted Caramel Crunch',
    description: 'Vanilla bean cake with a caramel center, caramel frosting, and sea salt sprinkle.',
    price: 130,
    image: '/images/salted-caramel.jpg'
  }
];

export async function GET() {
  return NextResponse.json({ products: MOCK_PRODUCTS }, { status: 200 });
}
