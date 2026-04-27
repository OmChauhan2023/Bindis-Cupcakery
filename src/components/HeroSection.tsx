"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Box, Typography, Button, Container, alpha, Chip } from "@mui/material";
import {
  WhatsApp as WhatsAppIcon,
  ArrowForward as ArrowForwardIcon,
  KeyboardArrowDown as ScrollIcon,
} from "@mui/icons-material";

const slides = [
  {
    src: "/bakery_1.jpg",
    headline: "Eggless & Homemade",
    sub: "Crafted with love, free from preservatives",
  },
  {
    src: "/bakery_2.jpg",
    headline: "Freshly Baked Daily",
    sub: "Cupcakes, brownies & ice creams made fresh",
  },
  {
    src: "/bakery_3.jpg",
    headline: "Made with Pure Love",
    sub: "100% vegetarian — for every sweet occasion",
  },
  {
    src: "/bakery_4.jpg",
    headline: "Indulge in Every Bite",
    sub: "Premium ingredients, unforgettable flavours",
  },
  {
    src: "/bakery_5.jpg",
    headline: "Your Sweet Escape",
    sub: "Discover Surat's favourite homemade bakery",
  },
];

export default function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [textKey, setTextKey] = useState(0);

  useEffect(() => {
    const id = setInterval(() => {
      setCurrent((p) => (p + 1) % slides.length);
      setTextKey((k) => k + 1);
    }, 5000);
    return () => clearInterval(id);
  }, []);

  return (
    <Box
      component="section"
      sx={{ position: "relative", height: "100vh", minHeight: 600, overflow: "hidden" }}
    >
      {/* Background slides */}
      {slides.map(({ src }, i) => (
        <Box
          key={src}
          sx={{
            position: "absolute",
            inset: 0,
            transition: "opacity 1.2s ease-in-out",
            opacity: i === current ? 1 : 0,
            transform: i === current ? "scale(1)" : "scale(1.04)",
            transitionProperty: "opacity, transform",
            transitionDuration: "1.2s",
          }}
        >
          <Image
            src={src}
            alt={`Bindi's bakery slide ${i + 1}`}
            fill
            style={{ objectFit: "cover" }}
            priority={i === 0}
          />
        </Box>
      ))}

      {/* Multi-layer overlay */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to top, rgba(0,0,0,0.80) 0%, rgba(0,0,0,0.35) 50%, rgba(0,0,0,0.20) 100%)",
        }}
      />
      {/* Side vignette */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(0,0,0,0.35) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.35) 100%)",
        }}
      />

      {/* Content */}
      <Container
        maxWidth="lg"
        sx={{
          position: "relative",
          zIndex: 10,
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          px: { xs: 3, md: 4 },
        }}
      >
        {/* Badge */}
        <Chip
          label="✨ Surat's #1 Eggless Bakery"
          sx={{
            mb: 3,
            bgcolor: alpha("#ec4899", 0.18),
            color: "#fce7f3",
            border: "1px solid",
            borderColor: alpha("#ec4899", 0.45),
            fontWeight: 700,
            letterSpacing: 0.5,
            backdropFilter: "blur(10px)",
            px: 1,
            fontSize: { xs: "0.75rem", md: "0.875rem" },
            animation: "fadeSlideDown 0.8s ease-out both",
            "@keyframes fadeSlideDown": {
              from: { opacity: 0, transform: "translateY(-16px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        />

        {/* Headline */}
        <Box
          key={`h-${textKey}`}
          sx={{
            animation: "fadeSlideUp 0.7s ease-out both",
            "@keyframes fadeSlideUp": {
              from: { opacity: 0, transform: "translateY(24px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography
            variant="h1"
            component="h1"
            sx={{
              fontWeight: 900,
              fontSize: { xs: "2.4rem", sm: "3.2rem", md: "4.8rem" },
              lineHeight: 1.1,
              background: "linear-gradient(135deg, #fbbf24 0%, #f472b6 50%, #c084fc 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textShadow: "none",
              mb: 2,
              letterSpacing: "-0.5px",
            }}
          >
            {slides[current].headline}
          </Typography>
        </Box>

        <Box
          key={`s-${textKey}`}
          sx={{
            animation: "fadeSlideUp 0.7s 0.15s ease-out both",
            "@keyframes fadeSlideUp": {
              from: { opacity: 0, transform: "translateY(24px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Typography
            variant="h5"
            sx={{
              color: alpha("#fff", 0.88),
              mb: 5,
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.3rem" },
              maxWidth: 560,
              mx: "auto",
              lineHeight: 1.6,
            }}
          >
            {slides[current].sub}
          </Typography>
        </Box>

        {/* CTA Buttons */}
        <Box
          sx={{
            display: "flex",
            gap: 2,
            flexWrap: "wrap",
            justifyContent: "center",
            animation: "fadeSlideUp 0.7s 0.3s ease-out both",
            "@keyframes fadeSlideUp": {
              from: { opacity: 0, transform: "translateY(24px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          <Button
            variant="contained"
            size="large"
            startIcon={<WhatsAppIcon />}
            href="https://wa.me/918849130189"
            target="_blank"
            sx={{
              bgcolor: "#25d366",
              px: { xs: 3, md: 4.5 },
              py: 1.6,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              fontWeight: 700,
              borderRadius: "50px",
              boxShadow: "0 6px 28px rgba(37,211,102,0.45)",
              "&:hover": {
                bgcolor: "#128c7e",
                boxShadow: "0 10px 36px rgba(37,211,102,0.55)",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s",
            }}
          >
            Order on WhatsApp
          </Button>

          <Button
            component={Link}
            href="/products"
            variant="outlined"
            size="large"
            endIcon={<ArrowForwardIcon />}
            sx={{
              px: { xs: 3, md: 4.5 },
              py: 1.6,
              fontSize: { xs: "0.95rem", md: "1.05rem" },
              fontWeight: 700,
              borderRadius: "50px",
              border: "2px solid",
              borderColor: alpha("#fff", 0.6),
              color: "white",
              backdropFilter: "blur(8px)",
              bgcolor: alpha("#fff", 0.08),
              "&:hover": {
                borderColor: "#f472b6",
                bgcolor: alpha("#ec4899", 0.15),
                color: "#fce7f3",
                transform: "translateY(-2px)",
              },
              transition: "all 0.3s",
            }}
          >
            Explore Menu
          </Button>
        </Box>

        {/* Slide dots */}
        <Box
          sx={{
            display: "flex",
            gap: 1.5,
            mt: 6,
            animation: "fadeSlideUp 0.7s 0.45s ease-out both",
            "@keyframes fadeSlideUp": {
              from: { opacity: 0, transform: "translateY(24px)" },
              to: { opacity: 1, transform: "translateY(0)" },
            },
          }}
        >
          {slides.map((_, i) => (
            <Box
              key={i}
              onClick={() => { setCurrent(i); setTextKey((k) => k + 1); }}
              sx={{
                width: i === current ? 32 : 10,
                height: 10,
                borderRadius: "50px",
                bgcolor: i === current ? "#ec4899" : alpha("#fff", 0.45),
                cursor: "pointer",
                transition: "all 0.35s ease",
                "&:hover": { bgcolor: i === current ? "#ec4899" : alpha("#fff", 0.75) },
              }}
            />
          ))}
        </Box>
      </Container>

      {/* Scroll cue */}
      <Box
        sx={{
          position: "absolute",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 0.5,
          animation: "bounce 2.2s infinite",
          "@keyframes bounce": {
            "0%, 100%": { transform: "translate(-50%, 0)" },
            "50%": { transform: "translate(-50%, 8px)" },
          },
        }}
      >
        <Typography variant="caption" sx={{ color: alpha("#fff", 0.55), letterSpacing: 2, fontSize: "0.65rem" }}>
          SCROLL
        </Typography>
        <ScrollIcon sx={{ color: alpha("#fff", 0.55), fontSize: 20 }} />
      </Box>
    </Box>
  );
}
