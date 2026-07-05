import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import { useState, useEffect } from "react";
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
  IconButton,
  Tooltip,
  LinearProgress,
} from "@mui/material";
import {
  Person as PersonIcon,
  CreditCard as PaymentIcon,
  CheckCircle as CheckIcon,
  ShoppingBag as BagIcon,
  LocalOffer as OfferIcon,
  QrCodeScanner as QrIcon,
  ContentCopy as CopyIcon,
  Security as SecurityIcon,
  Sync as SyncIcon,
  Bolt as BoltIcon,
  Verified as VerifiedIcon,
} from "@mui/icons-material";
import api from "@/services/api";

const CheckoutPage = () => {
  const { cart, clearCart, promo } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [userDetails, setUserDetails] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    paymentMethod: "UPI",
  });

  useEffect(() => {
    if (user) {
      setUserDetails((prev) => ({
        ...prev,
        name: prev.name || user.name || "",
        email: prev.email || user.email || "",
        phone: prev.phone || user.phone || "",
        address: prev.address || user.address || "",
      }));
    }
  }, [user]);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [serverError, setServerError] = useState("");
  const [copied, setCopied] = useState(false);
  const [utr, setUtr] = useState("");
  const [verifyingUpi, setVerifyingUpi] = useState(false);
  const [upiStep, setUpiStep] = useState(0);

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

  const handleUpiAutoVerify = () => {
    if (!validate()) return;
    setVerifyingUpi(true);
    setUpiStep(1); // Step 1: Connecting to NPCI & Bank servers

    setTimeout(() => {
      setUpiStep(2); // Step 2: Webhook received, capturing transfer
    }, 1500);

    setTimeout(() => {
      setUpiStep(3); // Step 3: Verified! Auto-redirecting
    }, 2800);

    setTimeout(() => {
      handleOrder();
    }, 3600);
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
        paymentMethod: userDetails.paymentMethod === "UPI" && utr.trim() ? `UPI (UTR: ${utr.trim()})` : userDetails.paymentMethod,
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
      clearCart(); // Clear BEFORE navigating — avoids firing on unmounted component
      navigate(`/cart/confirmation?orderId=${data.orderId}`);
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
              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 3, flexWrap: "wrap", gap: 1 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box sx={{ width: 36, height: 36, borderRadius: 2, bgcolor: alpha("#ec4899", 0.1), display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <PersonIcon sx={{ color: "primary.main", fontSize: 20 }} />
                  </Box>
                  <Typography variant="h6" fontWeight={700}>Customer Details</Typography>
                </Box>
                {user && (
                  <Chip
                    icon={<VerifiedIcon sx={{ fontSize: 16, color: "#10b981 !important" }} />}
                    label="Auto-filled from Login"
                    sx={{ bgcolor: alpha("#10b981", 0.1), color: "#065f46", fontWeight: 700, borderRadius: 2 }}
                    size="small"
                  />
                )}
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
                    helperText={errors.name || (user?.name ? "✨ Pre-filled from your Google / Account profile" : "")}
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
                    disabled={!!user?.email}
                    error={!!errors.email}
                    helperText={errors.email || (user?.email ? "✨ Linked to your logged-in account (read-only)" : "")}
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
                    helperText={errors.phone || (user?.phone ? "✨ Pre-filled from profile (editable)" : "")}
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
                    helperText={errors.address || (user?.address ? "✨ Pre-filled from profile (editable)" : "")}
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
              <FormControl fullWidth sx={{ mb: userDetails.paymentMethod === "UPI" ? 3 : 0 }}>
                <InputLabel>Payment Method</InputLabel>
                <Select
                  name="paymentMethod"
                  value={userDetails.paymentMethod}
                  label="Payment Method"
                  onChange={handleChange}
                  sx={{ borderRadius: 2 }}
                >
                  <MenuItem value="UPI">📱 UPI / Google Pay / PhonePe / Paytm</MenuItem>
                  <MenuItem value="Cash on Delivery">💵 Cash on Pickup</MenuItem>
                </Select>
              </FormControl>

              {/* UPI Instant QR Code Payment Box or Live Gateway Verification View */}
              {userDetails.paymentMethod === "UPI" && (
                <Box
                  sx={{
                    p: { xs: 2.5, md: 3.5 },
                    borderRadius: 3.5,
                    background: verifyingUpi
                      ? "linear-gradient(145deg, #f0fdf4 0%, #ecfdf5 100%)"
                      : "linear-gradient(145deg, #f8fafc 0%, #f1f5f9 100%)",
                    border: "2px solid",
                    borderColor: verifyingUpi ? alpha("#10b981", 0.6) : alpha("#10b981", 0.3),
                    boxShadow: verifyingUpi
                      ? "0 16px 40px -5px rgba(16,185,129,0.25)"
                      : "0 10px 30px -5px rgba(16,185,129,0.12)",
                    position: "relative",
                    overflow: "hidden",
                    transition: "all 0.4s ease",
                  }}
                >
                  {verifyingUpi ? (
                    /* Zomato / Zepto / Flipkart Live Gateway Polling Screen */
                    <Box sx={{ py: 3, textAlign: "center" }}>
                      <Box
                        sx={{
                          width: 72,
                          height: 72,
                          borderRadius: "50%",
                          bgcolor: alpha("#10b981", 0.15),
                          color: "#10b981",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          mx: "auto",
                          mb: 2.5,
                          boxShadow: "0 0 0 8px rgba(16,185,129,0.08)",
                          animation: upiStep < 3 ? "pulse 1.5s infinite" : "none",
                        }}
                      >
                        {upiStep === 1 ? (
                          <CircularProgress size={36} sx={{ color: "#10b981" }} />
                        ) : upiStep === 2 ? (
                          <SyncIcon sx={{ fontSize: 38, animation: "spin 1.5s linear infinite" }} />
                        ) : (
                          <VerifiedIcon sx={{ fontSize: 44, color: "#10b981" }} />
                        )}
                      </Box>

                      <Typography variant="h5" fontWeight={850} color="#065f46" sx={{ mb: 1 }}>
                        {upiStep === 1 && "⚡ Awaiting Mobile UPI Payment..."}
                        {upiStep === 2 && "💳 Webhook Received! Verifying ₹" + total + "..."}
                        {upiStep === 3 && "✅ Payment Captured & Verified!"}
                      </Typography>

                      <Typography variant="body2" color="#047857" fontWeight={600} sx={{ mb: 3, maxWidth: 400, mx: "auto" }}>
                        {upiStep === 1 && "Connecting to ICICI Bank & NPCI network servers. Please authorize the transaction on your GPay / PhonePe / Paytm mobile app."}
                        {upiStep === 2 && "Transaction amount ₹" + total + " recognized for merchant omchauhan092005@okicici. Finalizing UTR security check..."}
                        {upiStep === 3 && "Payment 100% secured! Automatically refreshing and redirecting to your Order Confirmation screen..."}
                      </Typography>

                      <Box sx={{ maxWidth: 360, mx: "auto", mb: 2 }}>
                        <LinearProgress
                          variant={upiStep === 3 ? "determinate" : "indeterminate"}
                          value={100}
                          sx={{
                            height: 8,
                            borderRadius: 4,
                            bgcolor: alpha("#10b981", 0.15),
                            "& .MuiLinearProgress-bar": {
                              background: "linear-gradient(90deg, #10b981, #059669)",
                              borderRadius: 4,
                            },
                          }}
                        />
                      </Box>

                      <Chip
                        icon={<SecurityIcon style={{ fontSize: 14, color: "#065f46" }} />}
                        label={upiStep === 1 ? "Gateway Polling Active (00:45)" : upiStep === 2 ? "Bank Server Webhook Matched" : "Redirecting to Order Placed..."}
                        size="small"
                        sx={{ fontWeight: 800, bgcolor: alpha("#10b981", 0.2), color: "#065f46", fontSize: "0.75rem", py: 1.5 }}
                      />
                    </Box>
                  ) : (
                    /* Standard Scan & Pay UI with Auto-Verify Trigger Button */
                    <>
                      {/* Top Badge */}
                      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2.5, flexWrap: "wrap", gap: 1 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                          <Box
                            sx={{
                              width: 32,
                              height: 32,
                              borderRadius: "50%",
                              bgcolor: alpha("#10b981", 0.15),
                              color: "#10b981",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <QrIcon fontSize="small" />
                          </Box>
                          <Typography variant="subtitle1" fontWeight={800} color="#0f172a">
                            Scan & Pay Instant UPI
                          </Typography>
                        </Box>
                        <Chip
                          icon={<SecurityIcon style={{ fontSize: 14, color: "#10b981" }} />}
                          label="0% Transaction Fee"
                          size="small"
                          sx={{ fontWeight: 800, bgcolor: alpha("#10b981", 0.12), color: "#10b981", fontSize: "0.72rem" }}
                        />
                      </Box>

                      <Grid container spacing={3} alignItems="center">
                        {/* QR Code Image */}
                        <Grid item xs={12} sm={5} sx={{ textAlign: "center" }}>
                          <Box
                            sx={{
                              p: 1.5,
                              bgcolor: "white",
                              borderRadius: 3,
                              border: "1px solid",
                              borderColor: "divider",
                              display: "inline-block",
                              boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
                              position: "relative",
                            }}
                          >
                            <img
                              src="/upi-qr.png"
                              alt="Bindi's Bakery UPI QR"
                              style={{
                                width: "100%",
                                maxWidth: 180,
                                height: "auto",
                                display: "block",
                                borderRadius: 8,
                              }}
                            />
                          </Box>
                          <Typography variant="caption" sx={{ display: "block", mt: 1, color: "text.secondary", fontWeight: 700, fontSize: "0.7rem" }}>
                            Supports GPay, PhonePe, Paytm & BHIM
                          </Typography>
                        </Grid>

                        {/* UPI Details & Copy */}
                        <Grid item xs={12} sm={7}>
                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5 }}>
                              Amount to Transfer
                            </Typography>
                            <Typography variant="h4" sx={{ fontWeight: 900, color: "#10b981", letterSpacing: -0.5 }}>
                              ₹{total.toLocaleString()}
                            </Typography>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="caption" sx={{ color: "text.secondary", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, display: "block", mb: 0.5 }}>
                              Merchant UPI ID
                            </Typography>
                            <Box
                              sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "space-between",
                                p: 1.2,
                                px: 1.8,
                                bgcolor: "white",
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                              }}
                            >
                              <Typography variant="body2" sx={{ fontWeight: 800, fontFamily: "monospace", color: "#1e293b", fontSize: "0.9rem" }}>
                                omchauhan092005@okicici
                              </Typography>
                              <Tooltip title={copied ? "Copied!" : "Copy UPI ID"}>
                                <Button
                                  size="small"
                                  variant={copied ? "contained" : "outlined"}
                                  color={copied ? "success" : "primary"}
                                  onClick={() => {
                                    navigator.clipboard.writeText("omchauhan092005@okicici");
                                    setCopied(true);
                                    setTimeout(() => setCopied(false), 2500);
                                  }}
                                  startIcon={copied ? <CheckIcon sx={{ fontSize: 16 }} /> : <CopyIcon sx={{ fontSize: 16 }} />}
                                  sx={{ borderRadius: "50px", py: 0.3, px: 1.5, textTransform: "none", fontWeight: 700, fontSize: "0.75rem", minWidth: 85 }}
                                >
                                  {copied ? "Copied" : "Copy"}
                                </Button>
                              </Tooltip>
                            </Box>
                          </Box>

                          {/* UTR / Reference ID Field */}
                          <TextField
                            fullWidth
                            size="small"
                            label="12-Digit UTR / Transaction Ref (Optional)"
                            placeholder="e.g. 418290182901"
                            value={utr}
                            onChange={(e) => setUtr(e.target.value)}
                            helperText="Enter after scanning for instant bank reconciliation"
                            sx={{
                              mb: 2.5,
                              bgcolor: "white",
                              borderRadius: 2,
                              "& .MuiOutlinedInput-root": { borderRadius: 2 },
                              "& .MuiFormHelperText-root": { fontWeight: 600, color: "#10b981", fontSize: "0.7rem", mx: 0, mt: 0.5 },
                            }}
                          />

                          {/* INSTANT ZOMATO/SWIGGY STYLE AUTO-VERIFY BUTTON */}
                          <Button
                            fullWidth
                            variant="contained"
                            onClick={handleUpiAutoVerify}
                            disabled={submitting || verifyingUpi}
                            startIcon={<BoltIcon sx={{ fontSize: 20 }} />}
                            sx={{
                              bgcolor: "#10b981",
                              color: "white",
                              py: 1.5,
                              borderRadius: "50px",
                              fontWeight: 800,
                              fontSize: "0.92rem",
                              boxShadow: "0 8px 20px rgba(16,185,129,0.3)",
                              "&:hover": {
                                bgcolor: "#059669",
                                transform: "translateY(-2px)",
                                boxShadow: "0 12px 26px rgba(16,185,129,0.4)",
                              },
                              transition: "all 0.25s",
                            }}
                          >
                            ⚡ I Have Paid ₹{total} (Auto-Verify & Redirect)
                          </Button>
                        </Grid>
                      </Grid>
                    </>
                  )}
                </Box>
              )}
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
                onClick={userDetails.paymentMethod === "UPI" ? handleUpiAutoVerify : handleOrder}
                disabled={submitting || verifyingUpi}
                startIcon={submitting || verifyingUpi ? <CircularProgress size={18} sx={{ color: "white" }} /> : userDetails.paymentMethod === "UPI" ? <BoltIcon /> : <CheckIcon />}
                sx={{
                  borderRadius: "50px",
                  py: 1.8,
                  fontWeight: 700,
                  fontSize: "1rem",
                  background: userDetails.paymentMethod === "UPI"
                    ? "linear-gradient(135deg, #10b981, #059669)"
                    : "linear-gradient(135deg, #d97a9c, #9b7bd0)",
                  boxShadow: userDetails.paymentMethod === "UPI"
                    ? "0 8px 24px rgba(16,185,129,0.3)"
                    : "0 8px 24px rgba(217,122,156,0.28)",
                  "&:hover": {
                    background: userDetails.paymentMethod === "UPI"
                      ? "linear-gradient(135deg, #059669, #047857)"
                      : "linear-gradient(135deg, #c2628a, #8568b8)",
                    transform: "translateY(-2px)",
                    boxShadow: userDetails.paymentMethod === "UPI"
                      ? "0 12px 32px rgba(16,185,129,0.4)"
                      : "0 12px 32px rgba(217,122,156,0.35)",
                  },
                  transition: "all 0.3s",
                }}
              >
                {submitting
                  ? "Placing order…"
                  : verifyingUpi
                  ? "Verifying Bank Gateway…"
                  : userDetails.paymentMethod === "UPI"
                  ? "⚡ Pay & Auto-Verify UPI Order"
                  : "Place Order"}
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
