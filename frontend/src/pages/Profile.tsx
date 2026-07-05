import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import {
  Box,
  Container,
  Paper,
  Typography,
  Avatar,
  Button,
  Grid,
  Tab,
  Tabs,
  Card,
  CardContent,
  Chip,
  TextField,
  Alert,
  CircularProgress,
  Snackbar,
  alpha,
  useTheme,
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import ShoppingBagIcon from "@mui/icons-material/ShoppingBag";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import LogoutIcon from "@mui/icons-material/Logout";
import CakeIcon from "@mui/icons-material/Cake";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import EmailIcon from "@mui/icons-material/Email";
import BadgeIcon from "@mui/icons-material/Badge";
import SecurityIcon from "@mui/icons-material/Security";
import PhoneIcon from "@mui/icons-material/Phone";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";

export default function ProfilePage() {
  const { user, updateUser, logout, isAdmin } = useAuth();
  const navigate = useNavigate();
  const theme = useTheme();
  const [tab, setTab] = useState(0);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editPhone, setEditPhone] = useState("");
  const [editAddress, setEditAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    if (user) {
      setEditName(user.name || "");
      setEditPhone(user.phone || "");
      setEditAddress(user.address || "");
    }
  }, [user]);

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editName.trim()) {
      setError("Name cannot be empty.");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await updateUser({
        name: editName.trim(),
        phone: editPhone.trim(),
        address: editAddress.trim(),
      });
      setSuccessMsg("Profile details updated successfully!");
      setIsEditing(false);
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to update profile. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setError("");
    if (user) {
      setEditName(user.name || "");
      setEditPhone(user.phone || "");
      setEditAddress(user.address || "");
    }
  };

  // Sample orders for instant visual gratification in the profile dashboard
  const mockOrders = [
    {
      id: "#ORD-9823",
      date: "July 2, 2026",
      items: "2x Belgian Dark Chocolate Dream, 1x Red Velvet Supreme",
      total: "₹650",
      status: "Delivered",
      statusColor: "success" as const,
    },
    {
      id: "#ORD-9741",
      date: "June 28, 2026",
      items: "6x Assorted Party Box Cupcakes",
      total: "₹1,200",
      status: "Delivered",
      statusColor: "success" as const,
    },
  ];

  return (
    <Box
      sx={{
        minHeight: "85vh",
        background: "linear-gradient(135deg, #fdf4ed 0%, #f4eef9 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="lg">
        {/* Snackbar for Success Notifications */}
        <Snackbar
          open={Boolean(successMsg)}
          autoHideDuration={4000}
          onClose={() => setSuccessMsg("")}
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert onClose={() => setSuccessMsg("")} severity="success" variant="filled" sx={{ width: "100%", fontWeight: 700 }}>
            {successMsg}
          </Alert>
        </Snackbar>

        {/* Header Profile Card */}
        <Paper
          elevation={0}
          sx={{
            p: { xs: 3, md: 5 },
            mb: 4,
            borderRadius: 4,
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.15),
            boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
          }}
        >
          <Grid container spacing={3} alignItems="center">
            <Grid item>
              <Avatar
                sx={{
                  width: { xs: 80, md: 100 },
                  height: { xs: 80, md: 100 },
                  bgcolor: theme.palette.primary.main,
                  fontSize: { xs: "2rem", md: "2.5rem" },
                  fontWeight: 700,
                  boxShadow: `0 8px 24px ${alpha(theme.palette.primary.main, 0.3)}`,
                  border: "4px solid white",
                }}
              >
                {user.name ? user.name.charAt(0).toUpperCase() : "U"}
              </Avatar>
            </Grid>
            <Grid item xs>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, flexWrap: "wrap", mb: 0.5 }}>
                <Typography variant="h3" sx={{ fontWeight: 800, color: "text.primary", fontSize: { xs: "1.8rem", md: "2.4rem" } }}>
                  {user.name}
                </Typography>
                <Chip
                  icon={isAdmin ? <SecurityIcon /> : <CakeIcon />}
                  label={isAdmin ? "Store Admin" : "Cupcake Connoisseur"}
                  color={isAdmin ? "secondary" : "primary"}
                  size="small"
                  sx={{ fontWeight: 700, px: 1 }}
                />
              </Box>
              <Typography variant="body1" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <EmailIcon fontSize="small" /> {user.email}
              </Typography>

              {isAdmin && (
                <Button
                  component={Link}
                  to="/admin"
                  variant="contained"
                  color="secondary"
                  size="small"
                  sx={{ mr: 2, borderRadius: 2, fontWeight: 700 }}
                >
                  Go to Admin Dashboard
                </Button>
              )}
            </Grid>
            <Grid item>
              <Button
                onClick={handleLogout}
                variant="outlined"
                color="error"
                startIcon={<LogoutIcon />}
                sx={{
                  borderRadius: 3,
                  px: 3,
                  py: 1,
                  fontWeight: 700,
                  borderWidth: 2,
                  "&:hover": { borderWidth: 2 },
                }}
              >
                Sign Out
              </Button>
            </Grid>
          </Grid>
        </Paper>

        {/* Tabs section */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 4,
            overflow: "hidden",
            background: "rgba(255, 255, 255, 0.85)",
            backdropFilter: "blur(20px)",
            border: "1px solid",
            borderColor: alpha(theme.palette.primary.main, 0.1),
            boxShadow: "0 20px 40px rgba(0,0,0,0.04)",
          }}
        >
          <Tabs
            value={tab}
            onChange={(_, newVal) => setTab(newVal)}
            variant="scrollable"
            scrollButtons="auto"
            sx={{
              px: 3,
              pt: 2,
              borderBottom: 1,
              borderColor: "divider",
              "& .MuiTab-root": { fontWeight: 700, fontSize: "1rem", py: 2, minWidth: 160 },
            }}
          >
            <Tab icon={<PersonIcon />} iconPosition="start" label="Account Details" />
            <Tab icon={<ShoppingBagIcon />} iconPosition="start" label="Order History" />
            <Tab icon={<QrCode2Icon />} iconPosition="start" label="UPI & Payment Methods" />
          </Tabs>

          {/* Tab 0: Account Details */}
          {tab === 0 && (
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3, flexWrap: "wrap", gap: 2 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Personal & Delivery Information
                </Typography>
                {!isEditing ? (
                  <Button
                    onClick={() => setIsEditing(true)}
                    variant="contained"
                    color="primary"
                    startIcon={<EditIcon />}
                    sx={{ borderRadius: 2, fontWeight: 700, px: 3 }}
                  >
                    Edit Details
                  </Button>
                ) : (
                  <Button
                    onClick={handleCancelEdit}
                    variant="outlined"
                    color="inherit"
                    startIcon={<CancelIcon />}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                  >
                    Cancel Editing
                  </Button>
                )}
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 3, borderRadius: 2, fontWeight: 600 }}>
                  {error}
                </Alert>
              )}

              {!isEditing ? (
                /* READ-ONLY VIEW: Clean cards without "Account Type"! */
                <Grid container spacing={3}>
                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
                      <CardContent>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                          Full Name
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                          <BadgeIcon color="primary" /> {user.name}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
                      <CardContent>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                          Email Address
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                          <EmailIcon color="primary" /> {user.email}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
                      <CardContent>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                          Phone Number
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                          <PhoneIcon color="primary" /> {user.phone || "No phone added yet — click Edit to add"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12} md={6}>
                    <Card variant="outlined" sx={{ borderRadius: 3, p: 2 }}>
                      <CardContent>
                        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 700, textTransform: "uppercase" }}>
                          Delivery Address
                        </Typography>
                        <Typography variant="h6" sx={{ fontWeight: 700, mt: 0.5, display: "flex", alignItems: "center", gap: 1 }}>
                          <LocationOnIcon color="primary" /> {user.address || "No address saved — click Edit to add"}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>

                  <Grid item xs={12}>
                    <Card variant="outlined" sx={{ borderRadius: 3, p: 2, bgcolor: alpha(theme.palette.success.main, 0.04) }}>
                      <CardContent sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                          <CheckCircleIcon color="success" fontSize="large" />
                          <Box>
                            <Typography variant="subtitle1" sx={{ fontWeight: 800, color: "success.dark" }}>
                              Account Verified & Secure
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              Your details are encrypted and ready for instant checkout.
                            </Typography>
                          </Box>
                        </Box>
                        <Button
                          onClick={() => setIsEditing(true)}
                          variant="outlined"
                          color="primary"
                          size="small"
                          sx={{ fontWeight: 700, borderRadius: 2 }}
                        >
                          Update Delivery Address
                        </Button>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              ) : (
                /* EDITING MODE FORM */
                <Box component="form" onSubmit={handleSaveProfile}>
                  <Grid container spacing={3}>
                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Full Name"
                        value={editName}
                        onChange={(e) => setEditName(e.target.value)}
                        required
                        variant="outlined"
                        InputProps={{
                          startAdornment: <BadgeIcon color="primary" sx={{ mr: 1 }} />,
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Email Address (Read-Only)"
                        value={user.email}
                        disabled
                        variant="outlined"
                        InputProps={{
                          startAdornment: <EmailIcon color="action" sx={{ mr: 1 }} />,
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Phone Number"
                        placeholder="e.g. +91 98765 43210"
                        value={editPhone}
                        onChange={(e) => setEditPhone(e.target.value)}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <PhoneIcon color="primary" sx={{ mr: 1 }} />,
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                      />
                    </Grid>

                    <Grid item xs={12} md={6}>
                      <TextField
                        fullWidth
                        label="Delivery Address"
                        placeholder="e.g. Flat 402, Parle Point, Surat, Gujarat"
                        value={editAddress}
                        onChange={(e) => setEditAddress(e.target.value)}
                        variant="outlined"
                        InputProps={{
                          startAdornment: <LocationOnIcon color="primary" sx={{ mr: 1 }} />,
                        }}
                        sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                      />
                    </Grid>

                    <Grid item xs={12} sx={{ display: "flex", gap: 2, mt: 1 }}>
                      <Button
                        type="submit"
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={saving}
                        startIcon={saving ? <CircularProgress size={20} color="inherit" /> : <SaveIcon />}
                        sx={{ borderRadius: 2.5, fontWeight: 700, px: 4, py: 1.2 }}
                      >
                        {saving ? "Saving Changes..." : "Save Profile Details"}
                      </Button>
                      <Button
                        type="button"
                        onClick={handleCancelEdit}
                        variant="outlined"
                        color="inherit"
                        size="large"
                        disabled={saving}
                        sx={{ borderRadius: 2.5, fontWeight: 700, px: 3 }}
                      >
                        Cancel
                      </Button>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </Box>
          )}

          {/* Tab 1: Order History */}
          {tab === 1 && (
            <Box sx={{ p: { xs: 3, md: 5 } }}>
              <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
                <Typography variant="h5" sx={{ fontWeight: 800 }}>
                  Recent Orders
                </Typography>
                <Button component={Link} to="/products" variant="contained" color="primary" sx={{ borderRadius: 2, fontWeight: 700 }}>
                  Order More Cupcakes
                </Button>
              </Box>
              <Grid container spacing={3}>
                {mockOrders.map((order) => (
                  <Grid item xs={12} key={order.id}>
                    <Card
                      variant="outlined"
                      sx={{
                        borderRadius: 3,
                        p: 1,
                        transition: "all 0.3s ease",
                        "&:hover": { borderColor: "primary.main", boxShadow: "0 8px 24px rgba(0,0,0,0.06)" },
                      }}
                    >
                      <CardContent>
                        <Grid container spacing={2} alignItems="center">
                          <Grid item xs={12} sm={3}>
                            <Typography variant="subtitle2" color="primary.main" sx={{ fontWeight: 800 }}>
                              {order.id}
                            </Typography>
                            <Typography variant="caption" color="text.secondary">
                              {order.date}
                            </Typography>
                          </Grid>
                          <Grid item xs={12} sm={5}>
                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                              {order.items}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={2}>
                            <Typography variant="h6" sx={{ fontWeight: 800 }}>
                              {order.total}
                            </Typography>
                          </Grid>
                          <Grid item xs={6} sm={2} sx={{ textAlign: { xs: "left", sm: "right" } }}>
                            <Chip
                              icon={<LocalShippingIcon />}
                              label={order.status}
                              color={order.statusColor}
                              size="small"
                              sx={{ fontWeight: 700 }}
                            />
                          </Grid>
                        </Grid>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            </Box>
          )}

          {/* Tab 2: UPI & Payment Methods */}
          {tab === 2 && (
            <Box sx={{ p: { xs: 3, md: 5 }, textAlign: "center" }}>
              <Box sx={{ maxWidth: 500, mx: "auto", py: 2 }}>
                <QrCode2Icon sx={{ fontSize: 70, color: "primary.main", mb: 2 }} />
                <Typography variant="h5" sx={{ fontWeight: 800, mb: 1 }}>
                  Zero-Fee Direct UPI Payments
                </Typography>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  When checking out, your orders will be verified via direct UPI QR code scanning without any extra payment gateway fees!
                </Typography>
                <Paper
                  variant="outlined"
                  sx={{ p: 3, borderRadius: 3, bgcolor: alpha(theme.palette.primary.main, 0.05), borderStyle: "dashed" }}
                >
                  <Typography variant="subtitle1" sx={{ fontWeight: 700, color: "primary.dark" }}>
                    Preferred Payment Mode: Instant UPI QR
                  </Typography>
                  <Typography variant="caption" color="text.secondary">
                    Fast, reliable, and directly connected to Bindi's Cupcakery kitchen!
                  </Typography>
                </Paper>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
}
