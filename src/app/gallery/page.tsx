"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"

import {
  Box,
  IconButton,
  Typography,
  alpha,
  Chip,
} from "@mui/material"
import {
  ArrowBackIos as PrevIcon,
  ArrowForwardIos as NextIcon,
} from "@mui/icons-material"

const galleryImages = [
  { src: "/bakery_interior.jpg", alt: "Bakery Interior", caption: "Our Cozy Kitchen" },
  { src: "/cupcake.jpg", alt: "Cupcake Display", caption: "Fresh Cupcakes" },
  { src: "/cake_decoration.jpg", alt: "Cake Decorating", caption: "The Art of Decoration" },
  { src: "/happy_customers.jpg", alt: "Happy Customers", caption: "Happy Customers" },
  { src: "/special_occasion.jpg", alt: "Special Occasion Cakes", caption: "Special Occasions" },
  { src: "/baking_process.jpg", alt: "Baking Process", caption: "Baked with Love" },
]

export default function GalleryPage() {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % galleryImages.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const prev = () => setIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1))
  const next = () => setIndex((prev) => (prev + 1) % galleryImages.length)

  return (
    <Box
      sx={{
        position: "relative",
        width: "100vw",
        height: "100vh",
        bgcolor: "#0a0a0a",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={galleryImages[index].src}
          initial={{ opacity: 0, scale: 1.08 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ position: "absolute", inset: 0 }}
        >
          <Image
            src={galleryImages[index].src}
            alt={galleryImages[index].alt}
            fill
            style={{ objectFit: "cover" }}
            priority
          />
          {/* Gradient overlay */}
          <Box
            sx={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.3) 100%)",
            }}
          />
        </motion.div>
      </AnimatePresence>

      {/* Caption */}
      <Box
        sx={{
          position: "absolute",
          bottom: 60,
          left: "50%",
          transform: "translateX(-50%)",
          textAlign: "center",
          zIndex: 10,
        }}
      >
        <motion.div
          key={`caption-${index}`}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Typography variant="h4" fontWeight={700} color="white" sx={{ textShadow: "0 2px 20px rgba(0,0,0,0.5)" }}>
            {galleryImages[index].caption}
          </Typography>
        </motion.div>

        {/* Dots */}
        <Box sx={{ display: "flex", gap: 1.5, justifyContent: "center", mt: 2 }}>
          {galleryImages.map((_, i) => (
            <Box
              key={i}
              onClick={() => setIndex(i)}
              sx={{
                width: i === index ? 28 : 10,
                height: 10,
                borderRadius: "50px",
                bgcolor: i === index ? "primary.main" : alpha("#fff", 0.4),
                cursor: "pointer",
                transition: "all 0.3s ease",
                "&:hover": { bgcolor: i === index ? "primary.main" : alpha("#fff", 0.7) },
              }}
            />
          ))}
        </Box>
      </Box>

      {/* Navigation Buttons */}
      <IconButton
        onClick={prev}
        sx={{
          position: "absolute",
          left: { xs: 12, md: 32 },
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: alpha("#fff", 0.15),
          backdropFilter: "blur(8px)",
          color: "white",
          border: "1px solid",
          borderColor: alpha("#fff", 0.2),
          width: 56,
          height: 56,
          zIndex: 10,
          "&:hover": {
            bgcolor: alpha("#ec4899", 0.8),
            transform: "translateY(-50%) scale(1.05)",
          },
          transition: "all 0.3s",
        }}
      >
        <PrevIcon />
      </IconButton>
      <IconButton
        onClick={next}
        sx={{
          position: "absolute",
          right: { xs: 12, md: 32 },
          top: "50%",
          transform: "translateY(-50%)",
          bgcolor: alpha("#fff", 0.15),
          backdropFilter: "blur(8px)",
          color: "white",
          border: "1px solid",
          borderColor: alpha("#fff", 0.2),
          width: 56,
          height: 56,
          zIndex: 10,
          "&:hover": {
            bgcolor: alpha("#ec4899", 0.8),
            transform: "translateY(-50%) scale(1.05)",
          },
          transition: "all 0.3s",
        }}
      >
        <NextIcon />
      </IconButton>

      {/* Counter Badge */}
      <Chip
        label={`${index + 1} / ${galleryImages.length}`}
        sx={{
          position: "absolute",
          top: 24,
          right: 24,
          bgcolor: alpha("#000", 0.5),
          color: "white",
          backdropFilter: "blur(8px)",
          border: "1px solid",
          borderColor: alpha("#fff", 0.2),
          fontWeight: 700,
          zIndex: 10,
        }}
      />
    </Box>
  )
}
