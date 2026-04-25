"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Box,
  Container,
  Typography,
  Button,
  Paper,
  Grid,
  Avatar,
  Divider,
  Chip,
  alpha,
  IconButton,
} from "@mui/material";
import {
  Inventory as ProductsIcon,
  People as UsersIcon,
  Receipt as OrdersIcon,
  Star as ReviewsIcon,
  Logout as LogoutIcon,
  TrendingUp as TrendingIcon,
  ArrowForward as ArrowIcon,
} from "@mui/icons-material";

const adminModules = [
  {
    title: "Manage Products",
    description: "Add, edit, or remove products from the catalog",
    icon: <ProductsIcon sx={{ fontSize: 32, color: "#ec4899" }} />,
    href: "/admin/products",
    bg: "linear-gradient(135deg, #fce7f3, #fdf2f8)",
    border: "rgba(236,72,153,0.2)",
    chipLabel: "Catalog",
    chipColor: "#ec4899",
  },
  {
    title: "View Orders",
    description: "Track and manage customer orders",
    icon: <OrdersIcon sx={{ fontSize: 32, color: "#8b5cf6" }} />,
    href: "/admin/orders",
    bg: "linear-gradient(135deg, #f5f3ff, #faf5ff)",
    border: "rgba(139,92,246,0.2)",
    chipLabel: "Orders",
    chipColor: "#8b5cf6",
  },
  {
    title: "Customers",
    description: "View registered customer accounts",
    icon: <UsersIcon sx={{ fontSize: 32, color: "#3b82f6" }} />,
    href: "/admin/customers",
    bg: "linear-gradient(135deg, #dbeafe, #eff6ff)",
    border: "rgba(59,130,246,0.2)",
    chipLabel: "Users",
    chipColor: "#3b82f6",
  },
  {
    title: "Reviews",
    description: "Manage and moderate customer reviews",
    icon: <ReviewsIcon sx={{ fontSize: 32, color: "#f59e0b" }} />,
    href: "/admin/reviews",
    bg: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    border: "rgba(245,158,11,0.2)",
    chipLabel: "Feedback",
    chipColor: "#f59e0b",
  },
]

export default function AdminDashboard() {
  const router = useRouter();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("adminToken="))
      ?.split("=")[1];

    if (!token) {
      router.push("/admin/login");
    } else {
      setIsAuthenticated(true);
    }
  }, [router]);

  const handleLogout = () => {
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/admin/login");
  };

  if (!isAuthenticated) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography color="text.secondary">Redirecting to login…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa", pb: 10 }}>
      {/* Top Banner */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #be185d 0%, #7c3aed 100%)",
          py: 5,
          px: 4,
          color: "white",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", bgcolor: alpha("#fff", 0.06) }} />
        <Box sx={{ position: "absolute", bottom: -60, left: -20, width: 250, height: 250, borderRadius: "50%", bgcolor: alpha("#fff", 0.04) }} />
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <Avatar
                sx={{
                  width: 56,
                  height: 56,
                  bgcolor: alpha("#fff", 0.2),
                  fontSize: "1.5rem",
                  border: "2px solid",
                  borderColor: alpha("#fff", 0.3),
                }}
              >
                🧁
              </Avatar>
              <Box>
                <Typography variant="h4" fontWeight={800}>
                  Welcome back, Admin!
                </Typography>
                <Typography variant="body2" sx={{ opacity: 0.8 }}>
                  Bindi's Cupcakery — Admin Dashboard
                </Typography>
              </Box>
            </Box>
            <Button
              variant="outlined"
              startIcon={<LogoutIcon />}
              onClick={handleLogout}
              sx={{
                color: "white",
                borderColor: alpha("#fff", 0.4),
                borderRadius: "50px",
                px: 3,
                "&:hover": { borderColor: "white", bgcolor: alpha("#fff", 0.1) },
              }}
            >
              Logout
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ mt: 6 }}>
        {/* Stats Row */}
        <Grid container spacing={3} mb={6}>
          {[
            { label: "Total Products", value: "—", icon: "🧁", color: "#ec4899" },
            { label: "Total Orders", value: "—", icon: "📦", color: "#8b5cf6" },
            { label: "Customers", value: "—", icon: "👥", color: "#3b82f6" },
            { label: "Reviews", value: "5", icon: "⭐", color: "#f59e0b" },
          ].map(({ label, value, icon, color }, i) => (
            <Grid item xs={6} md={3} key={i}>
              <Paper
                elevation={0}
                sx={{
                  p: 3,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  textAlign: "center",
                  transition: "all 0.3s",
                  "&:hover": { boxShadow: `0 8px 30px ${alpha(color, 0.15)}`, transform: "translateY(-4px)" },
                }}
              >
                <Typography sx={{ fontSize: "2rem", mb: 1 }}>{icon}</Typography>
                <Typography variant="h4" fontWeight={800} sx={{ color }}>
                  {value}
                </Typography>
                <Typography variant="caption" color="text.secondary" fontWeight={600}>
                  {label}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* Module Cards */}
        <Typography variant="h5" fontWeight={700} mb={3}>
          Manage Your Store
        </Typography>
        <Grid container spacing={3}>
          {adminModules.map(({ title, description, icon, href, bg, border, chipLabel, chipColor }, i) => (
            <Grid item xs={12} sm={6} key={i}>
              <Paper
                elevation={0}
                component={Link}
                href={href}
                sx={{
                  display: "block",
                  p: 4,
                  borderRadius: 4,
                  border: `1px solid ${border}`,
                  background: bg,
                  textDecoration: "none",
                  transition: "all 0.3s",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 20px 50px ${border}`,
                    "& .arrow-icon": { transform: "translateX(4px)" },
                  },
                }}
              >
                <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                  <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
                    <Box
                      sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        bgcolor: alpha(chipColor, 0.12),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0,
                      }}
                    >
                      {icon}
                    </Box>
                    <Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                        <Typography variant="h6" fontWeight={700} color="text.primary">
                          {title}
                        </Typography>
                        <Chip
                          label={chipLabel}
                          size="small"
                          sx={{ bgcolor: alpha(chipColor, 0.12), color: chipColor, fontWeight: 700, fontSize: "0.65rem" }}
                        />
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {description}
                      </Typography>
                    </Box>
                  </Box>
                  <ArrowIcon className="arrow-icon" sx={{ color: "text.disabled", transition: "transform 0.3s", flexShrink: 0 }} />
                </Box>
              </Paper>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
