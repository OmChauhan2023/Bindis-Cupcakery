import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Avatar,
  alpha,
  Alert,
  Collapse,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { Star as StarIcon, StarBorder as StarBorderIcon, Send as SendIcon } from "@mui/icons-material";
import api from "@/services/api";

interface Product {
  id: string;
  _id?: string;
  name: string;
}

interface Review {
  id: string;
  rating: number;
  comment: string;
  createdAt: string;
  user: { name: string };
  product: { name: string };
}

const avatarColors = [
  "linear-gradient(135deg, #ec4899, #f472b6)",
  "linear-gradient(135deg, #8b5cf6, #a78bfa)",
  "linear-gradient(135deg, #f59e0b, #fbbf24)",
  "linear-gradient(135deg, #3b82f6, #60a5fa)",
  "linear-gradient(135deg, #10b981, #34d399)",
];

function StarRating({ rating, setRating }: { rating: number; setRating?: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);

  return (
    <Box sx={{ display: "flex", gap: 0.5 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Box
          key={i}
          onClick={() => setRating && setRating(i)}
          onMouseEnter={() => setRating && setHovered(i)}
          onMouseLeave={() => setRating && setHovered(0)}
          sx={{ cursor: setRating ? "pointer" : "default", transition: "transform 0.15s", "&:hover": { transform: setRating ? "scale(1.2)" : "none" } }}
        >
          {i <= (hovered || rating) ? (
            <StarIcon sx={{ color: "#fbbf24", fontSize: setRating ? 32 : 20 }} />
          ) : (
            <StarBorderIcon sx={{ color: "#d1d5db", fontSize: setRating ? 32 : 20 }} />
          )}
        </Box>
      ))}
    </Box>
  );
}

export default function Reviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [productId, setProductId] = useState<string>("");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [loadingReviews, setLoadingReviews] = useState(true);

  const loadReviews = async () => {
    try {
      const r = await api.get("/reviews");
      setReviews(r.data.reviews || []);
    } catch {
      // ignore
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadReviews();
    api.get("/products")
      .then((r) => setProducts(r.data.products || []))
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!name.trim() || !comment.trim() || rating === 0 || !productId) {
      setError("Please fill out all fields, pick a product, and select a rating.");
      return;
    }
    setSubmitting(true);
    setError("");
    try {
      await api.post("/reviews", {
        name: name.trim(),
        email: email.trim() || undefined,
        productId,
        rating,
        comment: comment.trim(),
      });
      setSuccess(true);
      setName("");
      setEmail("");
      setProductId("");
      setRating(0);
      setComment("");
      loadReviews();
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || "Network error");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #fce7f3 0%, #fff 40%, #f5f3ff 100%)",
        pt: 8,
        pb: 12,
      }}
    >
      <Container maxWidth="lg">
        <Box textAlign="center" mb={8}>
          <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 4, fontWeight: 700 }}>
            our community
          </Typography>
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              background: "linear-gradient(135deg, #be185d, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mt: 1,
            }}
          >
            Customer Reviews ⭐
          </Typography>
        </Box>

        <Grid container spacing={5}>
          {/* Submit Form */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 5,
                p: 4,
                border: "1px solid",
                borderColor: alpha("#ec4899", 0.2),
                background: "white",
                position: "sticky",
                top: 100,
              }}
            >
              <Typography variant="h6" fontWeight={700} mb={0.5}>Leave a Review</Typography>
              <Typography variant="body2" color="text.secondary" mb={3}>
                We value your feedback!
              </Typography>

              <Collapse in={success}>
                <Alert severity="success" sx={{ mb: 2, borderRadius: 2 }}>
                  ✨ Thank you for your review!
                </Alert>
              </Collapse>

              <TextField
                fullWidth
                label="Your Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                label="Email (optional)"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />
              <TextField
                fullWidth
                select
                label="What did you order?"
                value={productId}
                onChange={(e) => setProductId(e.target.value)}
                sx={{ mb: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              >
                {products.map((p) => {
                  const pid = (p as any)._id || p.id;
                  return <MenuItem key={pid} value={pid}>{p.name}</MenuItem>;
                })}
              </TextField>
              <TextField
                fullWidth
                label="Your Experience"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                multiline
                rows={4}
                sx={{ mb: 2.5, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
              />

              <Box sx={{ mb: 2.5 }}>
                <Typography variant="body2" fontWeight={600} color="text.secondary" mb={1}>
                  Your Rating
                </Typography>
                <StarRating rating={rating} setRating={setRating} />
              </Box>

              {error && (
                <Alert severity="error" sx={{ mb: 2, borderRadius: 2 }}>
                  {error}
                </Alert>
              )}

              <Button
                fullWidth
                variant="contained"
                size="large"
                onClick={handleSubmit}
                disabled={submitting}
                endIcon={submitting ? <CircularProgress size={18} sx={{ color: "white" }} /> : <SendIcon />}
                sx={{
                  borderRadius: "50px",
                  py: 1.5,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #d97a9c, #9b7bd0)",
                  boxShadow: "0 6px 20px rgba(217,122,156,0.28)",
                  "&:hover": {
                    background: "linear-gradient(135deg, #c2628a, #8568b8)",
                    transform: "translateY(-2px)",
                  },
                  transition: "all 0.3s",
                }}
              >
                {submitting ? "Posting…" : "Submit Review"}
              </Button>
            </Paper>
          </Grid>

          {/* Reviews List */}
          <Grid item xs={12} md={8}>
            {loadingReviews ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
                <CircularProgress />
              </Box>
            ) : reviews.length === 0 ? (
              <Paper elevation={0} sx={{ p: 6, textAlign: "center", borderRadius: 4, border: "1px solid", borderColor: "divider" }}>
                <Typography sx={{ fontSize: "3rem", mb: 1 }}>⭐</Typography>
                <Typography variant="h6" fontWeight={700}>Be the first to review!</Typography>
                <Typography variant="body2" color="text.secondary" mt={1}>
                  Share what you loved about your order — your words help others discover their favourites.
                </Typography>
              </Paper>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                {reviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.4 }}
                  >
                    <Paper
                      elevation={0}
                      sx={{
                        borderRadius: 4,
                        p: 4,
                        border: "1px solid",
                        borderColor: "divider",
                        background: "white",
                        transition: "all 0.3s",
                        "&:hover": {
                          boxShadow: "0 12px 40px rgba(217,122,156,0.12)",
                          transform: "translateY(-3px)",
                          borderColor: alpha("#d97a9c", 0.25),
                        },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2.5 }}>
                        <Avatar
                          sx={{
                            width: 48,
                            height: 48,
                            background: avatarColors[index % avatarColors.length],
                            fontWeight: 700,
                            fontSize: "1.2rem",
                            flexShrink: 0,
                          }}
                        >
                          {review.user?.name ? review.user.name[0] : "C"}
                        </Avatar>
                        <Box sx={{ flex: 1 }}>
                          <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mb: 0.3, flexWrap: "wrap", gap: 1 }}>
                            <Box>
                              <Typography fontWeight={700}>{review.user?.name || "Customer"}</Typography>
                              <Typography variant="caption" color="text.secondary">
                                on <strong>{review.product?.name || "Sweet Treat"}</strong>
                              </Typography>
                            </Box>
                            <StarRating rating={review.rating} />
                          </Box>
                          <Typography variant="body1" color="text.secondary" lineHeight={1.8} fontStyle="italic" mt={1}>
                            &quot;{review.comment}&quot;
                          </Typography>
                        </Box>
                      </Box>
                    </Paper>
                  </motion.div>
                ))}
              </Box>
            )}
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
