import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
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
} from "@mui/material";
import GoogleIcon from "@mui/icons-material/Google";

export default function LoginPage() {
  const { login, register } = useAuth();
  const navigate = useNavigate();
  const [tab, setTab] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      if (tab === 0) {
        await login(email, password || "secret");
      } else {
        await register(name || "Customer", email, phone, password || "secret");
      }
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Authentication failed");
    } finally {
      setLoading(false);
    }
  };

  const handleMockGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      await login("bindi.customer@example.com", "google-oauth");
      navigate("/");
    } catch (err: any) {
      setError("Mock Google login failed. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
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
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
            boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
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
              }}
            >
              🧁
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Welcome to Bindi&apos;s Cupcakery
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            Sign in or create an account to order treats securely.
          </Typography>

          <Tabs
            value={tab}
            onChange={(_, v) => { setTab(v); setError(""); }}
            centered
            sx={{ mb: 3, "& .MuiTab-root": { fontWeight: 700 } }}
          >
            <Tab label="Sign In" />
            <Tab label="Register" />
          </Tabs>

          {error && (
            <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
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
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
              sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            {tab === 1 && (
              <TextField
                fullWidth
                label="Phone Number"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                size="small"
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
            )}
            <TextField
              fullWidth
              label="Password (Optional for Demo)"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              size="small"
              sx={{ mb: 3, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
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
                boxShadow: "0 8px 24px rgba(236,72,153,0.28)",
                mb: 2,
              }}
            >
              {loading ? <CircularProgress size={24} color="inherit" /> : tab === 0 ? "Sign In" : "Create Account"}
            </Button>
          </form>

          <Button
            onClick={handleMockGoogleLogin}
            fullWidth
            variant="outlined"
            size="large"
            disabled={loading}
            startIcon={<GoogleIcon sx={{ color: "#DB4437" }} />}
            sx={{
              borderRadius: "50px",
              py: 1.2,
              fontWeight: 700,
              borderColor: "divider",
              color: "text.primary",
              "&:hover": {
                borderColor: "text.primary",
                bgcolor: "rgba(0,0,0,0.02)",
              },
            }}
          >
            Sign in with Google (Demo)
          </Button>
        </Paper>
      </Container>
    </Box>
  );
}
