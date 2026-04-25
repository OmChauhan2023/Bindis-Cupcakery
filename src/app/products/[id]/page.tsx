"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  IconButton,
  Chip,
  Rating,
  Skeleton,
  Breadcrumbs,
  alpha,
  Divider,
  Grid,
  Alert,
} from "@mui/material";
import {
  ShoppingCart as CartIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowBack as BackIcon,
  LocalShipping as ShippingIcon,
  Verified as VerifiedIcon,
  Favorite as HeartIcon,
  FavoriteBorder as HeartBorderIcon,
  Star as StarIcon,
} from "@mui/icons-material";
import { useCart } from "@/app/cart/components/CartContext";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function ProductDetailPage() {
  const { id } = useParams();
  const { cart, addToCart, updateQuantity } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [wishlisted, setWishlisted] = useState(false);
  const [qty, setQty] = useState(1);

  const cartItem = cart.find((item) => item.id === Number(id));
  const cartQty = cartItem ? cartItem.qty : 0;

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        setProduct(data.product);
      } catch {
        setError("Product not found");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6}>
          <Grid item xs={12} md={6}>
            <Skeleton variant="rounded" height={500} sx={{ borderRadius: 4 }} />
          </Grid>
          <Grid item xs={12} md={6}>
            <Skeleton variant="text" height={60} width="70%" />
            <Skeleton variant="text" height={30} width="40%" sx={{ mt: 2 }} />
            <Skeleton variant="text" height={100} sx={{ mt: 2 }} />
            <Skeleton variant="rounded" height={60} sx={{ mt: 4, borderRadius: "50px" }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  if (error || !product) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="h2" sx={{ mb: 2 }}>😢</Typography>
        <Typography variant="h5" fontWeight={700} mb={1}>Product Not Found</Typography>
        <Typography color="text.secondary" mb={4}>{error}</Typography>
        <Button
          component={Link}
          href="/products"
          variant="contained"
          startIcon={<BackIcon />}
          sx={{ borderRadius: "50px", px: 4, background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}
        >
          Back to Products
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs sx={{ mb: 4 }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
          <Link href="/products" style={{ textDecoration: "none", color: "inherit" }}>Products</Link>
          <Typography color="primary.main" fontWeight={600}>{product.name}</Typography>
        </Breadcrumbs>

        <Grid container spacing={6} alignItems="flex-start">
          {/* Product Image */}
          <Grid item xs={12} md={6}>
            <Box
              sx={{
                position: "relative",
                borderRadius: 5,
                overflow: "hidden",
                boxShadow: "0 20px 60px rgba(236,72,153,0.15)",
                aspectRatio: "1",
                bgcolor: "white",
              }}
            >
              <Image
                src={product.image}
                alt={product.name}
                fill
                style={{ objectFit: "cover" }}
                priority
              />
              {/* Wishlist */}
              <IconButton
                onClick={() => setWishlisted(!wishlisted)}
                sx={{
                  position: "absolute",
                  top: 16,
                  right: 16,
                  bgcolor: alpha("#fff", 0.9),
                  backdropFilter: "blur(8px)",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
                  "&:hover": { bgcolor: "white" },
                }}
              >
                {wishlisted ? (
                  <HeartIcon sx={{ color: "primary.main" }} />
                ) : (
                  <HeartBorderIcon sx={{ color: "text.secondary" }} />
                )}
              </IconButton>
            </Box>
          </Grid>

          {/* Product Info */}
          <Grid item xs={12} md={6}>
            <Box sx={{ position: "sticky", top: 100 }}>
              <Chip
                label="🌿 100% Eggless"
                size="small"
                sx={{ bgcolor: alpha("#22c55e", 0.1), color: "#16a34a", fontWeight: 700, mb: 2 }}
              />
              <Typography variant="h3" fontWeight={800} mb={1} lineHeight={1.2}>
                {product.name}
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <Rating value={4.8} precision={0.1} readOnly size="small" />
                <Typography variant="body2" color="text.secondary">(48 reviews)</Typography>
              </Box>

              <Typography
                variant="h4"
                fontWeight={800}
                sx={{
                  background: "linear-gradient(135deg, #be185d, #7c3aed)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  mb: 3,
                }}
              >
                ₹{product.price}
              </Typography>

              <Typography variant="body1" color="text.secondary" lineHeight={1.9} mb={4}>
                {product.description}
              </Typography>

              <Divider sx={{ mb: 3 }} />

              {/* Quantity + Cart Controls */}
              {cartQty > 0 ? (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Typography fontWeight={600} color="text.secondary">In Cart:</Typography>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      border: "2px solid",
                      borderColor: "primary.main",
                      borderRadius: "50px",
                      px: 2,
                      py: 0.8,
                    }}
                  >
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(product.id, Math.max(0, cartQty - 1))}
                      sx={{ color: "primary.main", p: 0.5 }}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography fontWeight={700} fontSize="1.1rem" sx={{ minWidth: 28, textAlign: "center" }}>
                      {cartQty}
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => updateQuantity(product.id, cartQty + 1)}
                      sx={{ color: "primary.main", p: 0.5 }}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      border: "1.5px solid",
                      borderColor: "divider",
                      borderRadius: "50px",
                      px: 2,
                      py: 0.8,
                    }}
                  >
                    <IconButton size="small" onClick={() => setQty((q) => Math.max(1, q - 1))} sx={{ p: 0.5 }}>
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography fontWeight={700} sx={{ minWidth: 28, textAlign: "center" }}>
                      {qty}
                    </Typography>
                    <IconButton size="small" onClick={() => setQty((q) => q + 1)} sx={{ p: 0.5 }}>
                      <AddIcon fontSize="small" />
                    </IconButton>
                  </Box>
                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    startIcon={<CartIcon />}
                    onClick={() =>
                      addToCart({ id: product.id, name: product.name, image: product.image, price: product.price, qty })
                    }
                    sx={{
                      borderRadius: "50px",
                      py: 1.8,
                      fontWeight: 700,
                      fontSize: "1.05rem",
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
                    Add to Cart
                  </Button>
                </Box>
              )}

              {/* Trust Badges */}
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mt: 2 }}>
                {[
                  { icon: <ShippingIcon fontSize="small" />, label: "Free Pickup" },
                  { icon: <VerifiedIcon fontSize="small" />, label: "100% Fresh" },
                  { icon: <StarIcon fontSize="small" />, label: "Premium Quality" },
                ].map(({ icon, label }) => (
                  <Box
                    key={label}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.8,
                      px: 2,
                      py: 0.8,
                      borderRadius: 2,
                      bgcolor: alpha("#ec4899", 0.07),
                      color: "primary.dark",
                    }}
                  >
                    {icon}
                    <Typography variant="caption" fontWeight={600}>{label}</Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}