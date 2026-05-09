"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Box,
  Typography,
  Paper,
  Grid,
  Chip,
  alpha,
  Avatar,
  Stack,
  Divider,
  Button,
  LinearProgress,
} from "@mui/material";
import {
  Inventory as ProductsIcon,
  Receipt as OrdersIcon,
  Star as ReviewsIcon,
  TrendingUp as TrendIcon,
  ArrowForward as ArrowIcon,
  Pending as PendingIcon,
  Whatshot as HotIcon,
  AutoAwesome as SparkleIcon,
} from "@mui/icons-material";
import AdminShell from "../components/AdminShell";

interface RecentOrder {
  id: number;
  customer: string;
  total: number;
  status: string;
  itemCount: number;
  createdAt: string;
}

interface RecentReview {
  id: number;
  rating: number;
  comment: string;
  customer: string;
  product: string;
  createdAt: string;
}

interface TopProduct {
  id: number;
  name: string;
  image: string;
  units: number;
  revenue: number;
}

interface CategoryRow {
  name: string;
  count: number;
}

interface Stats {
  products: number;
  orders: number;
  customers: number;
  reviews: number;
  revenue: number;
  pendingOrders: number;
  recentOrders: RecentOrder[];
  recentReviews: RecentReview[];
  topProducts: TopProduct[];
  categoryBreakdown: CategoryRow[];
}

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#9b7bd0",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const CATEGORY_COLORS: Record<string, string> = {
  Cupcake: "#d97a9c",
  Brownie: "#a16207",
  Cookie: "#ea580c",
  Truffle: "#9b7bd0",
  Donut: "#3b82f6",
  Other: "#6b7280",
};

function timeAgo(date: string) {
  const diff = Date.now() - new Date(date).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return "just now";
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d) setStats(d);
        setLoading(false);
      });
  }, []);

  const cards = [
    {
      label: "Total Products",
      value: stats?.products ?? "—",
      icon: "🧁",
      color: "#d97a9c",
      href: "/admin/products",
    },
    {
      label: "Total Orders",
      value: stats?.orders ?? "—",
      icon: "📦",
      color: "#9b7bd0",
      href: "/admin/orders",
      badge: stats?.pendingOrders ? `${stats.pendingOrders} pending` : undefined,
    },
    {
      label: "Customers",
      value: stats?.customers ?? "—",
      icon: "👥",
      color: "#3b82f6",
      href: "/admin/customers",
    },
    {
      label: "Revenue",
      value: stats ? `₹${stats.revenue.toFixed(0)}` : "—",
      icon: "💰",
      color: "#10b981",
      href: "/admin/orders",
    },
  ];

  const totalCategoryCount = stats?.categoryBreakdown.reduce((s, c) => s + c.count, 0) || 0;

  return (
    <AdminShell title="Dashboard">
      {/* Welcome */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #fce8f0 0%, #f5ebe0 50%, #ede4f6 100%)",
          color: "#5b3a52",
          borderRadius: 4,
          p: 4,
          mb: 4,
          position: "relative",
          overflow: "hidden",
          border: "1px solid",
          borderColor: alpha("#d4a373", 0.18),
        }}
      >
        <Box sx={{ position: "absolute", top: -40, right: -40, width: 200, height: 200, borderRadius: "50%", bgcolor: alpha("#f9c2d6", 0.25) }} />
        <Box sx={{ position: "absolute", bottom: -30, left: 100, width: 140, height: 140, borderRadius: "50%", bgcolor: alpha("#d4b5e8", 0.2) }} />
        <Typography variant="h4" fontWeight={800} sx={{ color: "#9d4870" }}>
          Welcome back, Admin 🧁
        </Typography>
        <Typography sx={{ opacity: 0.75, mt: 0.5, color: "#5b3a52" }}>
          Here&apos;s what&apos;s happening at Bindi&apos;s Cupcakery today
        </Typography>
        <Chip
          icon={<TrendIcon sx={{ color: "#9d4870 !important" }} />}
          label="Live data from database"
          sx={{ mt: 2, color: "#9d4870", bgcolor: alpha("#fff", 0.6), fontWeight: 700, border: "1px solid", borderColor: alpha("#9d4870", 0.15) }}
        />
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} mb={4}>
        {cards.map(({ label, value, icon, color, href, badge }, i) => (
          <Grid item xs={6} md={3} key={i}>
            <Paper
              elevation={0}
              component={Link}
              href={href}
              sx={{
                display: "block",
                p: 3,
                borderRadius: 4,
                border: "1px solid",
                borderColor: "divider",
                textDecoration: "none",
                position: "relative",
                transition: "all 0.3s",
                "&:hover": { boxShadow: `0 12px 35px ${alpha(color, 0.18)}`, transform: "translateY(-4px)", borderColor: alpha(color, 0.4) },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", mb: 1 }}>
                <Typography sx={{ fontSize: "2rem" }}>{icon}</Typography>
                {badge && (
                  <Chip
                    icon={<PendingIcon sx={{ fontSize: 12, color: "#f59e0b !important" }} />}
                    label={badge}
                    size="small"
                    sx={{
                      bgcolor: alpha("#f59e0b", 0.12),
                      color: "#b45309",
                      fontWeight: 700,
                      fontSize: "0.65rem",
                      height: 22,
                    }}
                  />
                )}
              </Box>
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

      {loading && <LinearProgress sx={{ borderRadius: 1, mb: 3 }} />}

      <Grid container spacing={3}>
        {/* Recent Orders */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", p: 3, height: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <OrdersIcon sx={{ color: "#9b7bd0" }} />
                <Typography variant="h6" fontWeight={700}>Recent Orders</Typography>
              </Box>
              <Button
                component={Link}
                href="/admin/orders"
                size="small"
                endIcon={<ArrowIcon sx={{ fontSize: 14 }} />}
                sx={{ color: "#9d4870", fontWeight: 700, textTransform: "none" }}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {stats && stats.recentOrders.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>📦</Typography>
                <Typography variant="body2" color="text.secondary">
                  No orders yet — they&apos;ll appear here as customers place them.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {stats?.recentOrders.map((o) => (
                  <Box
                    key={o.id}
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 2,
                      p: 1.5,
                      borderRadius: 2,
                      transition: "all 0.15s",
                      "&:hover": { bgcolor: alpha("#9b7bd0", 0.06) },
                    }}
                  >
                    <Avatar sx={{ bgcolor: alpha("#9b7bd0", 0.18), color: "#7c3aed", fontWeight: 700, width: 40, height: 40 }}>
                      {o.customer[0]?.toUpperCase() || "?"}
                    </Avatar>
                    <Box sx={{ flex: 1, minWidth: 0 }}>
                      <Typography fontWeight={700} noWrap>{o.customer}</Typography>
                      <Typography variant="caption" color="text.secondary">
                        Order #{o.id} · {o.itemCount} item{o.itemCount !== 1 ? "s" : ""} · {timeAgo(o.createdAt)}
                      </Typography>
                    </Box>
                    <Chip
                      label={o.status}
                      size="small"
                      sx={{
                        bgcolor: alpha(STATUS_COLORS[o.status] || "#6b7280", 0.12),
                        color: STATUS_COLORS[o.status] || "#374151",
                        fontWeight: 700,
                        textTransform: "capitalize",
                        fontSize: "0.7rem",
                      }}
                    />
                    <Typography fontWeight={800} sx={{ minWidth: 70, textAlign: "right", color: "#059669" }}>
                      ₹{o.total.toFixed(0)}
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Recent Reviews */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", p: 3, height: "100%" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <ReviewsIcon sx={{ color: "#f59e0b" }} />
                <Typography variant="h6" fontWeight={700}>Recent Reviews</Typography>
              </Box>
              <Button
                component={Link}
                href="/admin/reviews"
                size="small"
                endIcon={<ArrowIcon sx={{ fontSize: 14 }} />}
                sx={{ color: "#9d4870", fontWeight: 700, textTransform: "none" }}
              >
                View All
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {stats && stats.recentReviews.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>⭐</Typography>
                <Typography variant="body2" color="text.secondary">
                  No reviews yet.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={2} divider={<Divider flexItem />}>
                {stats?.recentReviews.map((r) => (
                  <Box key={r.id}>
                    <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 0.5 }}>
                      <Typography fontWeight={700} variant="body2">{r.customer}</Typography>
                      <Box sx={{ display: "flex", gap: 0.2 }}>
                        {[1, 2, 3, 4, 5].map((i) => (
                          <ReviewsIcon
                            key={i}
                            sx={{ fontSize: 14, color: i <= r.rating ? "#fbbf24" : "#e5e7eb" }}
                          />
                        ))}
                      </Box>
                    </Box>
                    <Typography variant="caption" color="text.secondary" sx={{ display: "block", mb: 0.5 }}>
                      on <strong>{r.product}</strong> · {timeAgo(r.createdAt)}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", fontStyle: "italic" }}
                    >
                      &quot;{r.comment}&quot;
                    </Typography>
                  </Box>
                ))}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Top Products */}
        <Grid item xs={12} md={7}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", p: 3 }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <HotIcon sx={{ color: "#ef4444" }} />
                <Typography variant="h6" fontWeight={700}>Top Selling Products</Typography>
              </Box>
              <Button
                component={Link}
                href="/admin/products"
                size="small"
                endIcon={<ArrowIcon sx={{ fontSize: 14 }} />}
                sx={{ color: "#9d4870", fontWeight: 700, textTransform: "none" }}
              >
                Manage
              </Button>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {stats && stats.topProducts.length === 0 ? (
              <Box sx={{ textAlign: "center", py: 5 }}>
                <Typography sx={{ fontSize: "2.5rem", mb: 1 }}>🔥</Typography>
                <Typography variant="body2" color="text.secondary">
                  Top sellers will rank here once orders start coming in.
                </Typography>
              </Box>
            ) : (
              <Stack spacing={1.5}>
                {stats?.topProducts.map((p, i) => {
                  const max = stats.topProducts[0]?.units || 1;
                  const pct = (p.units / max) * 100;
                  return (
                    <Box key={p.id} sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                      <Box
                        sx={{
                          width: 32,
                          height: 32,
                          borderRadius: 2,
                          bgcolor: i === 0 ? "#fbbf24" : alpha("#9b7bd0", 0.15),
                          color: i === 0 ? "white" : "#9d4870",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontWeight: 800,
                          fontSize: "0.85rem",
                          flexShrink: 0,
                        }}
                      >
                        #{i + 1}
                      </Box>
                      <Box sx={{ position: "relative", width: 48, height: 48, borderRadius: 2, overflow: "hidden", flexShrink: 0, bgcolor: "#f5f5f5" }}>
                        <Image src={p.image} alt={p.name} fill style={{ objectFit: "cover" }} sizes="48px" />
                      </Box>
                      <Box sx={{ flex: 1, minWidth: 0 }}>
                        <Typography fontWeight={700} variant="body2" noWrap>{p.name}</Typography>
                        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                          <LinearProgress
                            variant="determinate"
                            value={pct}
                            sx={{
                              flex: 1,
                              height: 6,
                              borderRadius: 1,
                              bgcolor: alpha("#9b7bd0", 0.1),
                              "& .MuiLinearProgress-bar": { bgcolor: "#d97a9c", borderRadius: 1 },
                            }}
                          />
                          <Typography variant="caption" fontWeight={700} sx={{ minWidth: 60, textAlign: "right" }}>
                            {p.units} sold
                          </Typography>
                        </Box>
                      </Box>
                      <Typography fontWeight={700} variant="body2" sx={{ color: "#059669", minWidth: 80, textAlign: "right" }}>
                        ₹{p.revenue.toFixed(0)}
                      </Typography>
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Catalog Breakdown */}
        <Grid item xs={12} md={5}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", p: 3 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
              <SparkleIcon sx={{ color: "#d97a9c" }} />
              <Typography variant="h6" fontWeight={700}>Catalog Breakdown</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            {stats && stats.categoryBreakdown.length === 0 ? (
              <Typography variant="body2" color="text.secondary" textAlign="center" py={3}>
                No products yet.
              </Typography>
            ) : (
              <Stack spacing={2}>
                {stats?.categoryBreakdown.map((c) => {
                  const pct = totalCategoryCount > 0 ? (c.count / totalCategoryCount) * 100 : 0;
                  const color = CATEGORY_COLORS[c.name] || "#6b7280";
                  return (
                    <Box key={c.name}>
                      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
                        <Typography fontWeight={700} variant="body2">{c.name}</Typography>
                        <Typography variant="caption" fontWeight={700} color="text.secondary">
                          {c.count} item{c.count !== 1 ? "s" : ""}
                        </Typography>
                      </Box>
                      <LinearProgress
                        variant="determinate"
                        value={pct}
                        sx={{
                          height: 8,
                          borderRadius: 1,
                          bgcolor: alpha(color, 0.1),
                          "& .MuiLinearProgress-bar": { bgcolor: color, borderRadius: 1 },
                        }}
                      />
                    </Box>
                  );
                })}
              </Stack>
            )}
          </Paper>
        </Grid>

        {/* Quick links */}
        <Grid item xs={12}>
          <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", p: 3, background: "linear-gradient(135deg, #fdf2f4, #f5eef9)" }}>
            <Typography variant="h6" fontWeight={700} mb={2}>Quick Actions</Typography>
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flexWrap="wrap">
              <Button
                component={Link}
                href="/admin/products"
                startIcon={<ProductsIcon />}
                sx={{ borderRadius: 50, px: 3, py: 1.2, bgcolor: "white", color: "#9d4870", fontWeight: 700, "&:hover": { bgcolor: alpha("#fff", 0.85) } }}
              >
                Add Product
              </Button>
              <Button
                component={Link}
                href="/admin/orders"
                startIcon={<OrdersIcon />}
                sx={{ borderRadius: 50, px: 3, py: 1.2, bgcolor: "white", color: "#7c3aed", fontWeight: 700, "&:hover": { bgcolor: alpha("#fff", 0.85) } }}
              >
                Process Orders
              </Button>
              <Button
                component={Link}
                href="/admin/reviews"
                startIcon={<ReviewsIcon />}
                sx={{ borderRadius: 50, px: 3, py: 1.2, bgcolor: "white", color: "#b45309", fontWeight: 700, "&:hover": { bgcolor: alpha("#fff", 0.85) } }}
              >
                Moderate Reviews
              </Button>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </AdminShell>
  );
}
