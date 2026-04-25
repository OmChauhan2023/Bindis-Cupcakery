"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { motion, AnimatePresence } from "framer-motion"
<<<<<<< HEAD
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
=======

const galleryImages = [
  { src: "/bakery_interior.jpg", alt: "Bakery Interior" },
  { src: "/cupcake.jpg", alt: "Cupcake Display" },
  { src: "/cake_decoration.jpg", alt: "Cake Decorating" },
  { src: "/happy_customers.jpg", alt: "Happy Customers" },
  { src: "/special_occasion.jpg", alt: "Special Occasion Cakes" },
  { src: "/baking_process.jpg", alt: "Baking Process" },
]

export default function SmoothSidewaysGallery() {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState(0)

  // Set image change interval to 1 second (1000ms)
  useEffect(() => {
    const interval = setInterval(() => {
      navigate(1)
    }, 2000)  // Change the time interval to 2 second
    return () => clearInterval(interval)
  }, [])

  const navigate = (newDirection: number) => {
    setDirection(newDirection)
    setIndex((prevIndex) => {
      if (newDirection === 1) {
        return (prevIndex + 1) % galleryImages.length
      }
      return prevIndex === 0 ? galleryImages.length - 1 : prevIndex - 1
    })
  }

  const variants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
      rotateY: direction > 0 ? 45 : -45,
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      rotateY: 0,
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 1000 : -1000,
      opacity: 0,
      scale: 0.5,
      rotateY: direction < 0 ? 45 : -45,
    }),
  }

  return (
    <div className="relative w-screen h-screen bg-pink-50 overflow-hidden">
      {/* Image Slider */}
      <div className="relative w-full h-full">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={index}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 100, damping: 20, duration: 1 },  // Set transition duration to 1 second
              opacity: { duration: 1 },  // Set transition duration to 1 second
              scale: { duration: 1 },  // Set transition duration to 1 second
              rotateY: { duration: 1 },  // Set transition duration to 1 second
            }}
            className="absolute inset-0 w-full h-full flex items-center justify-center"
          >
            <Image
              src={galleryImages[index].src || "/placeholder.svg"}
              alt={galleryImages[index].alt}
              width={1920}
              height={1080}
              className="max-w-full max-h-full object-contain"
              priority
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navigation Controls */}
      <button
        onClick={() => navigate(-1)}
        className="absolute left-5 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 text-gray-800 p-4 rounded-full shadow-lg hover:bg-opacity-75 transition-all duration-300 z-20"
      >
        ◀
      </button>
      <button
        onClick={() => navigate(1)}
        className="absolute right-5 top-1/2 -translate-y-1/2 bg-white bg-opacity-50 text-gray-800 p-4 rounded-full shadow-lg hover:bg-opacity-75 transition-all duration-300 z-20"
      >
        ▶
      </button>

      {/* Image counter */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 bg-white bg-opacity-50 text-gray-800 px-4 py-2 rounded-full z-20">
        {index + 1} / {galleryImages.length}
      </div>
    </div>
  )
}
>>>>>>> a5952e490eec4534302ae02da739bc78b511b478
