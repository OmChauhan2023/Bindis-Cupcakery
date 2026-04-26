"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Box, Typography, Button, Container, alpha } from "@mui/material";
import { WhatsApp as WhatsAppIcon } from "@mui/icons-material";

const images = [
  "/bakery_1.jpg",
  "/bakery_2.jpg",
  "/bakery_3.jpg",
  "/bakery_4.jpg",
  "/bakery_5.jpg",
];

export default function HeroSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  return (
    <Box component="section" sx={{ relative: "relative", height: "100vh", overflow: "hidden" }}>
      {/* Background Image Carousel */}
      {images.map((src, index) => (
        <Box
          key={src}
          sx={{
            position: "absolute",
            inset: 0,
            transition: "opacity 1s ease-in-out",
            opacity: index === currentImageIndex ? 1 : 0,
          }}
        >
          <Image
            src={src}
            alt={`Bakery Background ${index + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority={index === 0}
          />
        </Box>
      ))}

      {/* Overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          bgcolor: alpha("#000", 0.5),
        }}
      />

      {/* Content */}
      <Container
        maxWidth="md"
        sx={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          color: "white",
        }}
      >
        <Typography
          variant="h2"
          component="h1"
          sx={{
            fontWeight: 800,
            background: "linear-gradient(45deg, #fbbf24 30%, #ef4444 60%, #ec4899 90%)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            mb: 2,
            fontSize: { xs: "2.5rem", md: "4rem" },
            animation: "fadeIn 1s ease-out",
            "@keyframes fadeIn": {
              from: { opacity: 0 },
              to: { opacity: 1 },
            },
          }}
        >
          Eggless, Homemade & Delicious!
        </Typography>
        <Typography
          variant="h5"
          sx={{
            color: "primary.light",
            mb: 4,
            fontWeight: 500,
            animation: "slideUp 1s ease-out",
            "@keyframes slideUp": {
              from: { transform: "translateY(20px)", opacity: 0 },
              to: { transform: "translateY(0)", opacity: 1 },
            },
          }}
        >
          Freshly baked cupcakes, brownies, and ice creams made with love ❤️
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<WhatsAppIcon />}
          href="https://wa.me/918849130189"
          sx={{
            bgcolor: "#25d366", // WhatsApp Green
            px: 4,
            py: 1.5,
            fontSize: "1.1rem",
            fontWeight: 600,
            "&:hover": {
              bgcolor: "#128c7e",
            },
            borderRadius: "50px",
            boxShadow: "0 4px 14px 0 rgba(37, 211, 102, 0.39)",
          }}
        >
          Order on WhatsApp
        </Button>
      </Container>
    </Box>
  );
}
