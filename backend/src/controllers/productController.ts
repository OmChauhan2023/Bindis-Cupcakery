import { Request, Response } from 'express';
import prisma from '../config/db';
import { ensureSeeded } from '../utils/seed';
import { categoryFor } from '../utils/categories';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    await ensureSeeded();
    const products = await prisma.product.findMany({ orderBy: { id: 'asc' } });
    const enriched = products.map((p) => ({ ...p, category: categoryFor(p.name) }));
    return res.status(200).json({ products: enriched });
  } catch (error: any) {
    console.error('Error fetching products:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Get single product by ID
// @route   GET /api/products/:id
// @access  Public
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    if (isNaN(id)) {
      return res.status(400).json({ message: 'Invalid product ID' });
    }

    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const enriched = { ...product, category: categoryFor(product.name) };
    return res.status(200).json({ product: enriched });
  } catch (error: any) {
    console.error('Error fetching product:', error);
    return res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// @desc    Create new product(s)
// @route   POST /api/products
// @access  Private/Admin
export const createProduct = async (req: Request, res: Response) => {
  try {
    const data = req.body;

    if (Array.isArray(data)) {
      if (data.length === 0) {
        return res.status(400).json({ message: 'No products to add' });
      }
      const saved = await prisma.product.createMany({
        data: data.map((item: any) => ({
          name: item.name,
          description: item.description,
          price: parseFloat(String(item.price)),
          image: item.image,
        })),
      });
      return res.status(201).json({ message: 'Products added', count: saved.count });
    }

    const { name, description, price, image } = data;
    if (!name || !description || !price || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newProduct = await prisma.product.create({
      data: { name, description, price: parseFloat(price), image },
    });
    return res.status(201).json({ message: 'Product added', product: newProduct });
  } catch (error: any) {
    console.error('Error adding product:', error);
    return res.status(500).json({ message: 'Error adding product', error: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
export const updateProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    const { name, description, price, image } = req.body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(String(price)) }),
        ...(image && { image }),
      },
    });

    return res.status(200).json({ message: 'Product updated', product });
  } catch (error: any) {
    console.error('Error updating product:', error);
    return res.status(500).json({ message: 'Error updating product', error: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
export const deleteProduct = async (req: Request, res: Response) => {
  try {
    const id = parseInt(String(req.params.id));
    await prisma.product.delete({ where: { id } });
    return res.status(200).json({ message: 'Product deleted' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
