"use client";

import Image from "next/image";
import Link from "next/link";
import HeroSection from "../components/HeroSection";
import {
  Box,
  Container,
  Typography,
  Grid,
  Card,
  
  CardContent,
  Button,
  Chip,
  alpha,
} from "@mui/material";
import {
  Spa as LeafIcon,
  Icecream as IceCreamIcon,
  Cake as CakeIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
} from "@mui/icons-material";

const features = [
  {
    icon: <LeafIcon sx={{ fontSize: 56, color: "#22c55e" }} />,
    title: "100% Vegetarian",
    text: "All our products are made with pure vegetarian, eggless ingredients.",
    bgGradient: "linear-gradient(135deg, #dcfce7 0%, #f0fdf4 100%)",
    borderColor: "#86efac",
  },
  {
    icon: <IceCreamIcon sx={{ fontSize: 56, color: "#3b82f6" }} />,
    title: "Delicious Variety",
    text: "Cupcakes, brownies, cakes & ice creams – indulge in our wide range!",
    bgGradient: "linear-gradient(135deg, #dbeafe 0%, #eff6ff 100%)",
    borderColor: "#93c5fd",
  },
  {
    icon: <CakeIcon sx={{ fontSize: 56, color: "#ec4899" }} />,
    title: "Homemade with Love",
    text: "Baked fresh using natural, high-quality ingredients.",
    bgGradient: "linear-gradient(135deg, #fce7f3 0%, #fdf2f8 100%)",
    borderColor: "#f9a8d4",
  },
];

const creations = [
  { name: "Brownie Tub", image: "/Brownie_tub.jpg", tag: "Best Seller" },
  { name: "Rasmalai Truffle", image: "/Rasmalai_Truffle.jpg", tag: "New" },
  { name: "Jim Jam Cookie", image: "/Jim_Jam_Cookies.jpg", tag: "Popular" },
  { name: "Blueberry Truffle", image: "/Blueberry_Truffle.jpg", tag: "Premium" },
];

const testimonials = [
  { name: "Hrithik", text: "The cupcakes were absolutely divine! Every bite was a piece of heaven.", rating: 5 },
  { name: "Abhishek", text: "Best eggless bakery in Surat. My family absolutely loves the ice creams!", rating: 5 },
  { name: "Kshitij", text: "Made my daughter's birthday unforgettable. The cake was perfection!", rating: 5 },
];

export default function Home() {
  return (
    <Box>
      {/* Hero */}
      <HeroSection />

      {/* Welcome Banner */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #fce7f3 0%, #f5f3ff 100%)",
          py: 10,
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            top: -80,
            left: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: alpha("#ec4899", 0.1),
            filter: "blur(60px)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            right: -80,
            width: 300,
            height: 300,
            borderRadius: "50%",
            background: alpha("#8b5cf6", 0.1),
            filter: "blur(60px)",
          }}
        />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="overline"
            sx={{ color: "primary.main", letterSpacing: 4, fontWeight: 700 }}
          >
            ✨ Welcome to our little paradise
          </Typography>
          <Typography
            variant="h2"
            component="h1"
            sx={{
              fontWeight: 800,
              mt: 1,
              mb: 2,
              background: "linear-gradient(135deg, #be185d, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Bindi&apos;s Cupcakery
          </Typography>
          <Typography variant="h6" color="text.secondary" sx={{ maxWidth: 600, mx: "auto", lineHeight: 1.8 }}>
            Delicious, homemade, and preservative-free desserts crafted with love in every bite.
          </Typography>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" textAlign="center" fontWeight={700} mb={6} color="text.primary">
          Why Choose Us?
        </Typography>
        <Grid container spacing={4}>
          {features.map(({ icon, title, text, bgGradient, borderColor }, index) => (
            <Grid item xs={12} md={4} key={index}>
              <Box
                sx={{
                  background: bgGradient,
                  border: `1px solid ${borderColor}`,
                  borderRadius: 4,
                  p: 5,
                  textAlign: "center",
                  height: "100%",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    transform: "translateY(-8px)",
                    boxShadow: `0 20px 60px ${alpha(borderColor, 0.4)}`,
                  },
                }}
              >
                <Box sx={{ mb: 2 }}>{icon}</Box>
                <Typography variant="h6" fontWeight={700} mb={1}>
                  {title}
                </Typography>
                <Typography variant="body2" color="text.secondary" lineHeight={1.8}>
                  {text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Creations Section */}
      <Box sx={{ bgcolor: alpha("#fce7f3", 0.4), py: 10 }}>
        <Container maxWidth="lg">
          <Box textAlign="center" mb={6}>
            <Typography
              variant="h3"
              fontWeight={800}
              sx={{
                background: "linear-gradient(135deg, #be185d, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Our Delicious Creations 🍰
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1}>
              Handcrafted with the finest ingredients
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {creations.map(({ name, image, tag }, i) => (
              <Grid item xs={12} sm={6} md={3} key={i}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                    transition: "all 0.4s ease",
                    "&:hover": {
                      transform: "translateY(-8px) scale(1.02)",
                      boxShadow: "0 20px 60px rgba(236,72,153,0.2)",
                      "& .creation-overlay": { opacity: 1 },
                      "& .creation-img": { transform: "scale(1.1)" },
                    },
                  }}
                >
                  <Box sx={{ position: "relative", height: 220, overflow: "hidden" }}>
                    <Box
                      className="creation-img"
                      sx={{ transition: "transform 0.5s ease", height: "100%", position: "relative" }}
                    >
                      <Image src={image} alt={name} fill style={{ objectFit: "cover" }} />
                    </Box>
                    <Box
                      className="creation-overlay"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        bgcolor: alpha("#000", 0.45),
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        opacity: 0,
                        transition: "opacity 0.3s",
                      }}
                    >
                      <Typography variant="h6" color="white" fontWeight={700}>
                        {name}
                      </Typography>
                    </Box>
                    <Chip
                      label={tag}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 12,
                        right: 12,
                        bgcolor: "primary.main",
                        color: "white",
                        fontWeight: 700,
                        fontSize: "0.7rem",
                      }}
                    />
                  </Box>
                  <CardContent sx={{ py: 2 }}>
                    <Typography variant="subtitle1" fontWeight={600} textAlign="center">
                      {name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={6}>
            <Button
              component={Link}
              href="/products"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: 6,
                py: 1.8,
                borderRadius: "50px",
                fontSize: "1.05rem",
                fontWeight: 700,
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                boxShadow: "0 8px 30px rgba(236,72,153,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #be185d, #7c3aed)",
                  boxShadow: "0 12px 40px rgba(236,72,153,0.45)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s",
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Testimonials */}
      <Container maxWidth="lg" sx={{ py: 10 }}>
        <Typography variant="h4" textAlign="center" fontWeight={700} mb={6}>
          What Our Customers Say 💬
        </Typography>
        <Grid container spacing={4}>
          {testimonials.map(({ name, text, rating }, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box
                sx={{
                  p: 4,
                  borderRadius: 4,
                  border: "1px solid",
                  borderColor: alpha("#ec4899", 0.2),
                  background: "white",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
                  height: "100%",
                  transition: "all 0.3s",
                  "&:hover": {
                    boxShadow: "0 12px 40px rgba(236,72,153,0.15)",
                    transform: "translateY(-4px)",
                  },
                }}
              >
                <Box sx={{ display: "flex", mb: 2 }}>
                  {[...Array(rating)].map((_, j) => (
                    <StarIcon key={j} sx={{ color: "#fbbf24", fontSize: 20 }} />
                  ))}
                </Box>
                <Typography variant="body1" color="text.secondary" lineHeight={1.8} mb={3} fontStyle="italic">
                  &quot;{text}&quot;
                </Typography>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontWeight: 700,
                      fontSize: "1rem",
                    }}
                  >
                    {name[0]}
                  </Box>
                  <Typography fontWeight={600}>{name}</Typography>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
