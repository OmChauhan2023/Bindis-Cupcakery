'use client';

import { useEffect, useState } from "react";
import { Pencil, Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { motion } from "framer-motion";
import Image from "next/image";

interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function AdminDashboard() {
  const [products, setProducts] = useState<Product[]>([]);
  const [formData, setFormData] = useState({ name: "", description: "", price: "", image: "" });
  const [message, setMessage] = useState("");
  const [editingProductId, setEditingProductId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      setProducts(data.products);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    try {
      const method = editingProductId ? "PUT" : "POST";
      const url = editingProductId ? `/api/products/${editingProductId}` : "/api/products";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, price: Number(formData.price) }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage(editingProductId ? "Product updated!" : "Product added!");
        setFormData({ name: "", description: "", price: "", image: "" });
        setEditingProductId(null);
        fetchProducts();
      } else {
        setMessage(data.message || "Something went wrong");
      }
    } catch {
      setMessage("Error processing request");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        setMessage("Product deleted!");
        fetchProducts();
      } else {
        setMessage("Failed to delete product");
      }
    } catch {
      setMessage("Error deleting product");
    }
  };

  const handleEdit = (product: Product) => {
    setFormData({ name: product.name, description: product.description, price: String(product.price), image: product.image });
    setEditingProductId(product._id);
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">Admin Dashboard</h2>
      {message && <p className="text-green-500 mb-2">{message}</p>}

      <motion.form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded-lg shadow-md mb-6"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <h3 className="text-lg font-semibold mb-2">{editingProductId ? "Edit Product" : "Add Product"}</h3>
        <input type="text" name="name" placeholder="Product Name" value={formData.name} onChange={handleChange} className="w-full p-2 border rounded my-2" required />
        <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} className="w-full p-2 border rounded my-2" required />
        <input type="number" name="price" placeholder="Price" value={formData.price} onChange={handleChange} className="w-full p-2 border rounded my-2" required />
        <input type="text" name="image" placeholder="Image URL" value={formData.image} onChange={handleChange} className="w-full p-2 border rounded my-2" required />
        <Button type="submit" className="w-full bg-blue-500 text-white">{editingProductId ? "Update Product" : "Add Product"}</Button>
      </motion.form>

      <h3 className="text-xl font-bold mb-4">Products List</h3>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Description</TableHead>
              <TableHead>Price</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {products.map((product) => (
              <TableRow key={product._id}>
                <TableCell>
                  <Image
                    src={product.image}
                    height={50}
                    width={50}
                    alt={product.name}
                    className="w-full h-24 object-cover rounded-md"
                  />
                </TableCell>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.description}</TableCell>
                <TableCell>${product.price}</TableCell>
                <TableCell>
                  <Button variant="ghost" onClick={() => handleEdit(product)}><Pencil className="w-5 h-5" /></Button>
                  <Button variant="ghost" onClick={() => handleDelete(product._id)}><Trash className="w-5 h-5 text-red-500" /></Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </motion.div>
    </div>
  );
}
