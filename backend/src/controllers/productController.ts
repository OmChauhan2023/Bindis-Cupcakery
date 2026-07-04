import { Request, Response } from 'express';
import Product from '../models/Product';
import { ensureSeeded } from '../utils/seed';
import { categoryFor } from '../utils/categories';

// @desc    Get all products
// @route   GET /api/products
// @access  Public
export const getProducts = async (req: Request, res: Response) => {
  try {
    await ensureSeeded();
    const products = await Product.find().sort({ _id: 1 }).lean();
    const enriched = products.map((p) => ({
      ...p,
      id: p._id,
      category: p.category || categoryFor(p.name),
    }));
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
    const id = req.params.id;
    const product = await Product.findById(id).lean();
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const enriched = { ...product, id: product._id, category: product.category || categoryFor(product.name) };
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
      const saved = await Product.insertMany(
        data.map((item: any) => ({
          name: item.name,
          description: item.description,
          price: parseFloat(String(item.price)),
          image: item.image,
          category: item.category || categoryFor(item.name),
        }))
      );
      return res.status(201).json({ message: 'Products added', count: saved.length });
    }

    const { name, description, price, image, category } = data;
    if (!name || !description || !price || !image) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    const newProduct = await Product.create({
      name,
      description,
      price: parseFloat(price),
      image,
      category: category || categoryFor(name),
    });
    return res.status(201).json({ message: 'Product added', product: { ...newProduct.toObject(), id: newProduct._id } });
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
    const id = req.params.id;
    const { name, description, price, image, category } = req.body;

    const product = await Product.findByIdAndUpdate(
      id,
      {
        ...(name && { name }),
        ...(description && { description }),
        ...(price && { price: parseFloat(String(price)) }),
        ...(image && { image }),
        ...(category && { category }),
      },
      { new: true }
    ).lean();

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    return res.status(200).json({ message: 'Product updated', product: { ...product, id: product._id } });
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
    const id = req.params.id;
    const deleted = await Product.findByIdAndDelete(id);
    if (!deleted) {
      return res.status(404).json({ message: 'Product not found' });
    }
    return res.status(200).json({ message: 'Product deleted' });
  } catch (error: any) {
    console.error('Error deleting product:', error);
    return res.status(500).json({ message: 'Error deleting product', error: error.message });
  }
};
