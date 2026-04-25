import { NextResponse } from "next/server";
<<<<<<< HEAD
import prisma from "@/lib/prisma";
=======
import { connectDB } from "@/lib/mongodb";
import Product from "@/models/Product";
import mongoose from "mongoose";
>>>>>>> a5952e490eec4534302ae02da739bc78b511b478

// ✅ Fetch a Single Product by ID
export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const productId = parseInt(id);

<<<<<<< HEAD
    if (isNaN(productId)) {
=======
    if (!mongoose.Types.ObjectId.isValid(id)) {
>>>>>>> a5952e490eec4534302ae02da739bc78b511b478
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const product = await prisma.product.findUnique({
      where: { id: productId },
      include: { reviews: true }
    });

    if (!product) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
    }

    return NextResponse.json({ product }, { status: 200 });
<<<<<<< HEAD
  } catch (error: any) {
    console.error("Error fetching product:", error);
    return NextResponse.json({ message: "Server error", error: error.message }, { status: 500 });
=======
  } catch (error) {
    const err = error as Error;
    console.error("❌ Error fetching product:", error);
    return NextResponse.json({ message: "Server error", error: err.message }, { status: 500 });
>>>>>>> a5952e490eec4534302ae02da739bc78b511b478
  }
}

// ✅ Update a Product by ID
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const productId = parseInt(id);
    const { name, description, price, image } = await req.json();

<<<<<<< HEAD
    if (isNaN(productId)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
=======
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      { name, description, price, image },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
>>>>>>> a5952e490eec4534302ae02da739bc78b511b478
    }

    const updatedProduct = await prisma.product.update({
      where: { id: productId },
      data: { 
        name, 
        description, 
        price: price ? parseFloat(price) : undefined, 
        image 
      },
    });

    return NextResponse.json({ message: "Product updated successfully", product: updatedProduct }, { status: 200 });
<<<<<<< HEAD
  } catch (error: any) {
    console.error("Error updating product:", error);
    return NextResponse.json({ message: "Error updating product", error: error.message }, { status: 500 });
=======
  } catch (error) {
    const err = error as Error;
    console.error("❌ Error updating product:", error);
    return NextResponse.json({ message: "Error updating product", error: err.message }, { status: 500 });
>>>>>>> a5952e490eec4534302ae02da739bc78b511b478
  }
}

// ✅ Delete a Product by ID
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const productId = parseInt(id);

<<<<<<< HEAD
    if (isNaN(productId)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
=======
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ message: "Invalid product ID" }, { status: 400 });
    }

    const deletedProduct = await Product.findByIdAndDelete(id);
    if (!deletedProduct) {
      return NextResponse.json({ message: "Product not found" }, { status: 404 });
>>>>>>> a5952e490eec4534302ae02da739bc78b511b478
    }

    await prisma.product.delete({
      where: { id: productId },
    });

    return NextResponse.json({ message: "Product deleted successfully" }, { status: 200 });
<<<<<<< HEAD
  } catch (error: any) {
    console.error("Error deleting product:", error);
    return NextResponse.json({ message: "Error deleting product", error: error.message }, { status: 500 });
=======
  } catch (error) {
    const err = error as Error;
    console.error("❌ Error deleting product:", error);
    return NextResponse.json({ message: "Error deleting product", error: err.message }, { status: 500 });
>>>>>>> a5952e490eec4534302ae02da739bc78b511b478
  }
}
