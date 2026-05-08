"use client";

import { useEffect, useState } from "react";
import {
  Box, Paper, Typography, Avatar, Chip, IconButton, CircularProgress,
  Grid, alpha,
} from "@mui/material";
import { Star as StarIcon, Delete as DeleteIcon } from "@mui/icons-material";
import AdminShell from "../components/AdminShell";

interface Review {
  id: number;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
  product: { name: string };
}

export default function AdminReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    fetch("/api/admin/reviews")
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews || []))
      .finally(() => setLoading(false));
  };
  useEffect(() => { load(); }, []);

  const remove = async (id: number) => {
    if (!confirm("Delete this review?")) return;
    await fetch(`/api/admin/reviews/${id}`, { method: "DELETE" });
    load();
  };

  const avg = reviews.length ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length : 0;

  return (
    <AdminShell title="Reviews">
      <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "divider", flex: 1, minWidth: 200 }}>
          <Typography variant="caption" color="text.secondary">Total Reviews</Typography>
          <Typography variant="h4" fontWeight={800} sx={{ color: "#f59e0b" }}>{reviews.length}</Typography>
        </Paper>
        <Paper elevation={0} sx={{ p: 2.5, borderRadius: 3, border: "1px solid", borderColor: "divider", flex: 1, minWidth: 200 }}>
          <Typography variant="caption" color="text.secondary">Average Rating</Typography>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="h4" fontWeight={800} sx={{ color: "#f59e0b" }}>{avg.toFixed(1)}</Typography>
            <StarIcon sx={{ color: "#fbbf24", fontSize: 32 }} />
          </Box>
        </Paper>
      </Box>

      {loading ? (
        <Box sx={{ p: 6, textAlign: "center" }}><CircularProgress /></Box>
      ) : reviews.length === 0 ? (
        <Paper elevation={0} sx={{ p: 8, textAlign: "center", borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
          <Typography color="text.secondary">No reviews yet — they will show up here once customers post.</Typography>
        </Paper>
      ) : (
        <Grid container spacing={2}>
          {reviews.map((r) => (
            <Grid item xs={12} md={6} key={r.id}>
              <Paper elevation={0} sx={{ p: 3, borderRadius: 3, border: "1px solid", borderColor: "divider", "&:hover": { boxShadow: `0 8px 30px ${alpha("#f59e0b", 0.15)}` } }}>
                <Box sx={{ display: "flex", justifyContent: "space-between", mb: 1.5 }}>
                  <Box sx={{ display: "flex", gap: 1.5, alignItems: "center" }}>
                    <Avatar sx={{ background: "linear-gradient(135deg, #f59e0b, #fbbf24)" }}>{r.user.name[0]}</Avatar>
                    <Box>
                      <Typography fontWeight={700}>{r.user.name}</Typography>
                      <Typography variant="caption" color="text.secondary">on {r.product.name}</Typography>
                    </Box>
                  </Box>
                  <IconButton size="small" onClick={() => remove(r.id)} sx={{ color: "#ef4444" }}><DeleteIcon /></IconButton>
                </Box>
                <Box sx={{ display: "flex", gap: 0.3, mb: 1.5 }}>
                  {[1, 2, 3, 4, 5].map((i) => (
                    <StarIcon key={i} sx={{ fontSize: 18, color: i <= r.rating ? "#fbbf24" : "#e5e7eb" }} />
                  ))}
                </Box>
                <Typography variant="body2" color="text.secondary" fontStyle="italic">&quot;{r.comment}&quot;</Typography>
                <Typography variant="caption" color="text.disabled" mt={1.5} display="block">{new Date(r.createdAt).toLocaleDateString()}</Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}
    </AdminShell>
  );
}
