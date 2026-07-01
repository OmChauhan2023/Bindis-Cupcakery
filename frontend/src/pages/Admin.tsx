import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Tab,
  Tabs,
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  CircularProgress,
  alpha,
  Alert,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Receipt as OrdersIcon,
  Star as ReviewsIcon,
  Add as AddIcon,
  Delete as DeleteIcon,
  Edit as EditIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

export default function AdminPage() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Product modal
  const [openProductModal, setOpenProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [productForm, setProductForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
    category: "Bakery",
  });

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [statsRes, prodRes, ordersRes, reviewsRes] = await Promise.all([
        api.get("/admin/stats").catch(() => ({ data: { products: 0, orders: 0, customers: 0, revenue: 0 } })),
        api.get("/products").catch(() => ({ data: { products: [] } })),
        api.get("/orders").catch(() => ({ data: { orders: [] } })),
        api.get("/reviews").catch(() => ({ data: { reviews: [] } })),
      ]);
      setStats(statsRes.data);
      setProducts(prodRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
      setReviews(reviewsRes.data.reviews || []);
    } catch (err: any) {
      setError("Failed to load some admin data. Ensure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleOpenCreateProduct = () => {
    setEditingProduct(null);
    setProductForm({ name: "", description: "", price: "", image: "/cupcake.jpg", category: "Bakery" });
    setOpenProductModal(true);
  };

  const handleOpenEditProduct = (p: any) => {
    setEditingProduct(p);
    setProductForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      image: p.image || "/cupcake.jpg",
      category: p.category || "Bakery",
    });
    setOpenProductModal(true);
  };

  const handleSaveProduct = async () => {
    try {
      if (editingProduct) {
        await api.put(`/products/${editingProduct.id}`, productForm);
      } else {
        await api.post("/products", productForm);
      }
      setOpenProductModal(false);
      loadData();
    } catch (err: any) {
      alert("Error saving product: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProduct = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      loadData();
    } catch (err: any) {
      alert("Error deleting product");
    }
  };

  const handleUpdateOrderStatus = async (id: number, status: string) => {
    try {
      await api.put(`/orders/${id}`, { status });
      loadData();
    } catch (err: any) {
      alert("Error updating status");
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fdfaf7", py: 4 }}>
      <Box sx={{ maxWidth: 1400, mx: "auto", px: 3 }}>
        {/* Header */}
        <Paper
          elevation={0}
          sx={{
            p: 3,
            mb: 4,
            borderRadius: 4,
            border: "1px solid",
            borderColor: alpha("#d4a373", 0.2),
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 3,
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.6rem",
                color: "white",
              }}
            >
              👑
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 800, color: "#9d4870" }}>
                Bindi&apos;s Cupcakery Admin Panel
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {user ? `Logged in as ${user.name} (${user.email})` : "Admin Access"} {isAdmin && "• Administrator"}
              </Typography>
            </Box>
          </Box>
          <Box sx={{ display: "flex", gap: 1 }}>
            <Button variant="outlined" onClick={() => navigate("/")} sx={{ borderRadius: "50px" }}>
              View Storefront
            </Button>
            {user && (
              <Button
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                onClick={() => { logout(); navigate("/"); }}
                sx={{ borderRadius: "50px" }}
              >
                Logout
              </Button>
            )}
          </Box>
        </Paper>

        {error && (
          <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
            {error} - Some backend features require admin credentials.
          </Alert>
        )}

        {/* Navigation Tabs */}
        <Paper elevation={0} sx={{ mb: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
          <Tabs
            value={tab}
            onChange={(_, v) => setTab(v)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              "& .MuiTab-root": { fontWeight: 700, py: 2, minHeight: 60 },
              "& .Mui-selected": { color: "#ec4899" },
            }}
          >
            <Tab icon={<DashboardIcon />} iconPosition="start" label="Dashboard" />
            <Tab icon={<ProductsIcon />} iconPosition="start" label={`Products (${products.length})`} />
            <Tab icon={<OrdersIcon />} iconPosition="start" label={`Orders (${orders.length})`} />
            <Tab icon={<ReviewsIcon />} iconPosition="start" label={`Reviews (${reviews.length})`} />
          </Tabs>
        </Paper>

        {/* Tab 0: Dashboard */}
        {tab === 0 && (
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>TOTAL REVENUE</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#10b981", mt: 1 }}>
                  ₹{stats?.revenue ? stats.revenue.toFixed(0) : "0"}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>ORDERS</Typography>
                <Typography variant="h4" color="primary" sx={{ fontWeight: 800, mt: 1 }}>
                  {stats?.orders || orders.length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>PRODUCTS</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#8b5cf6", mt: 1 }}>
                  {stats?.products || products.length}
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
                <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700 }}>REVIEWS</Typography>
                <Typography variant="h4" sx={{ fontWeight: 800, color: "#f59e0b", mt: 1 }}>
                  {stats?.reviews || reviews.length}
                </Typography>
              </Paper>
            </Grid>

            <Grid item xs={12}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: "1px solid", borderColor: "divider", mt: 2 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>Quick Summary</Typography>
                <Typography color="text.secondary">
                  Welcome to your MERN Stack dashboard! All frontend views have been successfully migrated to React + Vite. Manage your products, view customer orders, and moderate reviews using the tabs above.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        )}

        {/* Tab 1: Products */}
        {tab === 1 && (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", justify: "space-between", mb: 3, alignItems: "center" }}>
              <Typography variant="h6" sx={{ fontWeight: 700 }}>Manage Catalog Items</Typography>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleOpenCreateProduct}
                sx={{ borderRadius: "50px", background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}
              >
                Add Product
              </Button>
            </Box>
            <Table>
              <TableHead>
                <TableRow sx={{ bgcolor: alpha("#ec4899", 0.05) }}>
                  <TableCell sx={{ fontWeight: 700 }}>Image</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Name</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Category</TableCell>
                  <TableCell sx={{ fontWeight: 700 }}>Price</TableCell>
                  <TableCell align="right" sx={{ fontWeight: 700 }}>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {products.map((p) => (
                  <TableRow key={p.id}>
                    <TableCell>
                      <img src={p.image || "/cupcake.jpg"} alt={p.name} style={{ width: 48, height: 48, borderRadius: 8, objectFit: "cover" }} />
                    </TableCell>
                    <TableCell sx={{ fontWeight: 600 }}>{p.name}</TableCell>
                    <TableCell><Chip label={p.category || "Bakery"} size="small" /></TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>₹{p.price}</TableCell>
                    <TableCell align="right">
                      <Button size="small" startIcon={<EditIcon />} onClick={() => handleOpenEditProduct(p)} sx={{ mr: 1 }}>
                        Edit
                      </Button>
                      <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => handleDeleteProduct(p.id)}>
                        Delete
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        )}

        {/* Tab 2: Orders */}
        {tab === 2 && (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Customer Orders</Typography>
            {orders.length === 0 ? (
              <Typography color="text.secondary" py={4} textAlign="center">No orders found.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha("#8b5cf6", 0.05) }}>
                    <TableCell sx={{ fontWeight: 700 }}>Order ID</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                    <TableCell align="right" sx={{ fontWeight: 700 }}>Update Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {orders.map((o) => (
                    <TableRow key={o.id}>
                      <TableCell sx={{ fontWeight: 700 }}>#{o.id}</TableCell>
                      <TableCell>
                        {o.user?.name || o.customer?.name || "Guest"}
                        <Typography variant="caption" display="block" color="text.secondary">
                          {o.user?.email || o.customer?.email || ""}
                        </Typography>
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, color: "#10b981" }}>₹{o.total}</TableCell>
                      <TableCell><Chip label={o.paymentMethod || "UPI"} size="small" /></TableCell>
                      <TableCell>
                        <Chip
                          label={o.status || "pending"}
                          size="small"
                          sx={{
                            bgcolor: alpha(STATUS_COLORS[o.status || "pending"] || "#6b7280", 0.15),
                            color: STATUS_COLORS[o.status || "pending"] || "#6b7280",
                            fontWeight: 700,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <select
                          value={o.status || "pending"}
                          onChange={(e) => handleUpdateOrderStatus(o.id, e.target.value)}
                          style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #ccc" }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="preparing">Preparing</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        )}

        {/* Tab 3: Reviews */}
        {tab === 3 && (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>Customer Reviews</Typography>
            {reviews.length === 0 ? (
              <Typography color="text.secondary" py={4} textAlign="center">No reviews found.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha("#f59e0b", 0.05) }}>
                    <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Rating</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Comment</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Product</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reviews.map((r) => (
                    <TableRow key={r.id}>
                      <TableCell sx={{ fontWeight: 600 }}>{r.user?.name || "Anonymous"}</TableCell>
                      <TableCell>{"⭐".repeat(r.rating || 5)}</TableCell>
                      <TableCell sx={{ fontStyle: "italic" }}>&quot;{r.comment}&quot;</TableCell>
                      <TableCell><Chip label={r.product?.name || "Cupcake"} size="small" /></TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        )}
      </Box>

      {/* Product Modal */}
      <Dialog open={openProductModal} onClose={() => setOpenProductModal(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ fontWeight: 700 }}>{editingProduct ? "Edit Product" : "Add New Product"}</DialogTitle>
        <DialogContent dividers>
          <TextField
            fullWidth
            label="Product Name"
            value={productForm.name}
            onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
            sx={{ mb: 2, mt: 1 }}
          />
          <TextField
            fullWidth
            label="Category"
            value={productForm.category}
            onChange={(e) => setProductForm({ ...productForm, category: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Price (₹)"
            type="number"
            value={productForm.price}
            onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Image URL or Path (e.g., /cupcake.jpg)"
            value={productForm.image}
            onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            fullWidth
            label="Description"
            multiline
            rows={3}
            value={productForm.description}
            onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
          />
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenProductModal(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleSaveProduct}
            sx={{ borderRadius: "50px", background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}
          >
            Save Product
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
