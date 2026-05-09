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
  Stack,
  Tooltip,
  TextField,
} from "@mui/material";
import {
  Delete as DeleteIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  ArrowForward as ArrowForwardIcon,
  ArrowBack as BackIcon,
  LocalOffer as OfferIcon,
  CardGiftcard as GiftIcon,
  LocalShipping as ShippingIcon,
  CheckCircle as CheckIcon,
} from "@mui/icons-material";
import { useState } from "react";

const CartPage = () => {
  const { cart, updateQuantity, removeFromCart, promo, applyPromo, clearPromo } = useCart();
  const [promoInput, setPromoInput] = useState(promo?.code || "");
  const [promoStatus, setPromoStatus] = useState<{ ok: boolean; msg: string } | null>(
    promo ? { ok: true, msg: `🎉 ${promo.label} applied!` } : null
  );

  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const itemCount = cart.reduce((sum, item) => sum + item.qty, 0);
  const discount = promo ? Math.round(subtotal * (promo.percent / 100)) : 0;
  const deliveryFee = subtotal > 500 ? 0 : subtotal > 0 ? 40 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

  const handleApply = () => {
    const code = promoInput.trim();
    if (!code) {
      clearPromo();
      setPromoStatus(null);
      return;
    }
    const result = applyPromo(code);
    setPromoStatus({ ok: result.ok, msg: result.message });
  };

  if (cart.length === 0) {
    return (
      <Box
        sx={{
          minHeight: "80vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(160deg, #fdf4ed 0%, #fff 50%, #f4eef9 100%)",
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
              background: "linear-gradient(135deg, #d97a9c, #9b7bd0)",
              boxShadow: "0 8px 24px rgba(217,122,156,0.28)",
              "&:hover": { background: "linear-gradient(135deg, #c2628a, #8568b8)" },
            }}
          >
            Browse Products
          </Button>
        </Box>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fdfaf7", py: 6 }}>
      <Container maxWidth="lg">
        {/* Title */}
        <Box sx={{ mb: 5 }}>
          <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 3, fontWeight: 700 }}>
            your order
          </Typography>
          <Typography variant="h3" fontWeight={800}>
            Shopping Cart 🛍️
          </Typography>
          <Stack direction="row" spacing={1} mt={1.5}>
            <Chip
              label={`${itemCount} item${itemCount !== 1 ? "s" : ""}`}
              size="small"
              sx={{ bgcolor: alpha("#d97a9c", 0.12), color: "#9d4870", fontWeight: 700 }}
            />
            <Chip
              icon={<ShippingIcon sx={{ fontSize: 14 }} />}
              label={deliveryFee === 0 ? "Free delivery unlocked" : `Add ₹${500 - subtotal} more for free delivery`}
              size="small"
              sx={{
                bgcolor: deliveryFee === 0 ? alpha("#10b981", 0.12) : alpha("#f59e0b", 0.12),
                color: deliveryFee === 0 ? "#059669" : "#b45309",
                fontWeight: 600,
              }}
            />
          </Stack>
        </Box>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} md={8}>
            <Stack spacing={2}>
              {cart.map((item) => {
                const cartKey = item.cartKey!;
                return (
                  <Paper
                    key={cartKey}
                    elevation={0}
                    sx={{
                      borderRadius: 4,
                      border: "1px solid",
                      borderColor: "divider",
                      p: 2.5,
                      transition: "all 0.2s",
                      "&:hover": {
                        borderColor: alpha("#d97a9c", 0.4),
                        boxShadow: `0 8px 24px ${alpha("#d97a9c", 0.1)}`,
                      },
                    }}
                  >
                    <Box sx={{ display: "flex", gap: 2.5, alignItems: { xs: "flex-start", sm: "center" }, flexWrap: { xs: "wrap", sm: "nowrap" } }}>
                      {/* Image */}
                      <Box
                        sx={{
                          width: 96,
                          height: 96,
                          flexShrink: 0,
                          borderRadius: 3,
                          overflow: "hidden",
                          position: "relative",
                          boxShadow: "0 4px 14px rgba(0,0,0,0.08)",
                        }}
                      >
                        <Image src={item.image} alt={item.name} fill style={{ objectFit: "cover" }} sizes="96px" />
                      </Box>

                      {/* Info + customizations */}
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography variant="subtitle1" fontWeight={700} sx={{ mb: 0.3 }}>
                          {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          fontWeight={700}
                          sx={{
                            color: "#9d4870",
                            mb: item.customizations && item.customizations.length > 0 ? 1 : 0,
                          }}
                        >
                          ₹{item.price} <Typography component="span" variant="caption" color="text.secondary">/ each</Typography>
                        </Typography>
                        {item.customizations && item.customizations.length > 0 && (
                          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                            {item.customizations.map((c, i) => (
                              <Chip
                                key={i}
                                label={`${c.label}: ${c.value}`}
                                size="small"
                                sx={{
                                  fontSize: "0.7rem",
                                  height: 22,
                                  bgcolor: alpha("#9b7bd0", 0.1),
                                  color: "#6d4c9e",
                                  fontWeight: 600,
                                }}
                              />
                            ))}
                          </Box>
                        )}
                      </Box>

                      {/* Qty + remove + subtotal */}
                      <Box sx={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 1.5, ml: "auto" }}>
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            border: "1.5px solid",
                            borderColor: "divider",
                            borderRadius: "50px",
                            px: 1,
                            py: 0.3,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(cartKey, item.qty - 1)}
                            disabled={item.qty <= 1}
                            sx={{ color: "#9d4870", p: 0.5 }}
                          >
                            <RemoveIcon fontSize="small" />
                          </IconButton>
                          <Typography fontWeight={700} sx={{ minWidth: 26, textAlign: "center" }}>
                            {item.qty}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(cartKey, item.qty + 1)}
                            sx={{ color: "#9d4870", p: 0.5 }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Typography fontWeight={800} sx={{ fontSize: "1.05rem" }}>
                            ₹{(item.qty * item.price).toFixed(0)}
                          </Typography>
                          <Tooltip title="Remove from cart">
                            <IconButton
                              size="small"
                              onClick={() => removeFromCart(cartKey)}
                              sx={{
                                color: "text.disabled",
                                "&:hover": { color: "error.main", bgcolor: alpha("#ef4444", 0.08) },
                              }}
                            >
                              <DeleteIcon fontSize="small" />
                            </IconButton>
                          </Tooltip>
                        </Box>
                      </Box>
                    </Box>
                  </Paper>
                );
              })}
            </Stack>

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
                bgcolor: "white",
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={2.5}>Order Summary</Typography>

              {/* Promo */}
              <Box sx={{ mb: 2.5 }}>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <TextField
                    size="small"
                    placeholder="Promo code"
                    value={promoInput}
                    onChange={(e) => { setPromoInput(e.target.value); setPromoStatus(null) }}
                    sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                    InputProps={{
                      startAdornment: <OfferIcon sx={{ fontSize: 18, color: "text.disabled", mr: 1 }} />,
                    }}
                  />
                  <Button
                    onClick={handleApply}
                    variant="outlined"
                    sx={{
                      borderRadius: 2,
                      fontWeight: 700,
                      borderColor: "#d97a9c",
                      color: "#9d4870",
                      "&:hover": { borderColor: "#9d4870", bgcolor: alpha("#f9c2d6", 0.18) },
                    }}
                  >
                    Apply
                  </Button>
                </Box>
                {promoStatus && (
                  <Typography
                    variant="caption"
                    sx={{ color: promoStatus.ok ? "#059669" : "error.main", mt: 0.5, display: "block", fontWeight: 600 }}
                  >
                    {promoStatus.msg}
                  </Typography>
                )}
                <Typography variant="caption" color="text.disabled" sx={{ mt: 0.5, display: "block" }}>
                  Try <strong>BINDI10</strong> for 10% off
                </Typography>
              </Box>

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                <Typography color="text.secondary">Subtotal ({itemCount} items)</Typography>
                <Typography fontWeight={600}>₹{subtotal.toFixed(0)}</Typography>
              </Box>
              {discount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Typography sx={{ color: "#059669" }}>Discount</Typography>
                  <Typography fontWeight={600} sx={{ color: "#059669" }}>− ₹{discount}</Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5, alignItems: "center" }}>
                <Typography color="text.secondary">Delivery</Typography>
                {deliveryFee === 0 ? (
                  <Chip
                    icon={<CheckIcon sx={{ fontSize: 14 }} />}
                    label="FREE"
                    size="small"
                    sx={{ bgcolor: alpha("#10b981", 0.12), color: "#059669", fontWeight: 700 }}
                  />
                ) : (
                  <Typography fontWeight={600}>₹{deliveryFee}</Typography>
                )}
              </Box>

              <Divider sx={{ my: 2 }} />

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
                  py: 1.6,
                  fontWeight: 700,
                  fontSize: "1rem",
                  background: "linear-gradient(135deg, #d97a9c, #9b7bd0)",
                  boxShadow: "0 8px 24px rgba(217,122,156,0.28)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #c2628a, #8568b8)",
                    transform: "translateY(-1px)",
                    boxShadow: "0 12px 32px rgba(217,122,156,0.35)",
                  },
                  transition: "all 0.25s",
                }}
              >
                Proceed to Checkout
              </Button>

              {/* Trust badges */}
              <Stack spacing={1} sx={{ mt: 3 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                  <CheckIcon sx={{ fontSize: 16, color: "#059669" }} />
                  <Typography variant="caption">Freshly baked, made to order</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                  <GiftIcon sx={{ fontSize: 16, color: "#d97a9c" }} />
                  <Typography variant="caption">Free gift wrap on orders over ₹800</Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1, color: "text.secondary" }}>
                  <ShippingIcon sx={{ fontSize: 16, color: "#9b7bd0" }} />
                  <Typography variant="caption">Same-day delivery within Surat</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CartPage;
