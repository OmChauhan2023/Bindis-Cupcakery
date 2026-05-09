"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Box, Paper, Typography, Button, IconButton, TextField, Dialog, DialogTitle,
  DialogContent, DialogActions, Table, TableHead, TableRow, TableCell, TableBody,
  Chip, Alert, InputAdornment, alpha, CircularProgress,
} from "@mui/material";
import {
  Add as AddIcon, Edit as EditIcon, Delete as DeleteIcon, Search as SearchIcon,
  Save as SaveIcon, Inventory as ProductsIcon,
} from "@mui/icons-material";
import AdminShell from "../components/AdminShell";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

type ProductForm = { name: string; description: string; price: string; image: string };
const empty: ProductForm = { name: "", description: "", price: "", image: "" };

export default function AdminProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<ProductForm>(empty);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    const data = await res.json();
    setProducts(data.products || []);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const openCreate = () => { setEditing(null); setForm(empty); setError(""); setOpen(true); };
  const openEdit = (p: Product) => {
    setEditing(p);
    setForm({ name: p.name, description: p.description, price: String(p.price), image: p.image });
    setError("");
    setOpen(true);
  };

  const save = async () => {
    setError("");
    if (!form.name || !form.description || !form.price || !form.image) {
      setError("All fields required");
      return;
    }
    setSaving(true);
    const url = editing ? `/api/products/${editing.id}` : "/api/products";
    const method = editing ? "PUT" : "POST";
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setSaving(false);
    if (!res.ok) {
      const d = await res.json();
      setError(d.message || "Failed");
      return;
    }
    setOpen(false);
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this product?")) return;
    const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
    if (res.ok) load();
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase()) ||
    p.description.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell title="Manage Products">
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center", flexWrap: "wrap" }}>
          <TextField
            placeholder="Search products…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: 1, minWidth: 240 }}
            InputProps={{
              startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
            }}
          />
          <Chip icon={<ProductsIcon />} label={`${products.length} total`} sx={{ fontWeight: 700 }} />
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={openCreate}
            sx={{ borderRadius: "50px", background: "linear-gradient(135deg, #d97a9c, #9b7bd0)", fontWeight: 700, px: 3 }}
          >
            New Product
          </Button>
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: "center" }}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha("#ec4899", 0.05) }}>
                <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Description</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((p) => (
                <TableRow key={p.id} hover>
                  <TableCell>
                    <Box sx={{ position: "relative", width: 56, height: 56, borderRadius: 2, overflow: "hidden", bgcolor: "#f5f5f5" }}>
                      <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} sizes="56px" />
                    </Box>
                  </TableCell>
                  <TableCell><Typography fontWeight={600}>{p.name}</Typography></TableCell>
                  <TableCell>
                    {p.category && <Chip size="small" label={p.category} sx={{ bgcolor: alpha("#8b5cf6", 0.12), color: "#7c3aed", fontWeight: 700 }} />}
                  </TableCell>
                  <TableCell sx={{ maxWidth: 300 }}>
                    <Typography variant="body2" color="text.secondary" noWrap>{p.description}</Typography>
                  </TableCell>
                  <TableCell><Typography fontWeight={700} color="primary">₹{p.price}</Typography></TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEdit(p)} sx={{ color: "#8b5cf6" }}><EditIcon /></IconButton>
                    <IconButton onClick={() => remove(p.id)} sx={{ color: "#ef4444" }}><DeleteIcon /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>No products</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 4 } }}>
        <DialogTitle sx={{ background: "linear-gradient(135deg, #fdf2f4, #f5eef9)", fontWeight: 700 }}>
          {editing ? "Edit Product" : "New Product"}
        </DialogTitle>
        <DialogContent sx={{ pt: 3, mt: 1 }}>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Price (₹)" type="number" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} sx={{ mb: 2 }} />
          <TextField fullWidth label="Image path (e.g. /cupcake.jpg)" value={form.image} onChange={(e) => setForm({ ...form, image: e.target.value })} />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            onClick={save}
            disabled={saving}
            variant="contained"
            startIcon={<SaveIcon />}
            sx={{ borderRadius: "50px", px: 3, background: "linear-gradient(135deg, #d97a9c, #9b7bd0)", fontWeight: 700 }}
          >
            {saving ? "Saving…" : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </AdminShell>
  );
}
