import { useEffect, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Chip,
  TextField,
  Alert,
  Skeleton,
  alpha,
  Tooltip,
  Select,
  MenuItem,
  InputAdornment,
  Stack,
  Badge,
} from "@mui/material";
import {
  Favorite as HeartIcon,
  FavoriteBorder as HeartBorderIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  Visibility as EyeIcon,
} from "@mui/icons-material";
import QuickViewModal from "./components/QuickViewModal";
import api from "@/services/api";

interface Product {
  id: string;
  _id?: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category?: string;
}

// Category definitions with image, icon, and display name
const CATEGORY_META: {
  key: string;
  label: string;
  image: string;
  emoji: string;
  description: string;
}[] = [
  { key: "All", label: "All Treats", image: "/cupcake.jpg", emoji: "🧁", description: "Browse everything" },
  { key: "Truffle", label: "Truffles", image: "/Blueberry_Truffle.jpg", emoji: "🍫", description: "Melt-in-mouth truffles" },
  { key: "Brownie", label: "Brownies", image: "/Brownie_tub.jpg", emoji: "🍫", description: "Rich fudgy brownies" },
  { key: "Cookie", label: "Cookies", image: "/Jim_Jam_Cookies.jpg", emoji: "🍪", description: "Crispy & chewy cookies" },
  { key: "Donut", label: "Donuts", image: "/Donuts.jpg", emoji: "🍩", description: "Glazed to perfection" },
  { key: "Cupcake", label: "Cupcakes", image: "/Cookie_Dough_Brownie_Cup.jpg", emoji: "🧁", description: "Our signature treats" },
  { key: "Other", label: "Others", image: "/Cranberry_pistachio_blondie.jpg", emoji: "✨", description: "More sweet creations" },
];

// Products marked as bestsellers (by name, since MongoDB uses string ObjectIds)
const BESTSELLER_NAMES = new Set(["Brownie Tub", "Rasmalai Truffle", "Signature Cupcake"]);

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [wishlist, setWishlist] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured");
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);
  const [showTiles, setShowTiles] = useState(true); // show category tiles on first visit

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await api.get("/products");
        const data = res.data;
        if (!data.products || !Array.isArray(data.products)) throw new Error("Invalid API response format");
        setProducts(data.products);
      } catch {
        setError("Failed to load products. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const toggleWishlist = (id: string) => {
    setWishlist((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // Category counts
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: products.length };
    products.forEach((p) => {
      const cat = p.category || "Other";
      counts[cat] = (counts[cat] || 0) + 1;
    });
    return counts;
  }, [products]);

  const filteredProducts = useMemo(() => {
    const filtered = products
      .filter((p) => category === "All" || p.category === category)
      .filter(
        (p) =>
          p.name.toLowerCase().includes(search.toLowerCase()) ||
          p.description.toLowerCase().includes(search.toLowerCase())
      );
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      if (sortBy === "name") return a.name.localeCompare(b.name);
      return 0;
    });
  }, [products, category, search, sortBy]);

  const handleCategorySelect = (cat: string) => {
    setCategory(cat);
    setShowTiles(false);
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fdfaf7" }}>
      {/* Hero Banner */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #fce7f3 0%, #f5f3ff 50%, #fce7f3 100%)",
          py: 8,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: -60, left: -60, width: 250, height: 250, borderRadius: "50%", background: alpha("#ec4899", 0.12), filter: "blur(50px)" }} />
        <Box sx={{ position: "absolute", bottom: -60, right: -60, width: 250, height: 250, borderRadius: "50%", background: alpha("#8b5cf6", 0.12), filter: "blur(50px)" }} />
        <Container maxWidth="md">
          <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 4, fontWeight: 700 }}>
            fresh & delicious
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            fontWeight={800}
            sx={{
              background: "linear-gradient(135deg, #be185d, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mt: 1,
              mb: 2,
            }}
          >
            Our Menu 🧁
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Handcrafted with love, baked with care — eggless, homemade goodness
          </Typography>
        </Container>
      </Box>

      {/* ── Category Image Tiles (shown when "All" and no search) ── */}
      {showTiles && category === "All" && !search && (
        <Box sx={{ bgcolor: "white", py: 6 }}>
          <Container maxWidth="lg">
            <Typography variant="h5" fontWeight={800} textAlign="center" mb={1}>
              What are you craving today?
            </Typography>
            <Typography variant="body2" color="text.secondary" textAlign="center" mb={5}>
              Pick a category to explore our full range
            </Typography>
            <Grid container spacing={3} justifyContent="center">
              {CATEGORY_META.filter((c) => c.key !== "All").map((cat, i) => {
                const count = categoryCounts[cat.key] || 0;
                if (count === 0) return null;
                return (
                  <Grid item xs={6} sm={4} md={3} key={cat.key}>
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.07, duration: 0.4 }}
                    >
                      <Box
                        onClick={() => handleCategorySelect(cat.key)}
                        sx={{
                          borderRadius: 4,
                          overflow: "hidden",
                          cursor: "pointer",
                          position: "relative",
                          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                          transition: "all 0.3s ease",
                          "&:hover": {
                            transform: "translateY(-6px)",
                            boxShadow: "0 16px 40px rgba(190,24,93,0.18)",
                            "& .cat-overlay": { opacity: 1 },
                            "& .cat-img": { transform: "scale(1.08)" },
                          },
                        }}
                      >
                        <Box sx={{ height: 200, overflow: "hidden" }}>
                          <Box
                            className="cat-img"
                            sx={{ transition: "transform 0.5s ease", height: "100%" }}
                          >
                            <img
                              src={cat.image}
                              alt={cat.label}
                              style={{ width: "100%", height: "100%", objectFit: "cover", display: "block" }}
                            />
                          </Box>
                        </Box>
                        {/* Dark gradient overlay */}
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            background: "linear-gradient(180deg, transparent 30%, rgba(0,0,0,0.68) 100%)",
                          }}
                        />
                        {/* Count badge */}
                        <Chip
                          label={`${count} items`}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            bgcolor: alpha("#fff", 0.9),
                            color: "#be185d",
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            backdropFilter: "blur(6px)",
                          }}
                        />
                        {/* Label */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 16,
                            left: 0,
                            right: 0,
                            textAlign: "center",
                          }}
                        >
                          <Typography
                            variant="h6"
                            fontWeight={800}
                            color="white"
                            sx={{ letterSpacing: 1, textTransform: "uppercase", fontSize: "0.95rem" }}
                          >
                            {cat.emoji} {cat.label}
                          </Typography>
                          <Typography variant="caption" sx={{ color: alpha("#fff", 0.8) }}>
                            {cat.description}
                          </Typography>
                        </Box>
                        {/* Hover shop now overlay */}
                        <Box
                          className="cat-overlay"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            bgcolor: alpha("#be185d", 0.18),
                            backdropFilter: "blur(2px)",
                            opacity: 0,
                            transition: "opacity 0.3s",
                          }}
                        >
                          <Chip
                            label="Shop Now →"
                            sx={{
                              bgcolor: "white",
                              color: "#be185d",
                              fontWeight: 800,
                              fontSize: "0.85rem",
                              px: 1,
                            }}
                          />
                        </Box>
                      </Box>
                    </motion.div>
                  </Grid>
                );
              })}
            </Grid>
            <Box sx={{ textAlign: "center", mt: 5 }}>
              <Button
                onClick={() => setShowTiles(false)}
                variant="outlined"
                sx={{
                  borderRadius: "50px",
                  px: 5,
                  py: 1.2,
                  fontWeight: 700,
                  borderColor: "#be185d",
                  color: "#be185d",
                  "&:hover": { bgcolor: alpha("#be185d", 0.05) },
                }}
              >
                View All Products
              </Button>
            </Box>
          </Container>
        </Box>
      )}

      {/* ── Main Products Section: Sidebar + Grid ── */}
      {(!showTiles || category !== "All" || search) && (
        <Container maxWidth="xl" sx={{ py: 5 }}>
          {error && (
            <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
            {/* ── Left Sidebar ── */}
            <Box
              sx={{
                width: 240,
                flexShrink: 0,
                display: { xs: "none", md: "block" },
                position: "sticky",
                top: 90,
              }}
            >
              <Box
                sx={{
                  bgcolor: "white",
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: "divider",
                  overflow: "hidden",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                }}
              >
                <Box
                  sx={{
                    px: 2.5,
                    py: 2,
                    background: "linear-gradient(135deg, #fce7f3, #f5f3ff)",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                  }}
                >
                  <Typography variant="subtitle2" fontWeight={800} sx={{ color: "#be185d", letterSpacing: 1 }}>
                    CATEGORIES
                  </Typography>
                </Box>
                {CATEGORY_META.map((cat) => {
                  const count = cat.key === "All" ? products.length : categoryCounts[cat.key] || 0;
                  if (cat.key !== "All" && count === 0) return null;
                  const isActive = category === cat.key;
                  return (
                    <Box
                      key={cat.key}
                      onClick={() => { setCategory(cat.key); }}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        px: 2.5,
                        py: 1.6,
                        cursor: "pointer",
                        bgcolor: isActive ? alpha("#ec4899", 0.07) : "transparent",
                        borderLeft: isActive ? "3px solid #be185d" : "3px solid transparent",
                        transition: "all 0.2s",
                        "&:hover": { bgcolor: alpha("#ec4899", 0.05) },
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                        <Typography sx={{ fontSize: "1.1rem" }}>{cat.emoji}</Typography>
                        <Typography
                          variant="body2"
                          fontWeight={isActive ? 700 : 500}
                          color={isActive ? "#be185d" : "text.primary"}
                        >
                          {cat.label}
                        </Typography>
                      </Box>
                      <Chip
                        label={count}
                        size="small"
                        sx={{
                          height: 20,
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          bgcolor: isActive ? "#be185d" : alpha("#000", 0.07),
                          color: isActive ? "white" : "text.secondary",
                        }}
                      />
                    </Box>
                  );
                })}
              </Box>

              {/* Back to categories link */}
              <Button
                onClick={() => { setCategory("All"); setSearch(""); setShowTiles(true); }}
                variant="text"
                size="small"
                sx={{ mt: 1.5, color: "text.secondary", fontWeight: 600, width: "100%" }}
              >
                ← Back to Categories
              </Button>
            </Box>

            {/* ── Right: Search/Sort + Grid ── */}
            <Box sx={{ flex: 1, minWidth: 0 }}>
              {/* Search + Sort bar */}
              <Box
                sx={{
                  mb: 3,
                  p: 2,
                  borderRadius: 4,
                  bgcolor: "white",
                  border: "1px solid",
                  borderColor: "divider",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  display: "flex",
                  gap: 2,
                  alignItems: "center",
                  flexWrap: "wrap",
                }}
              >
                <TextField
                  placeholder="Search treats…"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  size="small"
                  sx={{ flex: 1, minWidth: 160, "& .MuiOutlinedInput-root": { borderRadius: 50 } }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
                  }}
                />
                {/* Mobile category chips */}
                <Stack
                  direction="row"
                  spacing={0.8}
                  sx={{ overflowX: "auto", pb: 0.5, display: { md: "none" } }}
                >
                  {CATEGORY_META.map((c) =>
                    (c.key === "All" || (categoryCounts[c.key] || 0) > 0) ? (
                      <Chip
                        key={c.key}
                        label={c.emoji + " " + c.label}
                        onClick={() => setCategory(c.key)}
                        size="small"
                        sx={{
                          fontWeight: 700,
                          cursor: "pointer",
                          flexShrink: 0,
                          background: category === c.key ? "linear-gradient(135deg, #d97a9c, #9b7bd0)" : "transparent",
                          color: category === c.key ? "white" : "text.secondary",
                          border: "1px solid",
                          borderColor: category === c.key ? "transparent" : "divider",
                        }}
                      />
                    ) : null
                  )}
                </Stack>
                <Select
                  size="small"
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
                  startAdornment={<InputAdornment position="start"><SortIcon sx={{ fontSize: 18 }} /></InputAdornment>}
                  sx={{ minWidth: 160, borderRadius: 50, "& .MuiOutlinedInput-notchedOutline": { borderRadius: 50 } }}
                >
                  <MenuItem value="featured">Featured</MenuItem>
                  <MenuItem value="price-asc">Price: Low to High</MenuItem>
                  <MenuItem value="price-desc">Price: High to Low</MenuItem>
                  <MenuItem value="name">Name (A–Z)</MenuItem>
                </Select>
              </Box>

              {/* Results count */}
              {!loading && (
                <Typography variant="body2" color="text.secondary" mb={2.5}>
                  Showing{" "}
                  <Typography component="span" fontWeight={700} color="text.primary">
                    {filteredProducts.length}
                  </Typography>{" "}
                  {category !== "All" ? `${category}s` : "treats"} — click any item to customise & add to cart
                </Typography>
              )}

              {!loading && filteredProducts.length === 0 && (
                <Box sx={{ textAlign: "center", py: 10 }}>
                  <Typography variant="h5" fontWeight={700} color="text.secondary">
                    No treats match your search 🥺
                  </Typography>
                  <Typography variant="body2" color="text.disabled" mt={1}>
                    Try a different category or search term
                  </Typography>
                </Box>
              )}

              {/* Products Grid */}
              <Grid container spacing={2.5}>
                {loading
                  ? [...Array(8)].map((_, i) => (
                    <Grid item xs={12} sm={6} md={4} key={i}>
                      <Skeleton variant="rounded" height={380} sx={{ borderRadius: 3 }} />
                    </Grid>
                  ))
                  : filteredProducts.map((product, index) => {
                    const imageUrl = product.image?.startsWith("http") ? product.image : (product.image?.startsWith("/") ? product.image : `/${product.image}`);
                    const isWishlisted = wishlist.has(product.id);
                    const isBestseller = BESTSELLER_NAMES.has(product.name);
                    const openQuickView = () => setActiveProduct(product);

                    return (
                      <Grid item xs={12} sm={6} md={4} key={product.id}>
                        <motion.div
                          initial={{ opacity: 0, y: 30 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: index * 0.04, duration: 0.35 }}
                        >
                          <Card
                            sx={{
                              borderRadius: 4,
                              overflow: "hidden",
                              boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                              transition: "all 0.3s ease",
                              cursor: "pointer",
                              "&:hover": {
                                boxShadow: "0 16px 50px rgba(217,122,156,0.18)",
                                transform: "translateY(-4px)",
                                "& .product-img": { transform: "scale(1.06)" },
                                "& .quick-overlay": { opacity: 1 },
                              },
                            }}
                            onClick={openQuickView}
                          >
                            {/* Image */}
                            <Box sx={{ position: "relative", height: 220, overflow: "hidden" }}>
                              <Box className="product-img" sx={{ transition: "transform 0.5s ease", height: "100%", position: "relative" }}>
                                <img
                                  src={imageUrl || "/placeholder.svg"}
                                  alt={product.name}
                                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                                />
                              </Box>

                              {/* Quick view overlay */}
                              <Box
                                className="quick-overlay"
                                sx={{
                                  position: "absolute",
                                  inset: 0,
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  background: "linear-gradient(180deg, rgba(0,0,0,0) 30%, rgba(0,0,0,0.45) 100%)",
                                  opacity: 0,
                                  transition: "opacity 0.3s",
                                }}
                              >
                                <Chip
                                  icon={<EyeIcon sx={{ color: "white !important", fontSize: 16 }} />}
                                  label="Customise & Add"
                                  sx={{
                                    bgcolor: alpha("#fff", 0.95),
                                    color: "#9d4870",
                                    fontWeight: 700,
                                    backdropFilter: "blur(6px)",
                                    "& .MuiChip-icon": { color: "#9d4870 !important" },
                                  }}
                                />
                              </Box>

                              {/* 🟢 Veg dot — top right */}
                              <Box
                                sx={{
                                  position: "absolute",
                                  top: 10,
                                  right: 10,
                                  width: 18,
                                  height: 18,
                                  borderRadius: 1,
                                  border: "1.5px solid #22c55e",
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "center",
                                  bgcolor: "white",
                                }}
                              >
                                <Box
                                  sx={{
                                    width: 10,
                                    height: 10,
                                    borderRadius: "50%",
                                    bgcolor: "#22c55e",
                                  }}
                                />
                              </Box>

                              {/* 🏷️ Bestseller badge — top left */}
                              {isBestseller && (
                                <Chip
                                  label="⭐ Bestseller"
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    top: 10,
                                    left: 10,
                                    bgcolor: "#f59e0b",
                                    color: "white",
                                    fontWeight: 800,
                                    fontSize: "0.65rem",
                                    height: 22,
                                  }}
                                />
                              )}

                              {/* Wishlist */}
                              <IconButton
                                onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id); }}
                                sx={{
                                  position: "absolute",
                                  bottom: 8,
                                  right: 8,
                                  bgcolor: alpha("#fff", 0.92),
                                  backdropFilter: "blur(4px)",
                                  width: 32,
                                  height: 32,
                                  "&:hover": { bgcolor: "white" },
                                }}
                              >
                                {isWishlisted ? (
                                  <HeartIcon sx={{ color: "#d97a9c", fontSize: 18 }} />
                                ) : (
                                  <HeartBorderIcon sx={{ color: "text.secondary", fontSize: 18 }} />
                                )}
                              </IconButton>
                            </Box>

                            <CardContent sx={{ px: 2.5, pt: 2, pb: "16px !important" }}>
                              <Link
                                to={`/products/${product.id}`}
                                style={{ textDecoration: "none" }}
                                onClick={(e) => e.stopPropagation()}
                              >
                                <Typography
                                  variant="subtitle1"
                                  fontWeight={700}
                                  color="text.primary"
                                  sx={{ "&:hover": { color: "primary.main" }, transition: "color 0.2s" }}
                                >
                                  {product.name}
                                </Typography>
                              </Link>
                              <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.3, mb: 1.5 }}>
                                {product.description}
                              </Typography>

                              <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                                <Box>
                                  <Typography
                                    variant="h6"
                                    fontWeight={800}
                                    sx={{
                                      background: "linear-gradient(135deg, #be185d, #7c3aed)",
                                      WebkitBackgroundClip: "text",
                                      WebkitTextFillColor: "transparent",
                                      lineHeight: 1.2,
                                    }}
                                  >
                                    ₹{product.price}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "#9d4870", fontWeight: 600, fontSize: "0.68rem" }}
                                  >
                                    Customisable
                                  </Typography>
                                </Box>

                                <Tooltip title="Customise & add to cart">
                                  <Button
                                    onClick={(e) => { e.stopPropagation(); openQuickView(); }}
                                    variant="contained"
                                    size="small"
                                    startIcon={<AddIcon />}
                                    sx={{
                                      borderRadius: 50,
                                      fontWeight: 700,
                                      px: 2,
                                      background: "linear-gradient(135deg, #d97a9c, #9b7bd0)",
                                      boxShadow: "0 4px 14px rgba(217,122,156,0.28)",
                                      "&:hover": {
                                        background: "linear-gradient(135deg, #c2628a, #8568b8)",
                                        boxShadow: "0 6px 18px rgba(217,122,156,0.4)",
                                      },
                                    }}
                                  >
                                    Add
                                  </Button>
                                </Tooltip>
                              </Box>
                            </CardContent>
                          </Card>
                        </motion.div>
                      </Grid>
                    );
                  })}
              </Grid>
            </Box>
          </Box>
        </Container>
      )}

      <QuickViewModal
        product={activeProduct}
        open={!!activeProduct}
        onClose={() => setActiveProduct(null)}
        isFavorite={activeProduct ? wishlist.has(activeProduct.id) : false}
        onToggleFavorite={toggleWishlist}
      />
    </Box>
  );
}
