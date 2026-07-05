import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate, useLocation, Navigate } from "react-router-dom";
import { useGoogleLogin, GoogleLogin } from "@react-oauth/google";
import {
  Box,
  Button,
  Container,
  Typography,
  Paper,
  TextField,
  Tab,
  Tabs,
  Alert,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  Avatar,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  ListItemButton,
  Divider,
  alpha,
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";

// Simulated Google Accounts for realistic One-Tap / OAuth demo when Client ID not in .env
const MOCK_GOOGLE_ACCOUNTS = [
  {
    name: "Mohin Chauhan",
    email: "mohin.chauhan@gmail.com",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    role: "user",
  },
  {
    name: "Bindi Chauhan (Founder)",
    email: "bindiscupcakery@gmail.com",
    image: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    role: "admin",
  },
  {
    name: "Aarav Patel",
    email: "aarav.patel@gmail.com",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    role: "user",
  },
];

export default function LoginPage() {
  const { user, login, register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  
  // If user came from checkout or another protected page, return there after login
  const from = (location.state as any)?.from?.pathname || "/";

  if (user) {
    return <Navigate to="/profile" replace />;
  }

  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Google Account Chooser Modal state (Fallback / Demo mode)
  const [openGoogleModal, setOpenGoogleModal] = useState(false);
  const [customGoogleName, setCustomGoogleName] = useState("");
  const [customGoogleEmail, setCustomGoogleEmail] = useState("");
  const [showCustomGoogleInput, setShowCustomGoogleInput] = useState(false);

  // Real Google Cloud Console OAuth 2.0 Hook
  const realGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setLoading(true);
      setError("");
      try {
        // Fetch user profile from Google UserInfo API using OAuth access token
        const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
          headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
        });
        const profile = await res.json();
        if (!profile || !profile.email) {
          throw new Error("Could not retrieve email address from Google Account.");
        }
        await googleLogin(profile.email, profile.name, profile.picture, profile.sub);
        navigate(from, { replace: true });
      } catch (err: any) {
        console.error("Google OAuth Error:", err);
        const errMsg = err.response?.data?.message || err.message || "Google OAuth verification failed.";
        if (errMsg.includes("Network Error") || errMsg.includes("refused") || errMsg.includes("Failed to fetch")) {
          setError("Cannot connect to backend server. Please ensure the backend API is online and accessible!");
        } else {
          setError(`Google Login failed: ${errMsg}`);
        }
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google OAuth popup was closed or failed. Please check permissions."),
  });

  const handleGoogleClick = () => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;
    if (clientId && clientId !== "demo_google_client_id" && clientId.includes(".apps.googleusercontent.com")) {
      // Trigger real Google Cloud OAuth consent popup!
      realGoogleLogin();
    } else {
      // Fallback to our authentic simulated One-Tap chooser modal if Client ID is not yet in .env!
      setOpenGoogleModal(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (tab === 0) {
        if (!email || !password) {
          setError("Email and password are required.");
          setLoading(false);
          return;
        }
        await login(email, password);
      } else {
        if (!name || !email || !password) {
          setError("Name, email, and password are required.");
          setLoading(false);
          return;
        }
        // Notice: NO phone number required! Keeps registration friction-free!
        await register(name, email, undefined, password);
      }
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectGoogleAccount = async (acc: { name: string; email: string; image?: string }) => {
    setLoading(true);
    setError("");
    setOpenGoogleModal(false);
    try {
      await googleLogin(acc.email, acc.name, acc.image, `google_${Date.now()}`);
      navigate(from, { replace: true });
    } catch (err: any) {
      setError(err.response?.data?.message || "Google authentication failed. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const handleCustomGoogleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!customGoogleEmail || !customGoogleName) {
      setError("Please enter name and email for your Google Account.");
      return;
    }
    await handleSelectGoogleAccount({
      name: customGoogleName,
      email: customGoogleEmail,
      image: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    });
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fdf4ed 0%, #f4eef9 100%)",
        py: 6,
        px: 2,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 5,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
            boxShadow: "0 20px 60px rgba(0,0,0,0.08)",
            bgcolor: "white",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 32,
                boxShadow: "0 8px 24px rgba(236,72,153,0.3)",
              }}
            >
              🧁
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Welcome to Bindi&apos;s Cupcakery
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3, fontSize: "0.9rem" }}>
            Sign in or create an account for faster checkout & tracking.
          </Typography>

          {/* Option 1: One-Click Google Login (The Friction-Free Choice) */}
          {import.meta.env.VITE_GOOGLE_CLIENT_ID &&
          import.meta.env.VITE_GOOGLE_CLIENT_ID !== "demo_google_client_id" &&
          import.meta.env.VITE_GOOGLE_CLIENT_ID.includes(".apps.googleusercontent.com") ? (
            <Box sx={{ mb: 3, display: "flex", justifyContent: "center" }}>
              <GoogleLogin
                onSuccess={async (credentialResponse) => {
                  if (credentialResponse.credential) {
                    setLoading(true);
                    setError("");
                    try {
                      await googleLogin(undefined, undefined, undefined, undefined, credentialResponse.credential);
                      navigate(from, { replace: true });
                    } catch (err: any) {
                      console.error("Google Auth Error:", err);
                      setError(err.response?.data?.message || "Google authentication failed.");
                    } finally {
                      setLoading(false);
                    }
                  }
                }}
                onError={() => {
                  setError("Google Sign-In failed. Please try again.");
                }}
                useOneTap
                theme="outline"
                shape="pill"
                size="large"
                width="340"
              />
            </Box>
          ) : (
            <Button
              onClick={handleGoogleClick}
              fullWidth
              variant="outlined"
              size="large"
              disabled={loading}
              startIcon={<GoogleIcon sx={{ color: "#DB4437", fontSize: 22 }} />}
              sx={{
                borderRadius: "50px",
                py: 1.4,
                mb: 3,
                fontWeight: 700,
                fontSize: "0.95rem",
                borderColor: alpha("#000", 0.2),
                color: "text.primary",
                bgcolor: alpha("#000", 0.01),
                "&:hover": {
                  borderColor: "#000",
                  bgcolor: alpha("#000", 0.04),
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s",
                boxShadow: "0 2px 8px rgba(0,0,0,0.04)",
              }}
            >
              Continue with Google (Demo)
            </Button>
          )}

          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Divider sx={{ flex: 1 }} />
            <Typography variant="caption" sx={{ px: 2, color: "text.secondary", fontWeight: 700 }}>
              OR WITH EMAIL
            </Typography>
            <Divider sx={{ flex: 1 }} />
          </Box>

          {/* Option 2: Classic Email & Password */}
          <Tabs
            value={tab}
            onChange={(_, v) => {
              setTab(v);
              setError("");
            }}
            centered
            sx={{
              mb: 3,
              "& .MuiTab-root": { fontWeight: 700, textTransform: "none", fontSize: "0.95rem" },
              "& .Mui-selected": { color: "#ec4899" },
            }}
          >
            <Tab label="Sign In" />
            <Tab label="New Account" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2.5, borderRadius: 3, textAlign: "left" }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {tab === 1 && (
              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                size="small"
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
              />
            )}
            <TextField
              fullWidth
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              size="small"
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />
            {/* Notice: No phone number requested here! We only ask for phone at Checkout! */}
            <TextField
              fullWidth
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              size="small"
              sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2.5 } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                borderRadius: "50px",
                py: 1.4,
                fontWeight: 700,
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                boxShadow: "0 8px 24px rgba(236,72,153,0.3)",
                mb: 2,
                "&:hover": {
                  background: "linear-gradient(135deg, #db2777, #7c3aed)",
                  transform: "translateY(-1px)",
                },
                transition: "all 0.2s",
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : tab === 0 ? "Sign In" : "Create Account & Sign In"}
            </Button>
          </form>

          <Box sx={{ mt: 2, p: 1.5, bgcolor: alpha("#10b981", 0.06), borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", gap: 1 }}>
            <LockOutlinedIcon sx={{ fontSize: 16, color: "#059669" }} />
            <Typography variant="caption" sx={{ color: "#059669", fontWeight: 600 }}>
              No spam, ever. Your data is encrypted & secure.
            </Typography>
          </Box>
        </Paper>

        {/* Google Account Chooser Dialog (Authentic One-Tap Simulation) */}
        <Dialog
          open={openGoogleModal}
          onClose={() => setOpenGoogleModal(false)}
          PaperProps={{
            sx: { borderRadius: 4, width: "100%", maxWidth: 400, p: 1 },
          }}
        >
          <DialogTitle sx={{ textAlign: "center", pb: 1 }}>
            <Box sx={{ display: "flex", justifyContent: "center", mb: 1 }}>
              <GoogleIcon sx={{ color: "#DB4437", fontSize: 36 }} />
            </Box>
            <Typography variant="h6" fontWeight={800}>
              Sign in with Google
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Choose an account to continue to Bindi&apos;s Cupcakery
            </Typography>
          </DialogTitle>
          <DialogContent sx={{ pt: 1 }}>
            {!showCustomGoogleInput ? (
              <>
                <List sx={{ pt: 0 }}>
                  {MOCK_GOOGLE_ACCOUNTS.map((acc, idx) => (
                    <ListItem key={idx} disablePadding sx={{ mb: 1 }}>
                      <ListItemButton
                        onClick={() => handleSelectGoogleAccount(acc)}
                        sx={{
                          borderRadius: 3,
                          border: "1px solid",
                          borderColor: "divider",
                          py: 1.5,
                          "&:hover": { bgcolor: alpha("#DB4437", 0.04), borderColor: "#DB4437" },
                        }}
                      >
                        <ListItemAvatar>
                          <Avatar src={acc.image} alt={acc.name} sx={{ width: 44, height: 44 }} />
                        </ListItemAvatar>
                        <ListItemText
                          primary={<Typography fontWeight={700}>{acc.name}</Typography>}
                          secondary={<Typography variant="caption" color="text.secondary">{acc.email}</Typography>}
                        />
                      </ListItemButton>
                    </ListItem>
                  ))}
                  <Divider sx={{ my: 1.5 }} />
                  <ListItem disablePadding>
                    <ListItemButton
                      onClick={() => setShowCustomGoogleInput(true)}
                      sx={{ borderRadius: 3, py: 1.2, textAlign: "center", justifyContent: "center" }}
                    >
                      <Typography fontWeight={700} color="primary">
                        ➕ Use another Google Account
                      </Typography>
                    </ListItemButton>
                  </ListItem>
                </List>
              </>
            ) : (
              <form onSubmit={handleCustomGoogleSubmit}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, textAlign: "center" }}>
                  Enter your Google Account details to sign in seamlessly:
                </Typography>
                <TextField
                  fullWidth
                  label="Your Name"
                  value={customGoogleName}
                  onChange={(e) => setCustomGoogleName(e.target.value)}
                  required
                  size="small"
                  sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <TextField
                  fullWidth
                  label="Gmail Address"
                  type="email"
                  value={customGoogleEmail}
                  onChange={(e) => setCustomGoogleEmail(e.target.value)}
                  required
                  size="small"
                  placeholder="you@gmail.com"
                  sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
                />
                <Box sx={{ display: "flex", gap: 1 }}>
                  <Button
                    fullWidth
                    variant="outlined"
                    onClick={() => setShowCustomGoogleInput(false)}
                    sx={{ borderRadius: "50px", fontWeight: 700 }}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{
                      borderRadius: "50px",
                      fontWeight: 700,
                      background: "linear-gradient(135deg, #DB4437, #ec4899)",
                    }}
                  >
                    Continue
                  </Button>
                </Box>
              </form>
            )}
          </DialogContent>
        </Dialog>
      </Container>
    </Box>
  );
}
