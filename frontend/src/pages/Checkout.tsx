import { useCart } from "@/context/CartContext";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Chip,
} from "@mui/material";
import {
  Person as PersonIcon,
  CreditCard as PaymentIcon,
  CheckCircle as CheckIcon,
  ShoppingBag as BagIcon,
  LocalOffer as OfferIcon,
} from "@mui/icons-material";
import api from "@/services/api";

const CheckoutPage = () => {
  const { cart, clearCart, promo } = useCart();
  const navigate = useNavigate();

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

  const subtotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);
  const discount = promo ? Math.round(subtotal * (promo.percent / 100)) : 0;
  const deliveryFee = subtotal > 500 ? 0 : subtotal > 0 ? 40 : 0;
  const total = Math.max(0, subtotal - discount + deliveryFee);

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
      const res = await api.post("/orders", {
        customer: {
          name: userDetails.name.trim(),
          email: userDetails.email.trim(),
          phone: userDetails.phone.trim(),
        },
        deliveryAddress: userDetails.address.trim(),
        paymentMethod: userDetails.paymentMethod,
        promoCode: promo?.code,
        items: cart.map((c) => ({
          id: c.id,
          qty: c.qty,
          price: c.price,
          customizations: c.customizations,
          note: c.note,
        })),
      });
      const data = res.data;
      navigate(`/cart/confirmation?orderId=${data.orderId}`);
      setTimeout(() => clearCart(), 800);
    } catch (err: any) {
      const msg = err.response?.data?.message || err.message || "Network error";
      setServerError(msg);
      setSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <Container maxWidth="sm" sx={{ py: 12, textAlign: "center" }}>
        <Typography variant="h1" sx={{ fontSize: "4rem", mb: 2 }}>🛒</Typography>
        <Typography variant="h5" fontWeight={700} mb={1}>Your cart is empty</Typography>
        <Button
          onClick={() => navigate("/products")}
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
                <Box key={item.cartKey || item.id} sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Typography color="text.secondary" sx={{ flex: 1, mr: 1 }} noWrap>
                    {item.name} <Typography component="span" variant="caption" sx={{ color: "text.disabled" }}>×{item.qty}</Typography>
                  </Typography>
                  <Typography fontWeight={600}>₹{(item.qty * item.price).toFixed(0)}</Typography>
                </Box>
              ))}

              <Divider sx={{ my: 2 }} />

              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1 }}>
                <Typography color="text.secondary">Subtotal</Typography>
                <Typography fontWeight={600}>₹{subtotal.toFixed(0)}</Typography>
              </Box>
              {promo && discount > 0 && (
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1, alignItems: "center" }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                    <OfferIcon sx={{ fontSize: 16, color: "#059669" }} />
                    <Typography component="div" sx={{ color: "#059669", display: "flex", alignItems: "center" }}>
                      Promo <Chip label={promo.code} size="small" sx={{ height: 18, fontSize: "0.65rem", fontWeight: 700, bgcolor: alpha("#10b981", 0.12), color: "#059669", ml: 0.5 }} />
                    </Typography>
                  </Box>
                  <Typography fontWeight={700} sx={{ color: "#059669" }}>− ₹{discount}</Typography>
                </Box>
              )}
              <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
                <Typography color="text.secondary">Delivery</Typography>
                {deliveryFee === 0 ? (
                  <Chip label="FREE" size="small" sx={{ bgcolor: alpha("#10b981", 0.12), color: "#059669", fontWeight: 700 }} />
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
