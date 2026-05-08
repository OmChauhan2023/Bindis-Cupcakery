"use client";

import { useEffect, useState } from "react";
import {
  Box, Paper, Typography, Table, TableHead, TableRow, TableCell, TableBody,
  Avatar, Chip, CircularProgress, alpha, TextField, InputAdornment,
} from "@mui/material";
import { Search as SearchIcon, People as PeopleIcon } from "@mui/icons-material";
import AdminShell from "../components/AdminShell";

interface Customer {
  id: number;
  name: string;
  email: string;
  phone: string;
  createdAt: string;
  orderCount: number;
  reviewCount: number;
  totalSpent: number;
}

export default function AdminCustomers() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetch("/api/admin/customers")
      .then((r) => r.json())
      .then((d) => setCustomers(d.customers || []))
      .finally(() => setLoading(false));
  }, []);

  const filtered = customers.filter((c) =>
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <AdminShell title="Customers">
      <Paper elevation={0} sx={{ p: 3, mb: 3, borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
          <TextField
            placeholder="Search customers…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            sx={{ flex: 1 }}
            InputProps={{ startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment> }}
          />
          <Chip icon={<PeopleIcon />} label={`${customers.length} customers`} sx={{ fontWeight: 700 }} />
        </Box>
      </Paper>

      <Paper elevation={0} sx={{ borderRadius: 4, border: "1px solid", borderColor: "divider", overflow: "hidden" }}>
        {loading ? (
          <Box sx={{ p: 6, textAlign: "center" }}><CircularProgress /></Box>
        ) : (
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: alpha("#3b82f6", 0.05) }}>
                <TableCell sx={{ fontWeight: 700 }}>Customer</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Phone</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Orders</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Spent</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Joined</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.map((c) => (
                <TableRow key={c.id} hover>
                  <TableCell>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Avatar sx={{ background: "linear-gradient(135deg, #3b82f6, #60a5fa)" }}>{c.name[0]}</Avatar>
                      <Typography fontWeight={600}>{c.name}</Typography>
                    </Box>
                  </TableCell>
                  <TableCell>{c.email}</TableCell>
                  <TableCell>{c.phone}</TableCell>
                  <TableCell><Chip size="small" label={c.orderCount} sx={{ fontWeight: 700 }} /></TableCell>
                  <TableCell><Typography fontWeight={700} sx={{ color: "#10b981" }}>₹{c.totalSpent.toFixed(0)}</Typography></TableCell>
                  <TableCell><Typography variant="caption">{new Date(c.createdAt).toLocaleDateString()}</Typography></TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 6, color: "text.secondary" }}>No customers</TableCell></TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </Paper>
    </AdminShell>
  );
}
