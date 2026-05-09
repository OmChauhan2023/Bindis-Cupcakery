"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import Link from "next/link";
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  alpha,
} from "@mui/material";
import {
  Dashboard as DashboardIcon,
  Inventory as ProductsIcon,
  Receipt as OrdersIcon,
  People as UsersIcon,
  Star as ReviewsIcon,
  Logout as LogoutIcon,
} from "@mui/icons-material";

const NAV = [
  { label: "Dashboard", href: "/admin/dashboard", icon: <DashboardIcon /> },
  { label: "Products", href: "/admin/products", icon: <ProductsIcon /> },
  { label: "Orders", href: "/admin/orders", icon: <OrdersIcon /> },
  { label: "Customers", href: "/admin/customers", icon: <UsersIcon /> },
  { label: "Reviews", href: "/admin/reviews", icon: <ReviewsIcon /> },
];

const DRAWER_W = 240;

export default function AdminShell({ children, title }: { children: React.ReactNode; title: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((r) => r.startsWith("adminToken="))
      ?.split("=")[1];
    if (!token) router.push("/admin/login");
    else setAuthed(true);
  }, [router]);

  const handleLogout = async () => {
    await fetch("/api/admin/logout", { method: "POST" });
    document.cookie = "adminToken=; path=/; expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    router.push("/admin/login");
  };

  if (!authed) {
    return (
      <Box sx={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Typography color="text.secondary">Redirecting…</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#fdfaf7" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: DRAWER_W,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: DRAWER_W,
            boxSizing: "border-box",
            bgcolor: "#fffaf7",
            color: "text.primary",
            borderRight: "1px solid",
            borderColor: alpha("#d4a373", 0.15),
          },
        }}
      >
        <Box sx={{ p: 3, display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 42,
              height: 42,
              borderRadius: 2,
              background: "linear-gradient(135deg, #f9c2d6, #d4b5e8)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.4rem",
              boxShadow: `0 4px 12px ${alpha("#d4a373", 0.2)}`,
            }}
          >
            🧁
          </Box>
          <Box>
            <Typography fontWeight={800} sx={{ color: "#9d4870" }}>Bindi&apos;s</Typography>
            <Typography variant="caption" color="text.secondary">Admin Panel</Typography>
          </Box>
        </Box>
        <Divider sx={{ borderColor: alpha("#d4a373", 0.12) }} />
        <List sx={{ px: 1.5, py: 2 }}>
          {NAV.map((n) => {
            const active = pathname === n.href;
            return (
              <ListItemButton
                key={n.href}
                component={Link}
                href={n.href}
                sx={{
                  borderRadius: 2,
                  mb: 0.5,
                  color: active ? "#9d4870" : "text.secondary",
                  bgcolor: active ? alpha("#f9c2d6", 0.35) : "transparent",
                  "&:hover": { bgcolor: alpha("#f9c2d6", 0.2), color: "#9d4870" },
                }}
              >
                <ListItemIcon sx={{ color: active ? "#9d4870" : "text.secondary", minWidth: 38 }}>{n.icon}</ListItemIcon>
                <ListItemText primary={n.label} primaryTypographyProps={{ fontWeight: active ? 700 : 500 }} />
              </ListItemButton>
            );
          })}
        </List>
        <Box sx={{ flex: 1 }} />
        <Box sx={{ p: 2 }}>
          <Button
            fullWidth
            startIcon={<LogoutIcon />}
            onClick={handleLogout}
            sx={{
              color: "#9d4870",
              borderRadius: 2,
              border: "1px solid",
              borderColor: alpha("#9d4870", 0.25),
              "&:hover": { bgcolor: alpha("#f9c2d6", 0.2), borderColor: "#9d4870" },
            }}
          >
            Logout
          </Button>
        </Box>
      </Drawer>

      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <AppBar position="sticky" elevation={0} sx={{ bgcolor: "white", color: "text.primary", borderBottom: "1px solid", borderColor: "divider" }}>
          <Toolbar>
            <Typography variant="h6" fontWeight={700}>{title}</Typography>
          </Toolbar>
        </AppBar>
        <Container maxWidth="xl" sx={{ py: 4, flex: 1 }}>
          {children}
        </Container>
      </Box>
    </Box>
  );
}
