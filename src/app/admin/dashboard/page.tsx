"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Box, Typography, Paper, Grid, Chip, alpha,
} from "@mui/material";
import {
  Inventory as ProductsIcon,
  People as UsersIcon,
  Receipt as OrdersIcon,
  Star as ReviewsIcon,
  ArrowForward as ArrowIcon,
  TrendingUp as TrendIcon,
} from "@mui/icons-material";
import AdminShell from "../components/AdminShell";

interface Stats {
  products: number;
  orders: number;
  customers: number;
  reviews: number;
  revenue: number;
}

const modules = [
  { title: "Manage Products", description: "Add, edit, or remove items from the catalog", icon: <ProductsIcon sx={{ fontSize: 32, color: "#d97a9c" }} />, href: "/admin/products", bg: "linear-gradient(135deg, #fce7f3, #fdf2f8)", chipLabel: "Catalog", chipColor: "#ec4899" },
  { title: "View Orders", description: "Track and manage customer orders", icon: <OrdersIcon sx={{ fontSize: 32, color: "#9b7bd0" }} />, href: "/admin/orders", bg: "linear-gradient(135deg, #f5f3ff, #faf5ff)", chipLabel: "Orders", chipColor: "#8b5cf6" },
  { title: "Customers", description: "View registered customer accounts", icon: <UsersIcon sx={{ fontSize: 32, color: "#3b82f6" }} />, href: "/admin/customers", bg: "linear-gradient(135deg, #dbeafe, #eff6ff)", chipLabel: "Users", chipColor: "#3b82f6" },
  { title: "Reviews", description: "Manage customer reviews", icon: <ReviewsIcon sx={{ fontSize: 32, color: "#f59e0b" }} />, href: "/admin/reviews", bg: "linear-gradient(135deg, #fffbeb, #fef3c7)", chipLabel: "Feedback", chipColor: "#f59e0b" },
];

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => r.ok ? r.json() : null)
      .then((d) => d && setStats(d));
  }, []);

  const cards = [
    { label: "Total Products", value: stats?.products ?? "—", icon: "🧁", color: "#d97a9c" },
    { label: "Total Orders", value: stats?.orders ?? "—", icon: "📦", color: "#9b7bd0" },
    { label: "Customers", value: stats?.customers ?? "—", icon: "👥", color: "#3b82f6" },
    { label: "Revenue", value: stats ? `₹${stats.revenue.toFixed(0)}` : "—", icon: "💰", color: "#10b981" },
  ];

  return (
    <AdminShell title="Dashboard">
      <Box sx={{ background: "linear-gradient(135deg, #fce8f0 0%, #f5ebe0 50%, #ede4f6 100%)", color: "#5b3a52", borderRadius: 4, p: 4, mb: 4, position: "relative", overflow: "hidden", border: "1px solid", borderColor: alpha("#d4a373", 0.18) }}>
        <Box sx={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", bgcolor: alpha("#f9c2d6", 0.25) }} />
        <Box sx={{ position: "absolute", bottom: -30, left: 100, width: 140, height: 140, borderRadius: "50%", bgcolor: alpha("#d4b5e8", 0.2) }} />
        <Typography variant="h4" fontWeight={800} sx={{ color: "#9d4870" }}>Welcome back, Admin 🧁</Typography>
        <Typography sx={{ opacity: 0.75, mt: 0.5, color: "#5b3a52" }}>Here&apos;s what&apos;s happening at Bindi&apos;s Cupcakery today</Typography>
        <Chip icon={<TrendIcon sx={{ color: "#9d4870 !important" }} />} label="Live data from database" sx={{ mt: 2, color: "#9d4870", bgcolor: alpha("#fff", 0.6), fontWeight: 700, border: "1px solid", borderColor: alpha("#9d4870", 0.15) }} />
      </Box>

      <Grid container spacing={3} mb={5}>
        {cards.map(({ label, value, icon, color }, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: "1px solid", borderColor: "divider", textAlign: "center", transition: "all 0.3s", "&:hover": { boxShadow: `0 12px 35px ${alpha(color, 0.18)}`, transform: "translateY(-4px)" } }}>
              <Typography sx={{ fontSize: "2.2rem", mb: 1 }}>{icon}</Typography>
              <Typography variant="h4" fontWeight={800} sx={{ color }}>{value}</Typography>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>{label}</Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Typography variant="h5" fontWeight={700} mb={3}>Manage Your Store</Typography>
      <Grid container spacing={3}>
        {modules.map((m, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Paper elevation={0} component={Link} href={m.href} sx={{ display: "block", p: 4, borderRadius: 4, border: `1px solid ${alpha(m.chipColor, 0.2)}`, background: m.bg, textDecoration: "none", transition: "all 0.3s", "&:hover": { transform: "translateY(-6px)", boxShadow: `0 20px 50px ${alpha(m.chipColor, 0.2)}`, "& .arrow-icon": { transform: "translateX(4px)" } } }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between" }}>
                <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
                  <Box sx={{ width: 56, height: 56, borderRadius: 3, bgcolor: alpha(m.chipColor, 0.12), display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    {m.icon}
                  </Box>
                  <Box>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                      <Typography variant="h6" fontWeight={700} color="text.primary">{m.title}</Typography>
                      <Chip label={m.chipLabel} size="small" sx={{ bgcolor: alpha(m.chipColor, 0.12), color: m.chipColor, fontWeight: 700, fontSize: "0.65rem" }} />
                    </Box>
                    <Typography variant="body2" color="text.secondary">{m.description}</Typography>
                  </Box>
                </Box>
                <ArrowIcon className="arrow-icon" sx={{ color: "text.disabled", transition: "transform 0.3s", flexShrink: 0 }} />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </AdminShell>
  );
}
