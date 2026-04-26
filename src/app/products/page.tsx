"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import Link from "next/link"
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  Button,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  FormControlLabel,
  Checkbox,
  FormGroup,
  Alert,
  Skeleton,
  alpha,
  Tooltip,
  Badge,
  Divider,
} from "@mui/material"
import {
  ShoppingCart as CartIcon,
  Favorite as HeartIcon,
  FavoriteBorder as HeartBorderIcon,
  Add as AddIcon,
  Remove as RemoveIcon,
  Edit as EditIcon,
  Close as CloseIcon,
  LocalOffer as TagIcon,
} from "@mui/icons-material"
import { useCart } from "@/app/cart/components/CartContext"

interface Product {
  id: number
  name: string
  description: string
  price: number
  image: string
}

interface CustomizationOptions {
  toppings: string[]
  message: string
}

export default function ProductPage() {
  const { cart, addToCart } = useCart()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({})
  const [wishlist, setWishlist] = useState<Set<number>>(new Set())
  const [customizationModal, setCustomizationModal] = useState<{ isOpen: boolean; productId: number | null }>({
    isOpen: false,
    productId: null,
  })
  const [customization, setCustomization] = useState<CustomizationOptions>({ toppings: [], message: "" })
  const [addedToCart, setAddedToCart] = useState<Set<number>>(new Set())

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products")
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`)
        const data = await res.json()
        if (!data.products || !Array.isArray(data.products)) throw new Error("Invalid API response format")
        setProducts(data.products)
        const initialQuantities = data.products.reduce((acc: { [key: number]: number }, product: Product) => {
          acc[product.id] = 1
          return acc
        }, {})
        setQuantities(initialQuantities)
      } catch (error) {
        setError("Failed to load products. Please try again.")
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleQuantityChange = (productId: number, change: number) => {
    setQuantities((prev) => ({
      ...prev,
      [productId]: Math.max(1, (prev[productId] || 1) + change),
    }))
  }

  const handleAddToCart = (product: Product) => {
    addToCart({
      id: product.id,
      name: product.name,
      image: product.image,
      price: product.price,
      qty: quantities[product.id] || 1,
    })
    setAddedToCart((prev) => new Set(prev).add(product.id))
    setTimeout(() => {
      setAddedToCart((prev) => {
        const next = new Set(prev)
        next.delete(product.id)
        return next
      })
    }, 1500)
  }

  const toggleWishlist = (id: number) => {
    setWishlist((prev) => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      return next
    })
  }

  const openCustomizationModal = (productId: number) => {
    setCustomizationModal({ isOpen: true, productId })
  }

  const closeCustomizationModal = () => {
    setCustomizationModal({ isOpen: false, productId: null })
    setCustomization({ toppings: [], message: "" })
  }

  const handleCustomization = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    closeCustomizationModal()
  }

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fafafa" }}>
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
        {/* Error */}
        {error && (
          <Alert severity="error" sx={{ mb: 4, borderRadius: 2 }}>
            {error}
          </Alert>
        )}

        {/* Products Grid */}
        <Grid container spacing={3}>
          {loading
            ? [...Array(8)].map((_, i) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={i}>
                <Skeleton variant="rounded" height={400} sx={{ borderRadius: 3 }} />
              </Grid>
            ))
            : products.map((product, index) => {
              const imageUrl = product.image?.startsWith("/") ? product.image : `/${product.image}`
              const isWishlisted = wishlist.has(product.id)
              const isAdded = addedToCart.has(product.id)

              return (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.06, duration: 0.4 }}
                  >
                    <Card
                      sx={{
                        borderRadius: 4,
                        overflow: "hidden",
                        boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
                        transition: "all 0.35s ease",
                        "&:hover": {
                          boxShadow: "0 20px 60px rgba(236,72,153,0.18)",
                          transform: "translateY(-6px)",
                          "& .product-img": { transform: "scale(1.08)" },
                          "& .product-actions-overlay": { opacity: 1 },
                        },
                      }}
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
                        {/* Overlay actions */}
                        <Box
                          className="product-actions-overlay"
                          sx={{
                            position: "absolute",
                            inset: 0,
                            bgcolor: alpha("#000", 0.38),
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            gap: 1.5,
                            opacity: 0,
                            transition: "opacity 0.3s",
                          }}
                        >
                          <Tooltip title="Add to Cart">
                            <IconButton
                              onClick={() => handleAddToCart(product)}
                              sx={{ bgcolor: "white", color: "primary.main", "&:hover": { bgcolor: "primary.main", color: "white" } }}
                            >
                              <CartIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Customize">
                            <IconButton
                              onClick={() => openCustomizationModal(product.id)}
                              sx={{ bgcolor: "white", color: "#8b5cf6", "&:hover": { bgcolor: "#8b5cf6", color: "white" } }}
                            >
                              <EditIcon />
                            </IconButton>
                          </Tooltip>
                        </Box>
                        {/* Wishlist */}
                        <IconButton
                          onClick={() => toggleWishlist(product.id)}
                          sx={{
                            position: "absolute",
                            top: 8,
                            right: 8,
                            bgcolor: alpha("#fff", 0.9),
                            backdropFilter: "blur(4px)",
                            "&:hover": { bgcolor: "white" },
                          }}
                        >
                          {isWishlisted ? (
                            <HeartIcon sx={{ color: "primary.main", fontSize: 20 }} />
                          ) : (
                            <HeartBorderIcon sx={{ color: "text.secondary", fontSize: 20 }} />
                          )}
                        </IconButton>
                      </Box>

                      <CardContent sx={{ px: 2.5, pt: 2, pb: 1 }}>
                        <Link href={`/products/${product.id}`} style={{ textDecoration: "none" }}>
                          <Typography
                            variant="subtitle1"
                            fontWeight={700}
                            color="text.primary"
                            sx={{ "&:hover": { color: "primary.main" }, transition: "color 0.2s", cursor: "pointer" }}
                          >
                            {product.name}
                          </Typography>
                        </Link>
                        <Typography variant="body2" color="text.secondary" noWrap sx={{ mt: 0.5, mb: 1.5 }}>
                          {product.description}
                        </Typography>
                        {/* Price + Quantity */}
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
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(product.id, -1)}
                              sx={{ bgcolor: alpha("#ec4899", 0.1), color: "primary.main", width: 28, height: 28 }}
                            >
                              <RemoveIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                            <Typography fontWeight={700} sx={{ minWidth: 24, textAlign: "center" }}>
                              {quantities[product.id] || 1}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleQuantityChange(product.id, 1)}
                              sx={{ bgcolor: alpha("#ec4899", 0.1), color: "primary.main", width: 28, height: 28 }}
                            >
                              <AddIcon sx={{ fontSize: 14 }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </CardContent>

                      <CardActions sx={{ px: 2.5, pb: 2.5, pt: 0 }}>
                        <Button
                          fullWidth
                          variant="contained"
                          startIcon={<CartIcon />}
                          onClick={() => handleAddToCart(product)}
                          sx={{
                            borderRadius: "50px",
                            py: 1.2,
                            fontWeight: 700,
                            background: isAdded
                              ? "linear-gradient(135deg, #22c55e, #16a34a)"
                              : "linear-gradient(135deg, #ec4899, #8b5cf6)",
                            boxShadow: isAdded
                              ? "0 4px 15px rgba(34,197,94,0.4)"
                              : "0 4px 15px rgba(236,72,153,0.35)",
                            transition: "all 0.3s",
                            "&:hover": {
                              background: isAdded
                                ? "linear-gradient(135deg, #16a34a, #15803d)"
                                : "linear-gradient(135deg, #be185d, #7c3aed)",
                              transform: "scale(1.02)",
                            },
                          }}
                        >
                          {isAdded ? "✓ Added!" : "Add to Cart"}
                        </Button>
                      </CardActions>
                    </Card>
                  </motion.div>
                </Grid>
              )
            })}
        </Grid>
      </Container>

      {/* Customization Modal */}
      <Dialog
        open={customizationModal.isOpen}
        onClose={closeCustomizationModal}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4 } }}
      >
        <DialogTitle
          sx={{
            background: "linear-gradient(135deg, #fce7f3, #f5f3ff)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            pb: 2,
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            🎨 Customize Your Cupcake
          </Typography>
          <IconButton onClick={closeCustomizationModal} size="small">
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <form onSubmit={handleCustomization}>
          <DialogContent sx={{ pt: 3 }}>
            <Typography variant="subtitle2" fontWeight={600} mb={1.5} color="text.secondary">
              Choose Toppings
            </Typography>
            <FormGroup row sx={{ gap: 1, mb: 3 }}>
              {["Sprinkles", "Chocolate Chips", "Nuts", "Fruit"].map((topping) => (
                <FormControlLabel
                  key={topping}
                  control={
                    <Checkbox
                      checked={customization.toppings.includes(topping)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setCustomization((prev) => ({ ...prev, toppings: [...prev.toppings, topping] }))
                        } else {
                          setCustomization((prev) => ({
                            ...prev,
                            toppings: prev.toppings.filter((t) => t !== topping),
                          }))
                        }
                      }}
                      sx={{ color: "primary.main" }}
                    />
                  }
                  label={topping}
                  sx={{
                    border: "1px solid",
                    borderColor: customization.toppings.includes(topping) ? "primary.main" : "divider",
                    borderRadius: 2,
                    px: 1,
                    m: 0,
                    bgcolor: customization.toppings.includes(topping) ? alpha("#ec4899", 0.06) : "transparent",
                    transition: "all 0.2s",
                  }}
                />
              ))}
            </FormGroup>
            <TextField
              fullWidth
              label="Custom Message on Cake"
              placeholder="e.g. Happy Birthday! 🎂"
              value={customization.message}
              onChange={(e) => setCustomization((prev) => ({ ...prev, message: e.target.value }))}
              multiline
              rows={2}
              variant="outlined"
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
            />
          </DialogContent>
          <DialogActions sx={{ px: 3, pb: 3, gap: 1 }}>
            <Button onClick={closeCustomizationModal} variant="outlined" sx={{ borderRadius: "50px", px: 3 }}>
              Cancel
            </Button>
            <Button
              type="submit"
              variant="contained"
              sx={{
                borderRadius: "50px",
                px: 4,
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                fontWeight: 700,
              }}
            >
              Apply Customization
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </Box>
  )
}
