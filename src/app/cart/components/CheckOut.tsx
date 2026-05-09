"use client";
import { useCart } from "@/app/cart/components/CartContext";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  Button,
  TextField,
  Paper,
  Grid,
  Divider,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Alert,
  CircularProgress,
  alpha,
  SelectChangeEvent,
} from "@mui/material";
import {
  Person as PersonIcon,
  CreditCard as PaymentIcon,
  CheckCircle as CheckIcon,
  ShoppingBag as BagIcon,
} from "@mui/icons-material";

const CheckoutPage = () => {
  const { cart, clearCart } = useCart();
  const router = useRouter();

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "UPI",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");

  const total = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

  const handleChange = (
    e:
      | React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | SelectChangeEvent<string>
  ) => {
    const { name, value } = e.target as { name: string; value: string };
    setUserDetails({ ...userDetails, [name]: value });
    if (errors[name]) setErrors({ ...errors, [name]: "" });
    if (serverError) setServerError("");
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!userDetails.name.trim()) newErrors.name = "Name is required";
    if (!userDetails.email.trim()) newErrors.email = "Email is required";
    else if (!/^\S+@\S+\.\S+$/.test(userDetails.email)) newErrors.email = "Invalid email";
    if (!userDetails.phone.trim()) newErrors.phone = "Phone is required";
    if (!userDetails.address.trim()) newErrors.address = "Address is required";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleOrder = async () => {
    if (!validate()) return;
    setSubmitting(true);
    setServerError("");
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: userDetails.name.trim(),
            email: userDetails.email.trim(),
            phone: userDetails.phone.trim(),
          },
          deliveryAddress: userDetails.address.trim(),
          paymentMethod: userDetails.paymentMethod,
          items: cart.map((c) => ({
            id: c.id,
            qty: c.qty,
            price: c.price,
            customizations: c.customizations,
            note: c.note,
          })),
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || "Could not place order");
        setSubmitting(false);
        return;
      }
      router.push(`/cart/confirmation?orderId=${data.orderId}`);
      setTimeout(() => clearCart(), 800);
    } catch (err) {
      setServerError((err as Error).message || "Network error");
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="h1" sx={{ fontSize: "4rem", mb: 2 }}>🛒</Typography>
        <Typography variant="h5" fontWeight={700} mb={1}>Your cart is empty</Typography>
        <Button
          href="/products"
          variant="contained"
          sx={{ mt: 2, borderRadius: "50px", px: 4, background: "linear-gradient(135deg, #ec4899, #8b5cf6)" }}
        >
          Shop Now
        </Button>
      </Container>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", py: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ mb: 5 }}>
          <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 3, fontWeight: 700 }}>
            almost there!
          </Typography>
          <Typography variant="h3" fontWeight={800}>Checkout 🧾</Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Form Section */}
          <Grid item xs={12} md={7}>
            {/* Customer Details */}
            <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", p: 4, mb: 3 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha("#ec4899", 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PersonIcon sx={{ color: "primary.main", fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight={700}>Customer Details</Typography>
              </Box>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Full Name"
                    name="name"
                    value={userDetails.name}
                    onChange={handleChange}
                    error={!!errors.name}
                    helperText={errors.name}
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Email Address"
                    name="email"
                    type="email"
                    value={userDetails.email}
                    onChange={handleChange}
                    error={!!errors.email}
                    helperText={errors.email}
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Phone Number"
                    name="phone"
                    type="tel"
                    value={userDetails.phone}
                    onChange={handleChange}
                    error={!!errors.phone}
                    helperText={errors.phone}
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    label="Delivery / Pickup Address"
                    name="address"
                    value={userDetails.address}
                    onChange={handleChange}
                    error={!!errors.address}
                    helperText={errors.address}
                    multiline
                    rows={2}
                    variant="outlined"
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                  />
                </Grid>
              </Grid>
            </Paper>

            {/* Payment Method */}
            <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", p: 4 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha("#8b5cf6", 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <PaymentIcon sx={{ color: "#8b5cf6", fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight={700}>Payment Method</Typography>
              </Box>
              <FormControl fullWidth>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  name="paymentMethod"
                  value={userDetails.paymentMethod}
                  label="Payment Method"
                  onChange={handleChange}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="UPI">📱 UPI</MenuItem>
                  <MenuItem value="Credit Card">💳 Credit / Debit Card</MenuItem>
                  <MenuItem value="Cash on Delivery">💵 Cash on Pickup</MenuItem>
                </Select>
              </FormControl>
            </Paper>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} md={5}>
            <Paper
              elevation={0}
              sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", p: 3, position: "sticky", top: 100 }}
            >
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, mb: 3 }}>
                <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha("#ec4899", 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BagIcon sx={{ color: "primary.main", fontSize: 20 }} />
                </Box>
                <Typography variant="h6" fontWeight={700}>Order Summary</Typography>
              </Box>

              {cart.map((item) => (
                <Box key={item.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ flex: 1, mr: 1 }} noWrap>
                    {item.name} <Typography component="span" variant="caption" sx={{ color: "text.disabled" }}>×{item.qty}</Typography>
                  </Typography>
                  <Typography fontWeight={600}>₹{(item.qty * item.price).toFixed(0)}</Typography>
                </Box>
              ))}

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

              {serverError && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {serverError}
                </Alert>
              )}
              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleOrder}
                disabled={submitting}
                startIcon={submitting ? <CircularProgress size={18} sx={{ color: "white" }} /> : <CheckIcon />}
                sx={{
                  borderRadius: "50px",
                  py: 1.8,
                  fontWeight: 700,
                  fontSize: "1rem",
                  background: "linear-gradient(135deg, #d97a9c, #9b7bd0)",
                  boxShadow: "0 8px 24px rgba(217,122,156,0.28)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #c2628a, #8568b8)",
                    transform: "translateY(-2px)",
                    boxShadow: "0 12px 32px rgba(217,122,156,0.35)",
                  },
                  transition: "all 0.3s",
                }}
              >
                {submitting ? "Placing order…" : "Place Order"}
              </Button>

              <Box sx={{ mt: 2, p: 2, bgcolor: alpha("#ec4899", 0.04), borderRadius: 3 }}>
                <Typography variant="caption" color="text.secondary" textAlign="center" display="block">
                  🔒 Your information is secure &amp; encrypted
                </Typography>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default CheckoutPage;
