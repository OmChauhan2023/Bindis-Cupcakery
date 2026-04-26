"use client";
import { useCart } from "@/app/cart/components/CartContext";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Divider,
  Paper,
  alpha,
  Grid,
  Chip,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as BackIcon,
} from "@mui/icons-material";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart } = useCart();

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);

  if (cart.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #fce7f3 0%, #f5f3ff 100%)",
        }}
      >
        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h1" sx={{ fontSize: "5rem", mb: 2 }}>🛒</Typography>
          <Typography variant="h4" fontWeight={700} mb={1}>Your cart is empty!</Typography>
          <Typography color="text.secondary" mb={4}>
            Looks like you haven&apos;t added any treats yet.
          </Typography>
          <Button
            component={Link}
            href="/products"
            variant="contained"
            size="large"
            sx={{
              borderRadius: "50px",
              px: 5,
              py: 1.8,
              fontWeight: 700,
              background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
              boxShadow: "0 8px 30px rgba(236,72,153,0.35)",
            }}
          >
            Browse Products
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", py: 6 }}>
      <Container maxWidth="lg">
        {/* Title */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 3, fontWeight: 700 }}>
            your order
          </Typography>
          <Typography variant="h3" fontWeight={800}>
            Shopping Cart 🛍️
          </Typography>
          <Chip
            label={`${itemCount} item${itemCount !== 1 ? "s" : ""}`}
            size="small"
            sx={{ mt: 1, bgcolor: alpha("#ec4899", 0.1), color: "primary.dark", fontWeight: 700 }}
          />
        </Box>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
              {cart.map((item, index) => (
                <Box key={item.id}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 3,
                      p: 3,
                      transition: "bgcolor 0.2s",
                      "&:hover": { bgcolor: alpha("#ec4899", 0.02) },
                    }}
                  >
                    {/* Product Image */}
                    <Box
                      sx={{
                        width: 90,
                        height: 90,
                        flexShrink: 0,
                        borderRadius: 3,
                        overflow: "hidden",
                        position: "relative",
                        boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                      }}
                    >
                      <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} />
                    </Box>

                    {/* Info */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography variant="subtitle1" fontWeight={700} noWrap>{item.name}</Typography>
                      <Typography
                        variant="h6"
                        fontWeight={800}
                        sx={{
                          background: "linear-gradient(135deg, #be185d, #7c3aed)",
                          WebkitBackgroundClip: "text",
                          WebkitTextFillColor: "transparent",
                        }}
                      >
                        ₹{item.price}
                      </Typography>
                    </Box>

                    {/* Qty Controls */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        border: "1.5px solid",
                        borderColor: "divider",
                        borderRadius: "50px",
                        px: 1.5,
                        py: 0.5,
                      }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.qty - 1)}
                        sx={{ color: "primary.main", p: 0.5 }}
                      >
                        <RemoveIcon fontSize="small" />
                      </IconButton>
                      <Typography fontWeight={700} sx={{ minWidth: 24, textAlign: "center" }}>
                        {item.qty}
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={() => updateQuantity(item.id, item.qty + 1)}
                        sx={{ color: "primary.main", p: 0.5 }}
                      >
                        <AddIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Subtotal */}
                    <Typography fontWeight={700} sx={{ minWidth: 70, textAlign: "right", color: "text.primary" }}>
                      ₹{(item.qty * item.price).toFixed(0)}
                    </Typography>

                    {/* Remove */}
                    <IconButton
                      onClick={() => removeFromCart(item.id)}
                      sx={{
                        color: "text.disabled",
                        "&:hover": { color: "error.main", bgcolor: alpha("#ef4444", 0.08) },
                        transition: "all 0.2s",
                      }}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  {index < cart.length - 1 && <Divider />}
                </Box>
              ))}
            </Paper>

            <Button
              component={Link}
              href="/products"
              startIcon={<BackIcon />}
              sx={{ mt: 3, color: "text.secondary", "&:hover": { color: "primary.main" } }}
            >
              Continue Shopping
            </Button>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                p: 3,
                position: "sticky",
                top: 100,
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={3}>Order Summary</Typography>

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography color="text.secondary">Subtotal ({itemCount} items)</Typography>
                <Typography fontWeight={600}>₹{total.toFixed(0)}</Typography>
              </Box>
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography color="text.secondary">Delivery</Typography>
                <Chip label="Free Pickup" size="small" sx={{ bgcolor: alpha("#22c55e", 0.1), color: "#16a34a", fontWeight: 600 }} />
              </Box>

              <Divider sx={{ my: 2.5 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 3 }}>
                <Typography variant="h6" fontWeight={700}>Total</Typography>
                <Typography
                  variant="h6"
                  fontWeight={800}
                  sx={{
                    background: "linear-gradient(135deg, #be185d, #7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                  }}
                >
                  ₹{total.toFixed(0)}
                </Typography>
              </Box>

              <Button
                component={Link}
                href="/cart/checkout"
                fullWidth
                variant="contained"
                size="large"
                endIcon={<ArrowForwardIcon />}
                sx={{
                  borderRadius: "50px",
                  py: 1.8,
                  fontWeight: 700,
                  fontSize: "1rem",
                  background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                  boxShadow: "0 8px 30px rgba(236,72,153,0.35)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #be185d, #7c3aed)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 40px rgba(236,72,153,0.45)",
                  },
                  transition: "all 0.3s",
                }}
              >
                Proceed to Checkout
              </Button>

              {/* Trust Badges */}
              <Box sx={{ mt: 3, p: 2, bgcolor: alpha("#ec4899", 0.04), borderRadius: 3 }}>
                <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                  🔒 Secure Checkout &nbsp;•&nbsp; 🌿 Fresh Ingredients &nbsp;•&nbsp; 💯 Quality Guaranteed
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CartPage;
