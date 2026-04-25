"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Alert,
  alpha,
} from "@mui/material";
import {
  Person as PersonIcon,
  Lock as LockIcon,
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
  Login as LoginIcon,
} from "@mui/icons-material";

export default function AdminLogin() {
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    const data = await res.json();
    setLoading(false);

    if (res.ok) {
      router.push("/admin/dashboard");
    } else {
      setError(data.message);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(160deg, #fce7f3 0%, #fff 50%, #f5f3ff 100%)",
        p: 3,
      }}
    >
      <Box sx={{ width: "100%", maxWidth: 420 }}>
        {/* Logo / Brand */}
        <Box textAlign="center" mb={4}>
          <Box
            sx={{
              width: 72,
              height: 72,
              borderRadius: 3,
              background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              mx: "auto",
              mb: 2,
              boxShadow: "0 12px 30px rgba(236,72,153,0.35)",
              fontSize: "2rem",
            }}
          >
            🧁
          </Box>
          <Typography variant="h4" fontWeight={800} mb={0.5}>
            Admin Portal
          </Typography>
          <Typography color="text.secondary" variant="body2">
            Bindi's Cupcakery — Internal Access Only
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            p: 4,
            border: "1px solid",
            borderColor: alpha("#ec4899", 0.15),
            boxShadow: "0 20px 60px rgba(236,72,153,0.08)",
          }}
        >
          {error && (
            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              name="username"
              value={form.username}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <PersonIcon sx={{ color: "text.disabled" }} />
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 2.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
            <TextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={form.password}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <LockIcon sx={{ color: "text.disabled" }} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end" size="small">
                      {showPassword ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ mb: 3.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />

            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              endIcon={<LoginIcon />}
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
                "&.Mui-disabled": { opacity: 0.6 },
                transition: "all 0.3s",
              }}
            >
              {loading ? "Logging in…" : "Sign In"}
            </Button>
          </form>
        </Paper>

        <Typography variant="caption" color="text.disabled" display="block" textAlign="center" mt={3}>
          🔒 Authorized personnel only
        </Typography>
      </Box>
    </Box>
  );
}
