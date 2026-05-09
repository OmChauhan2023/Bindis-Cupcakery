"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
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
  ToggleButton,
  ToggleButtonGroup,
} from "@mui/material"
import {
  Favorite as HeartIcon,
  FavoriteBorder as HeartBorderIcon,
  Add as AddIcon,
  Search as SearchIcon,
  Sort as SortIcon,
  GridView as GridIcon,
  ViewList as ListIcon,
  Visibility as EyeIcon,
} from "@mui/icons-material"
import QuickViewModal from "./components/QuickViewModal"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
  category?: string
}

const CATEGORIES = ["All", "Cupcake", "Brownie", "Cookie", "Truffle", "Donut"]

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string>("")
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const [search, setSearch] = useState("")
  const [category, setCategory] = useState("All")
  const [sortBy, setSortBy] = useState<"featured" | "price-asc" | "price-desc" | "name">("featured")
  const [view, setView] = useState<"grid" | "list">("grid")
  const [activeProduct, setActiveProduct] = useState<Product | null>(null)

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
        const data = await res.json()
        if (!data.products || !Array.isArray(data.products)) throw new Error("Invalid API response format")
        setProducts(data.products)
      } catch {
        setError("Failed to load products. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const filteredProducts = (() => {
    const filtered = products
      .filter((p) => category === "All" || p.category === category)
      .filter((p) =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase())
      )
    return [...filtered].sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price
      if (sortBy === "price-desc") return b.price - a.price
      if (sortBy === "name") return a.name.localeCompare(b.name)
      return 0
    })
  })()

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
            🧁 Cupcake Paradise
          </Typography>
          <Typography variant="h6" color="text.secondary">
            Handcrafted with love, baked with care — eggless, homemade goodness
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 6 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Filter & Sort Bar */}
        <Box sx={{ mb: 4, p: 2.5, borderRadius: 4, bgcolor: "white", border: "1px solid", borderColor: "divider", boxShadow: "0 4px 20px rgba(0,0,0,0.04)" }}>
          <Stack direction={{ xs: "column", md: "row" }} spacing={2} alignItems={{ md: "center" }}>
            <TextField
              placeholder="Search treats…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              size="small"
              sx={{ flex: 1, "& .MuiOutlinedInput-root": { borderRadius: 50 } }}
              InputProps={{
                startAdornment: <InputAdornment position="start"><SearchIcon /></InputAdornment>,
              }}
            />
            <Stack direction="row" spacing={1} sx={{ overflowX: "auto", pb: { xs: 0.5, md: 0 } }}>
              {CATEGORIES.map((c) => (
                <Chip
                  key={c}
                  label={c}
                  onClick={() => setCategory(c)}
                  sx={{
                    fontWeight: 700,
                    cursor: "pointer",
                    background: category === c ? "linear-gradient(135deg, #d97a9c, #9b7bd0)" : "transparent",
                    color: category === c ? "white" : "text.secondary",
                    border: "1px solid",
                    borderColor: category === c ? "transparent" : "divider",
                    "&:hover": { borderColor: "primary.main" },
                  }}
                />
              ))}
            </Stack>
            <Select
              size="small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              startAdornment={<InputAdornment position="start"><SortIcon sx={{ fontSize: 18 }} /></InputAdornment>}
              sx={{ minWidth: 170, borderRadius: 50, "& .MuiOutlinedInput-notchedOutline": { borderRadius: 50 } }}
            >
              <MenuItem value="featured">Featured</MenuItem>
              <MenuItem value="price-asc">Price: Low to High</MenuItem>
              <MenuItem value="price-desc">Price: High to Low</MenuItem>
              <MenuItem value="name">Name (A–Z)</MenuItem>
            </Select>
            <ToggleButtonGroup
              size="small"
              value={view}
              exclusive
              onChange={(_, v) => v && setView(v)}
              sx={{ "& .MuiToggleButton-root": { borderRadius: 2, px: 1.5 } }}
            >
              <ToggleButton value="grid"><GridIcon fontSize="small" /></ToggleButton>
              <ToggleButton value="list"><ListIcon fontSize="small" /></ToggleButton>
            </ToggleButtonGroup>
          </Stack>
        </Box>

        {!loading && (
          <Box sx={{ mb: 2.5 }}>
            <Typography variant="body2" color="text.secondary">
              Showing <Typography component="span" fontWeight={700} color="text.primary">{filteredProducts.length}</Typography> of {products.length} treats — tap any item for ingredients & customization
            </Typography>
          </Box>
        )}

        {!loading && filteredProducts.length === 0 ? (
          <Box sx={{ textAlign: "center", py: 10 }}>
            <Typography variant="h5" fontWeight={700} color="text.secondary">No treats match your search 🥺</Typography>
            <Typography variant="body2" color="text.disabled" mt={1}>Try a different category or search term</Typography>
          </Box>
        ) : null}

        {/* Products Grid */}
        <Grid container spacing={3}>
          {loading
            ? [...Array(8)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
            : filteredProducts.map((product, index) => {
              const imageUrl = product.image?.startsWith("/") ? product.image : `/${product.image}`
              const isWishlisted = wishlist.has(product.id)
              const gridSize = view === "list"
                ? { xs: 12 }
                : { xs: 12, sm: 6, md: 4, lg: 3 }
              const openQuickView = () => setActiveProduct(product)

              return (
                <Grid item {...gridSize} key={product.id}>
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
                          <Image
                            src={imageUrl || "/placeholder.svg"}
                            alt={product.name}
                            fill
                            style={{ objectFit: "cover" }}
                            priority={index < 4}
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
                            label="Quick View"
                            sx={{
                              bgcolor: alpha("#fff", 0.95),
                              color: "#9d4870",
                              fontWeight: 700,
                              backdropFilter: "blur(6px)",
                              "& .MuiChip-icon": { color: "#9d4870 !important" },
                            }}
                          />
                        </Box>

                        {/* Wishlist */}
                        <IconButton
                          onClick={(e) => { e.stopPropagation(); toggleWishlist(product.id) }}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: alpha("#fff", 0.92),
                            backdropFilter: "blur(4px)",
                            "&:hover": { bgcolor: "white" },
                          }}
                        >
                          {isWishlisted ? (
                            <HeartIcon sx={{ color: "#d97a9c", fontSize: 20 }} />
                          ) : (
                            <HeartBorderIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                          )}
                        </IconButton>

                        {/* Category chip */}
                        {product.category && (
                          <Chip
                            label={product.category}
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 10,
                              left: 10,
                              bgcolor: alpha("#fff", 0.9),
                              color: "#9d4870",
                              fontWeight: 700,
                              fontSize: "0.65rem",
                              backdropFilter: "blur(6px)",
                            }}
                          />
                        )}
                      </Box>

                      <CardContent sx={{ px: 2.5, pt: 2, pb: 2.5 }}>
                        <Link
                          href={`/products/${product.id}`}
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
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5, mb: 2 }}>
                          {product.description}
                        </Typography>

                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                          <Typography
                            variant="h6"
                            fontWeight={800}
                            sx={{
                              background: "linear-gradient(135deg, #be185d, #7c3aed)",
                              WebkitBackgroundClip: "text",
                              WebkitTextFillColor: "transparent",
                            }}
                          >
                            ₹{product.price}
                          </Typography>

                          <Tooltip title="Customize & add to cart">
                            <Button
                              onClick={(e) => { e.stopPropagation(); openQuickView() }}
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
              )
            })}
        </Grid>
      </Container>

      <QuickViewModal
        product={activeProduct}
        open={!!activeProduct}
        onClose={() => setActiveProduct(null)}
        isFavorite={activeProduct ? wishlist.has(activeProduct.id) : false}
        onToggleFavorite={toggleWishlist}
      />
    </Box>
  )
}
