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
  Avatar,
  useTheme,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Tooltip,
  InputBase,
  IconButton,
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
  People as CustomersIcon,
  Storefront as StorefrontIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
} from "@mui/icons-material";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import api from "@/services/api";
import AdminDashboardOverview from "./components/AdminDashboardOverview";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

export default function AdminPage() {
  const theme = useTheme();
  const isDark = theme.palette.mode === "dark";
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState<any>(null);
  const [products, setProducts] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [reviews, setReviews] = useState<any[]>([]);
  const [customers, setCustomers] = useState<any[]>([]);
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
      const [statsRes, prodRes, ordersRes, reviewsRes, custRes] = await Promise.all([
        api.get("/admin/stats").catch(() => ({ data: { products: 0, orders: 0, customers: 0, revenue: 0 } })),
        api.get("/products").catch(() => ({ data: { products: [] } })),
        api.get("/orders").catch(() => ({ data: { orders: [] } })),
        api.get("/reviews").catch(() => ({ data: { reviews: [] } })),
        api.get("/admin/customers").catch(() => ({ data: { customers: [] } })),
      ]);
      setStats(statsRes.data);
      setProducts(prodRes.data.products || []);
      setOrders(ordersRes.data.orders || []);
      setReviews(reviewsRes.data.reviews || []);
      setCustomers(custRes.data.customers || []);
    } catch (err: any) {
      setError("Failed to load some admin data. Ensure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Auth guard — redirect non-admins to login
  useEffect(() => {
    if (!loading && !isAdmin) {
      navigate("/login");
    }
  }, [loading, isAdmin, navigate]);

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
        const pid = editingProduct._id || editingProduct.id;
        await api.put(`/products/${pid}`, productForm);
      } else {
        await api.post("/products", productForm);
      }
      setOpenProductModal(false);
      loadData();
    } catch (err: any) {
      alert("Error saving product: " + (err.response?.data?.message || err.message));
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return;
    try {
      await api.delete(`/products/${id}`);
      loadData();
    } catch (err: any) {
      alert("Error deleting product");
    }
  };

  const handleUpdateOrderStatus = async (id: string, status: string) => {
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

  const sidebarItems = [
    { label: "Dashboard", icon: <DashboardIcon />, count: null },
    { label: "Products", icon: <ProductsIcon />, count: products.length },
    { label: "Orders", icon: <OrdersIcon />, count: orders.length },
    { label: "Reviews", icon: <ReviewsIcon />, count: reviews.length },
    { label: "Live Sign-Ins", icon: <CustomersIcon />, count: customers.length },
  ];

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: isDark ? "#12121c" : "#f8fafc" }}>
      {/* Sleek Frosted Left Hand Sidebar */}
      <Box
        sx={{
          width: { xs: 70, md: 240 },
          flexShrink: 0,
          bgcolor: isDark ? "#1e1e2d" : "#ffffff",
          borderRight: "1px solid",
          borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          py: 3,
          px: { xs: 1, md: 2 },
          position: "sticky",
          top: 0,
          height: "100vh",
          zIndex: 100,
        }}
      >
        {/* Top Logo */}
        <Box>
          <Box
            onClick={() => navigate("/")}
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              px: { xs: 0, md: 1 },
              mb: 3,
              cursor: "pointer",
              justifyContent: { xs: "center", md: "flex-start" },
            }}
          >
            <Box
              sx={{
                width: 36,
                height: 36,
                borderRadius: 2.5,
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: "1.2rem",
                color: "white",
                boxShadow: "0 4px 12px rgba(236, 72, 153, 0.3)",
              }}
            >
              👑
            </Box>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 900,
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                display: { xs: "none", md: "block" },
                letterSpacing: -0.5,
              }}
            >
              Bindi&apos;s Bakery
            </Typography>
          </Box>

          {/* Navigation Links */}
          <List sx={{ px: 0, gap: 0.5, display: "flex", flexDirection: "column" }}>
            {sidebarItems.map((item, idx) => {
              const active = tab === idx;
              return (
                <ListItem key={item.label} disablePadding>
                  <Tooltip title={item.label} placement="right" arrow disableHoverListener={Boolean(window.innerWidth > 900)}>
                    <ListItemButton
                      onClick={() => setTab(idx)}
                      sx={{
                        borderRadius: 2.5,
                        py: 1.2,
                        px: { xs: 1.5, md: 2 },
                        justifyContent: { xs: "center", md: "flex-start" },
                        bgcolor: active ? alpha("#ec4899", 0.1) : "transparent",
                        color: active ? "#ec4899" : isDark ? "#94a3b8" : "#64748b",
                        transition: "all 0.2s",
                        "&:hover": {
                          bgcolor: active ? alpha("#ec4899", 0.15) : alpha("#ec4899", 0.05),
                          color: "#ec4899",
                        },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          minWidth: { xs: 0, md: 36 },
                          color: "inherit",
                          justifyContent: "center",
                        }}
                      >
                        {item.icon}
                      </ListItemIcon>
                      <ListItemText
                        primary={item.label}
                        primaryTypographyProps={{
                          fontWeight: active ? 800 : 600,
                          fontSize: "0.9rem",
                          sx: { display: { xs: "none", md: "block" } },
                        }}
                      />
                      {item.count !== null && item.count !== undefined && (
                        <Chip
                          label={item.count}
                          size="small"
                          sx={{
                            height: 20,
                            fontSize: "0.75rem",
                            fontWeight: 800,
                            bgcolor: active ? "#ec4899" : isDark ? alpha("#fff", 0.08) : alpha("#000", 0.06),
                            color: active ? "#fff" : "inherit",
                            display: { xs: "none", md: "inline-flex" },
                          }}
                        />
                      )}
                    </ListItemButton>
                  </Tooltip>
                </ListItem>
              );
            })}
          </List>
        </Box>

        {/* Bottom Sidebar Actions */}
        <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
          <Button
            variant="outlined"
            startIcon={<StorefrontIcon />}
            onClick={() => navigate("/")}
            fullWidth
            sx={{
              borderRadius: 2.5,
              py: 1,
              textTransform: "none",
              fontWeight: 700,
              borderColor: isDark ? "rgba(255,255,255,0.15)" : "rgba(0,0,0,0.12)",
              color: isDark ? "#e2e8f0" : "#334155",
              justifyContent: { xs: "center", md: "flex-start" },
              "& .MuiButton-startIcon": { mr: { xs: 0, md: 1 } },
              "& span": { display: { xs: "none", md: "inline" } },
            }}
          >
            <span>Storefront</span>
          </Button>

          {user && (
            <Button
              variant="text"
              color="error"
              startIcon={<LogoutIcon />}
              onClick={() => { logout(); navigate("/"); }}
              fullWidth
              sx={{
                borderRadius: 2.5,
                py: 1,
                textTransform: "none",
                fontWeight: 700,
                justifyContent: { xs: "center", md: "flex-start" },
                "& .MuiButton-startIcon": { mr: { xs: 0, md: 1 } },
                "& span": { display: { xs: "none", md: "inline" } },
              }}
            >
              <span>Logout</span>
            </Button>
          )}
        </Box>
      </Box>

      {/* Main Content Area */}
      <Box sx={{ flexGrow: 1, display: "flex", flexDirection: "column", minWidth: 0 }}>
        {/* Ultra-Slim Executive Top Bar */}
        <Paper
          elevation={0}
          sx={{
            py: 1.5,
            px: { xs: 2, md: 4 },
            bgcolor: isDark ? "#1e1e2d" : "#ffffff",
            borderBottom: "1px solid",
            borderColor: isDark ? "rgba(255,255,255,0.08)" : "rgba(0,0,0,0.06)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            position: "sticky",
            top: 0,
            zIndex: 90,
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 800, color: isDark ? "#f8fafc" : "#1e293b", textTransform: "capitalize" }}>
            {sidebarItems[tab]?.label || "Dashboard"}
          </Typography>

          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Chip
              label="🟢 Live MongoDB Engine"
              size="small"
              sx={{
                fontWeight: 700,
                bgcolor: alpha("#10b981", 0.1),
                color: "#10b981",
                display: { xs: "none", sm: "inline-flex" },
                border: "1px solid",
                borderColor: alpha("#10b981", 0.3),
              }}
            />

            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: "#ec4899",
                  fontWeight: 800,
                  fontSize: "0.9rem",
                  boxShadow: "0 2px 8px rgba(236,72,153,0.3)",
                }}
              >
                {user?.name ? user.name.charAt(0).toUpperCase() : "A"}
              </Avatar>
              <Box sx={{ display: { xs: "none", sm: "block" } }}>
                <Typography variant="body2" sx={{ fontWeight: 700, lineHeight: 1.2, color: isDark ? "#f8fafc" : "#1e293b" }}>
                  {user?.name || "Admin Access"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#ec4899", fontWeight: 700, display: "block", fontSize: "0.7rem" }}>
                  Store Administrator
                </Typography>
              </Box>
            </Box>
          </Box>
        </Paper>

        {/* Scrollable Content Container */}
        <Box sx={{ p: { xs: 2, md: 3.5 }, flexGrow: 1 }}>
          {error && (
            <Alert severity="warning" sx={{ mb: 3, borderRadius: 3 }}>
              {error} - Some backend features require admin credentials.
            </Alert>
          )}

          {/* Tab 0: Dashboard */}
          {tab === 0 && (
            <AdminDashboardOverview
              stats={stats}
              orders={orders}
              products={products}
              customers={customers}
            />
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

        {/* Tab 4: Live Sign-Ins & Customers */}
        {tab === 4 && (
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
              <Box>
                <Typography variant="h6" sx={{ fontWeight: 800, color: "text.primary" }}>
                  Live Registered Customers & OAuth Sign-Ins
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Real-time feed from MongoDB Atlas of every customer who has signed in or registered.
                </Typography>
              </Box>
              <Chip
                label={`Total Accounts: ${customers.length}`}
                color="primary"
                sx={{ fontWeight: 700, px: 2, py: 2, borderRadius: 3 }}
              />
            </Box>
            {customers.length === 0 ? (
              <Typography color="text.secondary" py={4} textAlign="center">No customer accounts found yet.</Typography>
            ) : (
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: alpha("#8b5cf6", 0.05) }}>
                    <TableCell sx={{ fontWeight: 700 }}>User / Avatar</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Email & Contact</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Sign-In Date</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Orders</TableCell>
                    <TableCell sx={{ fontWeight: 700 }}>Total Spent</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {customers.map((c) => (
                    <TableRow key={c.id} sx={{ "&:hover": { bgcolor: alpha("#8b5cf6", 0.02) } }}>
                      <TableCell>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                          <Avatar src={c.image} alt={c.name} sx={{ bgcolor: "primary.main", fontWeight: 700 }}>
                            {c.name ? c.name.charAt(0).toUpperCase() : "U"}
                          </Avatar>
                          <Box>
                            <Typography sx={{ fontWeight: 700 }}>{c.name}</Typography>
                            {c.role === "admin" && <Chip label="Admin" size="small" color="secondary" sx={{ height: 20, fontSize: "0.7rem", fontWeight: 700 }} />}
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>{c.email}</Typography>
                        <Typography variant="caption" color="text.secondary">{c.phone || "No phone saved"}</Typography>
                      </TableCell>
                      <TableCell>
                        <Typography variant="body2">{new Date(c.createdAt).toLocaleDateString()}</Typography>
                        <Typography variant="caption" color="text.secondary">{new Date(c.createdAt).toLocaleTimeString()}</Typography>
                      </TableCell>
                      <TableCell>
                        <Chip label={`${c.orderCount || 0} orders`} size="small" variant="outlined" sx={{ fontWeight: 700 }} />
                      </TableCell>
                      <TableCell sx={{ fontWeight: 800, color: "#10b981" }}>
                        ₹{c.totalSpent || 0}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Paper>
        )}
        </Box>
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
