import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

interface CreateReviewBody {
  name: string;
  email?: string;
  productId: number;
  rating: number;
  comment: string;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as CreateReviewBody;
    const { name, email, productId, rating, comment } = body;

    if (!name?.trim() || !comment?.trim() || !rating || !productId) {
      return NextResponse.json(
        { message: "Name, product, rating, and comment are required" },
        { status: 400 }
      );
    }
    if (rating < 1 || rating > 5) {
      return NextResponse.json({ message: "Rating must be 1–5" }, { status: 400 });
    }

    // Verify product exists
    const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    // Find-or-create user — email optional, fall back to a synthetic email per name
    const userEmail = email?.trim() || `${name.trim().toLowerCase().replace(/\s+/g, ".")}@guest.bindis`;
    let user = await prisma.user.findUnique({ where: { email: userEmail } });
    if (!user) {
      user = await prisma.user.create({
        data: { name: name.trim(), email: userEmail, phone: "" },
      });
    }

    const review = await prisma.review.create({
      data: {
        userId: user.id,
        productId: Number(productId),
        rating: Number(rating),
        comment: comment.trim(),
      },
      include: { user: { select: { name: true } }, product: { select: { name: true } } },
    });

    return NextResponse.json({ message: "Review posted", review }, { status: 201 });
  } catch (error) {
    console.error("Review error:", error);
    return NextResponse.json(
      { message: "Could not save review", error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const reviews = await prisma.review.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true } },
        product: { select: { name: true } },
      },
    });
    return NextResponse.json({ reviews });
  } catch (error) {
    return NextResponse.json(
      { message: "Error", error: (error as Error).message },
      { status: 500 }
    );
  }
}
