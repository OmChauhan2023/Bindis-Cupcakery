"use client";

import { Fragment, useEffect, useState } from "react";
import {
  Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Chip, Select, MenuItem, IconButton, CircularProgress, alpha, Collapse, Button,
} from "@mui/material";
import {
  Receipt as OrdersIcon, ExpandMore as ExpandIcon, Delete as DeleteIcon,
} from "@mui/icons-material";
import AdminShell from "../components/AdminShell";

const STATUS_COLORS: Record<string, string> = {
  pending: "#f59e0b",
  confirmed: "#3b82f6",
  preparing: "#8b5cf6",
  delivered: "#10b981",
  cancelled: "#ef4444",
};

const STATUSES = ["pending", "confirmed", "preparing", "delivered", "cancelled"];

interface Order {
  id: number;
  total: number;
  status: string;
  paymentMethod: string;
  deliveryAddress: string;
  createdAt: string;
  user: { name: string; email: string; phone: string };
  items: { id: number; quantity: number; price: number; product: { name: string } }[];
}

export default function AdminOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/admin/orders");
    if (res.ok) {
      const d = await res.json();
      setOrders(d.orders || []);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (id: number, status: string) => {
    await fetch(`/api/admin/orders/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    load();
  };

  const remove = async (id: number) => {
    if (!confirm("Delete this order?")) return;
    await fetch(`/api/admin/orders/${id}`, { method: "DELETE" });
    load();
  };

  const totalRevenue = orders.reduce((s, o) => s + o.total, 0);

  return (
    <AdminShell title="Orders">
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "divider", flex: 1, minWidth: 200 }}>
          <Typography variant="caption" color="text.secondary">Total Orders</Typography>
          <Typography variant="h4" fontWeight={800} color="primary">{orders.length}</Typography>
        </Paper>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "divider", flex: 1, minWidth: 200 }}>
          <Typography variant="caption" color="text.secondary">Revenue</Typography>
          <Typography variant="h4" fontWeight={800} sx={{ color: "#10b981" }}>₹{totalRevenue.toFixed(0)}</Typography>
        </Paper>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "divider", flex: 1, minWidth: 200 }}>
          <Typography variant="caption" color="text.secondary">Pending</Typography>
          <Typography variant="h4" fontWeight={800} sx={{ color: "#f59e0b" }}>
            {orders.filter((o) => o.status === "pending").length}
          </Typography>
        </Paper>
      </Box>

      <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: "center" }}><CircularProgress /></Box>
        ) : orders.length === 0 ? (
          <Box sx={{ p: 8, textAlign: "center", color: "text.secondary" }}>
            <OrdersIcon sx={{ fontSize: 64, opacity: 0.3 }} />
            <Typography>No orders yet</Typography>
          </Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha("#8b5cf6", 0.05) }}>
                <TableCell sx={{ fontWeight: 700 }}>#</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Items</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Total</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Payment</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Status</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Date</TableCell>
                <TableCell align="right" />
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((o) => (
                <Fragment key={o.id}>
                  <TableRow hover>
                    <TableCell>#{o.id}</TableCell>
                    <TableCell>
                      <Typography fontWeight={600}>{o.user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{o.user.phone}</Typography>
                    </TableCell>
                    <TableCell>{o.items.length}</TableCell>
                    <TableCell><Typography fontWeight={700}>₹{o.total}</Typography></TableCell>
                    <TableCell><Chip size="small" label={o.paymentMethod} /></TableCell>
                    <TableCell>
                      <Select
                        size="small"
                        value={o.status}
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        sx={{
                          fontWeight: 700,
                          color: STATUS_COLORS[o.status] || "text.primary",
                          minWidth: 140,
                        }}
                      >
                        {STATUSES.map((s) => (
                          <MenuItem key={s} value={s} sx={{ textTransform: "capitalize" }}>{s}</MenuItem>
                        ))}
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Typography variant="caption">{new Date(o.createdAt).toLocaleDateString()}</Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => setExpanded(expanded === o.id ? null : o.id)}>
                        <ExpandIcon sx={{ transform: expanded === o.id ? "rotate(180deg)" : "none", transition: "0.2s" }} />
                      </IconButton>
                      <IconButton size="small" onClick={() => remove(o.id)} sx={{ color: "#ef4444" }}>
                        <DeleteIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell colSpan={8} sx={{ p: 0, border: 0 }}>
                      <Collapse in={expanded === o.id}>
                        <Box sx={{ p: 3, bgcolor: alpha("#8b5cf6", 0.04) }}>
                          <Typography fontWeight={700} mb={1}>Delivery: <Typography component="span" fontWeight={400}>{o.deliveryAddress}</Typography></Typography>
                          <Typography fontWeight={700} mb={1}>Email: <Typography component="span" fontWeight={400}>{o.user.email}</Typography></Typography>
                          <Typography fontWeight={700} mt={2} mb={1}>Items:</Typography>
                          {o.items.map((it) => (
                            <Box key={it.id} sx={{ display: "flex", justifyContent: "space-between", py: 0.5 }}>
                              <Typography>{it.product.name} × {it.quantity}</Typography>
                              <Typography fontWeight={600}>₹{it.price * it.quantity}</Typography>
                            </Box>
                          ))}
                        </Box>
                      </Collapse>
                    </TableCell>
                  </TableRow>
                </Fragment>
              ))}
            </TableBody>
          </Table>
        )}
      </Paper>
    </AdminShell>
  );
}
