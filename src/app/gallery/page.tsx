"use client"

import { useState, useEffect, useCallback } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
import {
  Box,
  Container,
  Typography,
  Grid,
  Chip,
  IconButton,
  alpha,
} from "@mui/material"
import {
  Close as CloseIcon,
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
  ZoomIn as ZoomIcon,
  CameraAlt as CameraIcon,
} from "@mui/icons-material"

/* ─── Data ─────────────────────────────────────────────────── */
const categories = ["All", "Truffles", "Brownies", "Cookies", "Bakery"] as const
type Category = (typeof categories)[number]

interface GalleryItem {
  src: string
  alt: string
  caption: string
  category: Category
  span?: "wide" | "tall" | "normal"
}

const galleryItems: GalleryItem[] = [
  { src: "/bakery_interior.jpg",            alt: "Bakery Interior",        caption: "Our Cozy Kitchen",          category: "Bakery",   span: "wide" },
  { src: "/cupcake.jpg",                    alt: "Cupcake Display",        caption: "Fresh Cupcakes",            category: "Bakery" },
  { src: "/cake_decoration.jpg",            alt: "Cake Decorating",        caption: "The Art of Decoration",     category: "Bakery",   span: "tall" },
  { src: "/Brownie_tub.jpg",               alt: "Brownie Tub",            caption: "Brownie Tub",               category: "Brownies" },
  { src: "/Dark_Chocolate_walnut_brownie.jpg", alt: "Dark Choc Brownie",  caption: "Dark Choc Walnut Brownie",  category: "Brownies", span: "wide" },
  { src: "/Cookie_Dough_Brownie.jpg",      alt: "Cookie Dough Brownie",   caption: "Cookie Dough Brownie",      category: "Brownies" },
  { src: "/Dark_Chocolate_hazelnut_Brownie.jpg", alt: "Hazelnut Brownie", caption: "Hazelnut Brownie",          category: "Brownies" },
  { src: "/Cranberry_pistachio_blondie.jpg",alt: "Cranberry Blondie",     caption: "Cranberry Pistachio Blondie",category:"Brownies",span:"tall" },
  { src: "/Blueberry_Truffle.jpg",         alt: "Blueberry Truffle",      caption: "Blueberry Truffle",         category: "Truffles" },
  { src: "/Rasmalai_Truffle.jpg",          alt: "Rasmalai Truffle",       caption: "Rasmalai Truffle",          category: "Truffles" },
  { src: "/Coconut_Truffle.jpg",           alt: "Coconut Truffle",        caption: "Coconut Truffle",           category: "Truffles" },
  { src: "/Rose-pistacho_cranberry_truffle.jpg", alt:"Rose Truffle",      caption: "Rose Pistachio Truffle",    category: "Truffles", span: "wide" },
  { src: "/Mint_chocolate_Chips_Truffle.jpg",alt:"Mint Choc Truffle",     caption: "Mint Choc Chip Truffle",    category: "Truffles" },
  { src: "/Jim_Jam_Cookies.jpg",           alt: "Jim Jam Cookies",        caption: "Jim Jam Cookies",           category: "Cookies" },
  { src: "/Nutella_Sandwich_Cookies.jpg",  alt: "Nutella Cookies",        caption: "Nutella Sandwich Cookies",  category: "Cookies" },
  { src: "/Chocolate_Chips_Cookie.jpg",    alt: "Choco Chip Cookie",      caption: "Chocolate Chip Cookie",     category: "Cookies" },
  { src: "/chilli_cheese_cookies.jpg",     alt: "Chilli Cheese Cookie",   caption: "Chilli Cheese Cookies",     category: "Cookies" },
  { src: "/choco_day_cookies.jpg",         alt: "Choco Day Cookies",      caption: "Choco Day Cookies",         category: "Cookies" },
  { src: "/Donuts.jpg",                    alt: "Donuts",                 caption: "Fresh Donuts",              category: "Bakery",   span: "wide" },
  { src: "/happy_customers.jpg",           alt: "Happy Customers",        caption: "Happy Customers",           category: "Bakery" },
  { src: "/special_occasion.jpg",          alt: "Special Occasion Cakes", caption: "Special Occasions",         category: "Bakery" },
  { src: "/baking_process.jpg",            alt: "Baking Process",         caption: "Baked with Love",           category: "Bakery" },
]

/* ─── Component ────────────────────────────────────────────── */
export default function GalleryPage() {
  const [activeCategory, setActiveCategory] = useState<Category>("All")
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null)
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)

  const filtered = galleryItems.filter(
    (item) => activeCategory === "All" || item.category === activeCategory
  )

  const openLightbox = (i: number) => setLightboxIndex(i)
  const closeLightbox = () => setLightboxIndex(null)

  const goPrev = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex - 1 + filtered.length) % filtered.length)
  }, [lightboxIndex, filtered.length])

  const goNext = useCallback(() => {
    if (lightboxIndex === null) return
    setLightboxIndex((lightboxIndex + 1) % filtered.length)
  }, [lightboxIndex, filtered.length])

  /* Keyboard navigation */
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return
      if (e.key === "ArrowLeft") goPrev()
      if (e.key === "ArrowRight") goNext()
      if (e.key === "Escape") closeLightbox()
    }
    window.addEventListener("keydown", handler)
    return () => window.removeEventListener("keydown", handler)
  }, [lightboxIndex, goPrev, goNext])

  const categoryColors: Record<Category, string> = {
    All: "#ec4899",
    Truffles: "#8b5cf6",
    Brownies: "#f59e0b",
    Cookies: "#10b981",
    Bakery: "#3b82f6",
  }

  return (
    <Box sx={{ bgcolor: "#fafafa", minHeight: "100vh" }}>
      {/* ── Hero Header ─────────────────────────────────── */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #be185d 0%, #7c3aed 100%)",
          py: { xs: 8, md: 12 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative rings */}
        {[
          { size: 240, top: -60, left: "8%", opacity: 0.12 },
          { size: 180, bottom: -50, right: "10%", opacity: 0.1 },
          { size: 120, top: "30%", right: "25%", opacity: 0.07 },
        ].map(({ size, opacity, ...pos }, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              ...pos,
              width: size,
              height: size,
              borderRadius: "50%",
              border: `1px solid ${alpha("#fff", opacity)}`,
              pointerEvents: "none",
            }}
          />
        ))}

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Box
            sx={{
              display: "inline-flex",
              alignItems: "center",
              gap: 1,
              bgcolor: alpha("#fff", 0.12),
              border: "1px solid",
              borderColor: alpha("#fff", 0.25),
              borderRadius: "50px",
              px: 2.5,
              py: 0.8,
              mb: 3,
              backdropFilter: "blur(10px)",
            }}
          >
            <CameraIcon sx={{ color: alpha("#fff", 0.85), fontSize: 18 }} />
            <Typography
              variant="caption"
              sx={{ color: alpha("#fff", 0.85), fontWeight: 700, letterSpacing: 2 }}
            >
              OUR GALLERY
            </Typography>
          </Box>

          <Typography
            variant="h2"
            fontWeight={900}
            color="white"
            mb={2}
            sx={{ fontSize: { xs: "2rem", md: "3.2rem" }, lineHeight: 1.15 }}
          >
            A Feast for the Eyes 📸
          </Typography>
          <Typography
            color={alpha("#fff", 0.78)}
            sx={{ fontSize: { xs: "1rem", md: "1.15rem" }, maxWidth: 500, mx: "auto", lineHeight: 1.8 }}
          >
            Browse our collection of handcrafted creations — each made with love and the finest ingredients.
          </Typography>
        </Container>
      </Box>

      {/* ── Category Filter ─────────────────────────────── */}
      <Box
        sx={{
          position: "sticky",
          top: 80,
          zIndex: 50,
          bgcolor: alpha("#fafafa", 0.92),
          backdropFilter: "blur(12px)",
          borderBottom: "1px solid",
          borderColor: alpha("#000", 0.07),
          py: 2,
        }}
      >
        <Container maxWidth="lg">
          <Box sx={{ display: "flex", gap: 1.5, flexWrap: "wrap", justifyContent: "center" }}>
            {categories.map((cat) => {
              const isActive = activeCategory === cat
              const color = categoryColors[cat]
              return (
                <Chip
                  key={cat}
                  label={cat}
                  onClick={() => setActiveCategory(cat)}
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.85rem",
                    px: 1,
                    height: 36,
                    cursor: "pointer",
                    border: "1.5px solid",
                    borderColor: isActive ? color : alpha(color, 0.3),
                    bgcolor: isActive ? color : alpha(color, 0.06),
                    color: isActive ? "white" : color,
                    transition: "all 0.25s ease",
                    "&:hover": {
                      bgcolor: isActive ? color : alpha(color, 0.14),
                      transform: "translateY(-1px)",
                    },
                  }}
                />
              )
            })}
          </Box>
        </Container>
      </Box>

      {/* ── Grid ────────────────────────────────────────── */}
      <Container maxWidth="lg" sx={{ py: { xs: 5, md: 8 } }}>
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.35 }}
          >
            <Grid container spacing={{ xs: 1.5, md: 2.5 }}>
              {filtered.map((item, i) => {
                const isWide = item.span === "wide"
                const isTall = item.span === "tall"
                return (
                  <Grid
                    item
                    key={item.src}
                    xs={isWide ? 12 : 6}
                    sm={isWide ? 8 : 4}
                    md={isWide ? 6 : isTall ? 3 : 3}
                  >
                    <motion.div
                      initial={{ opacity: 0, scale: 0.94 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.4, delay: i * 0.04 }}
                    >
                      <Box
                        onClick={() => openLightbox(i)}
                        onMouseEnter={() => setHoveredIndex(i)}
                        onMouseLeave={() => setHoveredIndex(null)}
                        sx={{
                          position: "relative",
                          height: isTall
                            ? { xs: 240, md: 380 }
                            : isWide
                            ? { xs: 200, md: 280 }
                            : { xs: 160, md: 240 },
                          borderRadius: { xs: 3, md: 4 },
                          overflow: "hidden",
                          cursor: "pointer",
                          boxShadow:
                            hoveredIndex === i
                              ? "0 20px 50px rgba(0,0,0,0.2)"
                              : "0 4px 16px rgba(0,0,0,0.08)",
                          transition: "box-shadow 0.35s ease",
                        }}
                      >
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            transition: "transform 0.55s ease",
                            transform: hoveredIndex === i ? "scale(1.08)" : "scale(1)",
                          }}
                        >
                          <Image
                            src={item.src}
                            alt={item.alt}
                            fill
                            style={{ objectFit: "cover" }}
                          />
                        </Box>

                        {/* Gradient overlay on hover */}
                        <Box
                          sx={{
                            position: "absolute",
                            inset: 0,
                            background:
                              "linear-gradient(to top, rgba(0,0,0,0.72) 0%, rgba(0,0,0,0.05) 55%)",
                            opacity: hoveredIndex === i ? 1 : 0,
                            transition: "opacity 0.35s ease",
                          }}
                        />

                        {/* Caption on hover */}
                        <Box
                          sx={{
                            position: "absolute",
                            bottom: 0,
                            left: 0,
                            right: 0,
                            p: 2,
                            transform:
                              hoveredIndex === i ? "translateY(0)" : "translateY(100%)",
                            transition: "transform 0.35s ease",
                          }}
                        >
                          <Typography
                            variant="subtitle2"
                            color="white"
                            fontWeight={700}
                            sx={{ fontSize: { xs: "0.78rem", md: "0.88rem" } }}
                          >
                            {item.caption}
                          </Typography>
                          <Typography
                            variant="caption"
                            sx={{ color: alpha("#fff", 0.65), display: "block" }}
                          >
                            {item.category}
                          </Typography>
                        </Box>

                        {/* Zoom icon */}
                        <Box
                          sx={{
                            position: "absolute",
                            top: 10,
                            right: 10,
                            width: 36,
                            height: 36,
                            borderRadius: "50%",
                            bgcolor: alpha("#000", 0.45),
                            backdropFilter: "blur(6px)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            opacity: hoveredIndex === i ? 1 : 0,
                            transform:
                              hoveredIndex === i ? "scale(1) rotate(0deg)" : "scale(0.7) rotate(-15deg)",
                            transition: "all 0.35s ease",
                          }}
                        >
                          <ZoomIcon sx={{ color: "white", fontSize: 18 }} />
                        </Box>

                        {/* Category chip (always visible) */}
                        <Chip
                          label={item.category}
                          size="small"
                          sx={{
                            position: "absolute",
                            top: 10,
                            left: 10,
                            bgcolor: alpha(categoryColors[item.category], 0.85),
                            color: "white",
                            fontWeight: 700,
                            fontSize: "0.65rem",
                            height: 20,
                            borderRadius: "5px",
                            backdropFilter: "blur(6px)",
                            opacity: hoveredIndex === i ? 0 : 1,
                            transition: "opacity 0.25s ease",
                          }}
                        />
                      </Box>
                    </motion.div>
                  </Grid>
                )
              })}
            </Grid>
          </motion.div>
        </AnimatePresence>

        {/* Empty state */}
        {filtered.length === 0 && (
          <Box textAlign="center" py={12}>
            <Typography variant="h5" color="text.secondary">
              No items in this category yet.
            </Typography>
          </Box>
        )}
      </Container>

      {/* ── Lightbox ────────────────────────────────────── */}
      <AnimatePresence>
        {lightboxIndex !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            style={{
              position: "fixed",
              inset: 0,
              zIndex: 9999,
              background: "rgba(0,0,0,0.93)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
            onClick={closeLightbox}
          >
            {/* Counter */}
            <Box
              sx={{
                position: "fixed",
                top: 20,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10001,
                bgcolor: alpha("#fff", 0.12),
                backdropFilter: "blur(8px)",
                border: "1px solid",
                borderColor: alpha("#fff", 0.2),
                borderRadius: "50px",
                px: 2.5,
                py: 0.6,
              }}
            >
              <Typography variant="body2" color="white" fontWeight={700}>
                {lightboxIndex + 1} / {filtered.length}
              </Typography>
            </Box>

            {/* Close */}
            <IconButton
              onClick={closeLightbox}
              sx={{
                position: "fixed",
                top: 16,
                right: 20,
                zIndex: 10001,
                color: "white",
                bgcolor: alpha("#fff", 0.12),
                backdropFilter: "blur(8px)",
                border: "1px solid",
                borderColor: alpha("#fff", 0.2),
                "&:hover": { bgcolor: alpha("#ef4444", 0.7) },
                transition: "all 0.2s",
              }}
            >
              <CloseIcon />
            </IconButton>

            {/* Prev */}
            <IconButton
              onClick={(e) => { e.stopPropagation(); goPrev() }}
              sx={{
                position: "fixed",
                left: { xs: 8, md: 28 },
                zIndex: 10001,
                color: "white",
                bgcolor: alpha("#fff", 0.12),
                backdropFilter: "blur(10px)",
                border: "1px solid",
                borderColor: alpha("#fff", 0.2),
                width: { xs: 44, md: 56 },
                height: { xs: 44, md: 56 },
                "&:hover": { bgcolor: alpha("#ec4899", 0.75) },
                transition: "all 0.25s",
              }}
            >
              <PrevIcon />
            </IconButton>

            {/* Image */}
            <AnimatePresence mode="wait">
              <motion.div
                key={filtered[lightboxIndex].src}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 1.05 }}
                transition={{ duration: 0.35 }}
                onClick={(e) => e.stopPropagation()}
                style={{
                  position: "relative",
                  width: "min(90vw, 860px)",
                  height: "min(80vh, 600px)",
                  borderRadius: 16,
                  overflow: "hidden",
                  boxShadow: "0 32px 80px rgba(0,0,0,0.6)",
                }}
              >
                <Image
                  src={filtered[lightboxIndex].src}
                  alt={filtered[lightboxIndex].alt}
                  fill
                  style={{ objectFit: "cover" }}
                  priority
                />
                {/* Caption bar */}
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 0,
                    left: 0,
                    right: 0,
                    background: "linear-gradient(to top, rgba(0,0,0,0.75) 0%, transparent 100%)",
                    p: { xs: 2, md: 3 },
                  }}
                >
                  <Typography variant="h6" color="white" fontWeight={700}>
                    {filtered[lightboxIndex].caption}
                  </Typography>
                  <Typography variant="caption" sx={{ color: alpha("#fff", 0.65) }}>
                    {filtered[lightboxIndex].category}
                  </Typography>
                </Box>
              </motion.div>
            </AnimatePresence>

            {/* Next */}
            <IconButton
              onClick={(e) => { e.stopPropagation(); goNext() }}
              sx={{
                position: "fixed",
                right: { xs: 8, md: 28 },
                zIndex: 10001,
                color: "white",
                bgcolor: alpha("#fff", 0.12),
                backdropFilter: "blur(10px)",
                border: "1px solid",
                borderColor: alpha("#fff", 0.2),
                width: { xs: 44, md: 56 },
                height: { xs: 44, md: 56 },
                "&:hover": { bgcolor: alpha("#ec4899", 0.75) },
                transition: "all 0.25s",
              }}
            >
              <NextIcon />
            </IconButton>

            {/* Dot strip */}
            <Box
              sx={{
                position: "fixed",
                bottom: 24,
                left: "50%",
                transform: "translateX(-50%)",
                zIndex: 10001,
                display: "flex",
                gap: 1,
                flexWrap: "wrap",
                justifyContent: "center",
                maxWidth: "80vw",
              }}
            >
              {filtered.map((_, i) => (
                <Box
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setLightboxIndex(i) }}
                  sx={{
                    width: i === lightboxIndex ? 24 : 8,
                    height: 8,
                    borderRadius: "50px",
                    bgcolor: i === lightboxIndex ? "#ec4899" : alpha("#fff", 0.35),
                    cursor: "pointer",
                    transition: "all 0.3s ease",
                    "&:hover": { bgcolor: i === lightboxIndex ? "#ec4899" : alpha("#fff", 0.65) },
                  }}
                />
              ))}
            </Box>
          </motion.div>
        )}
      </AnimatePresence>
    </Box>
  )
}
