import { useCart } from "@/context/CartContext";
import { useNavigate } from "react-router-dom";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Divider,
  TextField,
  Chip,
  alpha,
  Stack,
} from "@mui/material";
import {
  Close as CloseIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Delete as DeleteIcon,
  ShoppingBag as BagIcon,
  LocalOffer as PromoIcon,
} from "@mui/icons-material";
import { useState } from "react";

interface Props {
  open: boolean;
  onClose: () => void;
}

export default function CartDrawer({ open, onClose }: Props) {
  const { cart, updateQuantity, removeFromCart, clearCart, promo, applyPromo, clearPromo } = useCart();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState("");
  const [promoMsg, setPromoMsg] = useState("");
  const [promoError, setPromoError] = useState(false);

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = promo ? Math.round(subtotal * (promo.percent / 100)) : 0;
  const deliveryFee = subtotal > 500 ? 0 : subtotal > 0 ? 40 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);

  const handleApplyPromo = () => {
    const result = applyPromo(promoInput.trim().toUpperCase());
    setPromoMsg(result.message);
    setPromoError(!result.ok);
  };

  const handleCheckout = () => {
    onClose();
    navigate("/cart/checkout");
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: {
          width: { xs: "100vw", sm: 420 },
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          px: 3,
          py: 2.5,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #fce7f3 0%, #f5f3ff 100%)",
          borderBottom: "1px solid",
          borderColor: "divider",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <BagIcon sx={{ color: "#be185d" }} />
          <Typography variant="h6" fontWeight={800}>
            Shopping Cart
          </Typography>
          {cartCount > 0 && (
            <Chip
              label={cartCount}
              size="small"
              sx={{
                bgcolor: "#be185d",
                color: "white",
                fontWeight: 700,
                height: 22,
                fontSize: "0.75rem",
              }}
            />
          )}
        </Box>
        <IconButton onClick={onClose} size="small">
          <CloseIcon />
        </IconButton>
      </Box>

      {/* Empty State */}
      {cart.length === 0 ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: 2,
            p: 4,
          }}
        >
          <Typography sx={{ fontSize: "4rem" }}>🛒</Typography>
          <Typography variant="h6" fontWeight={700} color="text.secondary">
            Your cart is empty
          </Typography>
          <Typography variant="body2" color="text.disabled" textAlign="center">
            Add some delicious treats to get started!
          </Typography>
          <Button
            onClick={() => { onClose(); navigate("/products"); }}
            variant="contained"
            sx={{
              mt: 1,
              borderRadius: "50px",
              px: 4,
              py: 1.2,
              fontWeight: 700,
              background: "linear-gradient(135deg, #d97a9c, #9b7bd0)",
            }}
          >
            Browse Products
          </Button>
        </Box>
      ) : (
        <>
          {/* Cart Items */}
          <Box sx={{ flex: 1, overflowY: "auto", px: 2, py: 2 }}>
            <Stack spacing={1.5}>
              {cart.map((item) => {
                const imgSrc = item.image?.startsWith("http")
                  ? item.image
                  : item.image?.startsWith("/")
                  ? item.image
                  : `/${item.image}`;
                return (
                  <Box
                    key={item.cartKey}
                    sx={{
                      display: "flex",
                      gap: 1.5,
                      p: 1.5,
                      borderRadius: 3,
                      border: "1px solid",
                      borderColor: "divider",
                      bgcolor: "white",
                      alignItems: "flex-start",
                      transition: "box-shadow 0.2s",
                      "&:hover": { boxShadow: "0 4px 16px rgba(0,0,0,0.06)" },
                    }}
                  >
                    {/* Image */}
                    <Box
                      sx={{
                        width: 64,
                        height: 64,
                        borderRadius: 2,
                        overflow: "hidden",
                        flexShrink: 0,
                        bgcolor: "#fdf2f8",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                      }}
                    >
                      <img
                        src={imgSrc}
                        alt={item.name}
                        style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = "none";
                          const parent = (e.target as HTMLImageElement).parentElement;
                          if (parent && !parent.querySelector(".img-fallback")) {
                            const fb = document.createElement("div");
                            fb.className = "img-fallback";
                            fb.style.cssText = "font-size:1.8rem;display:flex;align-items:center;justify-content:center;width:100%;height:100%";
                            fb.textContent = "🧁";
                            parent.appendChild(fb);
                          }
                        }}
                      />
                    </Box>

                    {/* Details */}
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography
                        variant="body2"
                        fontWeight={700}
                        noWrap
                        sx={{ mb: 0.3 }}
                      >
                        {item.name}
                      </Typography>
                      {item.customizations && item.customizations.length > 0 && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ display: "block", mb: 0.5, lineHeight: 1.4 }}
                        >
                          {item.customizations.map((c) => `${c.label}: ${c.value}`).join(" · ")}
                        </Typography>
                      )}
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        {/* Qty controls */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: 0.5,
                            border: "1.5px solid",
                            borderColor: "divider",
                            borderRadius: 50,
                            px: 0.5,
                          }}
                        >
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.cartKey!, item.qty - 1)}
                            sx={{ color: "#9d4870", p: 0.3 }}
                          >
                            <RemoveIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                          <Typography
                            variant="body2"
                            fontWeight={700}
                            sx={{ minWidth: 20, textAlign: "center" }}
                          >
                            {item.qty}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => updateQuantity(item.cartKey!, item.qty + 1)}
                            sx={{ color: "#9d4870", p: 0.3 }}
                          >
                            <AddIcon sx={{ fontSize: 16 }} />
                          </IconButton>
                        </Box>

                        <Typography
                          variant="body2"
                          fontWeight={800}
                          sx={{
                            background: "linear-gradient(135deg, #be185d, #7c3aed)",
                            WebkitBackgroundClip: "text",
                            WebkitTextFillColor: "transparent",
                          }}
                        >
                          ₹{(item.price * item.qty).toFixed(0)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Delete */}
                    <IconButton
                      size="small"
                      onClick={() => removeFromCart(item.cartKey!)}
                      sx={{ color: "#ef4444", p: 0.5, mt: -0.5 }}
                    >
                      <DeleteIcon sx={{ fontSize: 18 }} />
                    </IconButton>
                  </Box>
                );
              })}
            </Stack>
          </Box>

          {/* Bottom Section */}
          <Box
            sx={{
              px: 2.5,
              py: 2,
              borderTop: "1px solid",
              borderColor: "divider",
              bgcolor: alpha("#fdfaf7", 0.98),
            }}
          >
            {/* Promo */}
            <Box sx={{ display: "flex", gap: 1, mb: 1.5 }}>
              {promo ? (
                <Box
                  sx={{
                    flex: 1,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    p: 1.2,
                    borderRadius: 2,
                    bgcolor: alpha("#22c55e", 0.08),
                    border: "1px solid",
                    borderColor: alpha("#22c55e", 0.3),
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <PromoIcon sx={{ color: "#22c55e", fontSize: 18 }} />
                    <Typography variant="body2" fontWeight={700} color="success.main">
                      {promo.label} applied!
                    </Typography>
                  </Box>
                  <IconButton size="small" onClick={() => { clearPromo(); setPromoMsg(""); setPromoInput(""); }} sx={{ p: 0.3 }}>
                    <CloseIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Box>
              ) : (
                <>
                  <TextField
                    size="small"
                    placeholder="Promo code (try BINDI10)"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleApplyPromo()}
                    sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 2, fontSize: "0.85rem" } }}
                  />
                  <Button
                    variant="outlined"
                    onClick={handleApplyPromo}
                    sx={{ borderRadius: 2, fontWeight: 700, whiteSpace: "nowrap", px: 2 }}
                  >
                    Apply
                  </Button>
                </>
              )}
            </Box>
            {promoMsg && !promo && (
              <Typography
                variant="caption"
                sx={{ color: promoError ? "error.main" : "success.main", display: "block", mb: 1 }}
              >
                {promoMsg}
              </Typography>
            )}

            {/* Price Breakdown */}
            <Stack spacing={0.8} sx={{ mb: 1.5 }}>
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">Subtotal</Typography>
                <Typography variant="body2" fontWeight={600}>₹{subtotal}</Typography>
              </Box>
              {discount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                  <Typography variant="body2" color="success.main">Discount ({promo?.percent}%)</Typography>
                  <Typography variant="body2" fontWeight={600} color="success.main">−₹{discount}</Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography variant="body2" color="text.secondary">
                  Delivery {subtotal > 500 ? "(Free! 🎉)" : ""}
                </Typography>
                <Typography variant="body2" fontWeight={600} color={deliveryFee === 0 ? "success.main" : "inherit"}>
                  {deliveryFee === 0 ? "Free" : `₹${deliveryFee}`}
                </Typography>
              </Box>
              <Divider />
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Typography fontWeight={800}>Total</Typography>
                <Typography
                  fontWeight={800}
                  sx={{
                    background: "linear-gradient(135deg, #be185d, #7c3aed)",
                    WebkitBackgroundClip: "text",
                    WebkitTextFillColor: "transparent",
                    fontSize: "1.1rem",
                  }}
                >
                  ₹{total}
                </Typography>
              </Box>
            </Stack>

            {/* Actions */}
            <Stack spacing={1}>
              <Button
                onClick={handleCheckout}
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  borderRadius: "50px",
                  py: 1.4,
                  fontWeight: 800,
                  fontSize: "1rem",
                  background: "linear-gradient(135deg, #d97a9c, #9b7bd0)",
                  boxShadow: "0 8px 24px rgba(217,122,156,0.32)",
                  "&:hover": { background: "linear-gradient(135deg, #c2628a, #8568b8)", transform: "translateY(-1px)" },
                  transition: "all 0.25s",
                }}
              >
                Checkout · ₹{total}
              </Button>
              <Button
                onClick={onClose}
                variant="text"
                fullWidth
                size="small"
                sx={{ color: "text.secondary", fontWeight: 600 }}
              >
                Continue Shopping
              </Button>
            </Stack>
          </Box>
        </>
      )}
    </Drawer>
  );
}
