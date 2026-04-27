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
  Avatar,
} from "@mui/material";
import {
  Spa as LeafIcon,
  Icecream as IceCreamIcon,
  Cake as CakeIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
  FormatQuote as QuoteIcon,
  LocalFlorist as FlowerIcon,
  Favorite as HeartIcon,
  EmojiEvents as TrophyIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";

const features = [
  {
    icon: <LeafIcon sx={{ fontSize: 40, color: "#22c55e" }} />,
    emoji: "🌿",
    title: "100% Vegetarian",
    text: "All our products are made with pure vegetarian, eggless ingredients — guilt-free indulgence.",
    bgGradient: "linear-gradient(145deg, #dcfce7 0%, #f0fdf4 60%, #ecfdf5 100%)",
    borderColor: "#86efac",
    accentColor: "#22c55e",
    glowColor: "rgba(34,197,94,0.15)",
  },
  {
    icon: <IceCreamIcon sx={{ fontSize: 40, color: "#ec4899" }} />,
    emoji: "🍦",
    title: "Delicious Variety",
    text: "Cupcakes, brownies, cakes & ice creams — indulge in our ever-growing range of sweet creations.",
    bgGradient: "linear-gradient(145deg, #fce7f3 0%, #fdf2f8 60%, #fff1f6 100%)",
    borderColor: "#f9a8d4",
    accentColor: "#ec4899",
    glowColor: "rgba(236,72,153,0.15)",
  },
  {
    icon: <CakeIcon sx={{ fontSize: 40, color: "#8b5cf6" }} />,
    emoji: "🍰",
    title: "Homemade with Love",
    text: "Baked fresh every day using natural, high-quality ingredients — no preservatives, ever.",
    bgGradient: "linear-gradient(145deg, #ede9fe 0%, #f5f3ff 60%, #faf5ff 100%)",
    borderColor: "#c4b5fd",
    accentColor: "#8b5cf6",
    glowColor: "rgba(139,92,246,0.15)",
  },
];

const creations = [
  { name: "Brownie Tub", image: "/Brownie_tub.jpg", tag: "Best Seller", tagColor: "#f59e0b" },
  { name: "Rasmalai Truffle", image: "/Rasmalai_Truffle.jpg", tag: "New Arrival", tagColor: "#10b981" },
  { name: "Jim Jam Cookie", image: "/Jim_Jam_Cookies.jpg", tag: "Popular", tagColor: "#3b82f6" },
  { name: "Blueberry Truffle", image: "/Blueberry_Truffle.jpg", tag: "Premium", tagColor: "#8b5cf6" },
  { name: "Dark Choc Brownie", image: "/Dark_Chocolate_walnut_brownie.jpg", tag: "Favourite", tagColor: "#ec4899" },
  { name: "Cranberry Blondie", image: "/Cranberry_pistachio_blondie.jpg", tag: "Seasonal", tagColor: "#ef4444" },
];

const testimonials = [
  {
    name: "Hrithik",
    location: "Surat",
    text: "The cupcakes were absolutely divine! Every bite was a piece of heaven. I keep coming back for more!",
    rating: 5,
    initials: "H",
    color: "#ec4899",
  },
  {
    name: "Abhishek",
    location: "Surat",
    text: "Best eggless bakery in Surat. My entire family absolutely loves the ice creams and brownies!",
    rating: 5,
    initials: "A",
    color: "#8b5cf6",
  },
  {
    name: "Kshitij",
    location: "Surat",
    text: "Made my daughter's birthday unforgettable. The cake was absolute perfection — everyone loved it!",
    rating: 5,
    initials: "K",
    color: "#f59e0b",
  },
];

const stats = [
  { value: "500+", label: "Happy Customers", icon: <HeartIcon sx={{ fontSize: 28 }} /> },
  { value: "50+", label: "Sweet Varieties", icon: <CakeIcon sx={{ fontSize: 28 }} /> },
  { value: "100%", label: "Eggless & Pure", icon: <LeafIcon sx={{ fontSize: 28 }} /> },
  { value: "5★", label: "Rated by Foodies", icon: <TrophyIcon sx={{ fontSize: 28 }} /> },
];

export default function Home() {
  return (
    <Box>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Stats Band ── */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #be185d 0%, #7c3aed 100%)",
          py: { xs: 4, md: 5 },
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={2} justifyContent="center">
            {stats.map(({ value, label, icon }, i) => (
              <Grid item xs={6} md={3} key={i}>
                <Box
                  sx={{
                    textAlign: "center",
                    py: 1,
                    color: "white",
                    position: "relative",
                    "&::after": i < stats.length - 1 ? {
                      content: '""',
                      position: "absolute",
                      right: 0,
                      top: "20%",
                      height: "60%",
                      width: "1px",
                      bgcolor: alpha("#fff", 0.25),
                      display: { xs: "none", md: "block" },
                    } : {},
                  }}
                >
                  <Box sx={{ color: alpha("#fff", 0.75), mb: 0.5 }}>{icon}</Box>
                  <Typography
                    variant="h4"
                    fontWeight={900}
                    sx={{ fontSize: { xs: "1.8rem", md: "2.2rem" } }}
                  >
                    {value}
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: alpha("#fff", 0.8), fontSize: "0.8rem", letterSpacing: 0.5 }}
                  >
                    {label}
                  </Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Welcome Banner ── */}
      <Box
        sx={{
          background: "linear-gradient(160deg, #fff0f6 0%, #f5f3ff 50%, #fff0f6 100%)",
          py: { xs: 8, md: 12 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative blobs */}
        {[
          { top: -100, left: -100, color: "#ec4899" },
          { bottom: -100, right: -100, color: "#8b5cf6" },
        ].map(({ color, ...pos }, i) => (
          <Box
            key={i}
            sx={{
              position: "absolute",
              ...pos,
              width: 350,
              height: 350,
              borderRadius: "50%",
              background: alpha(color, 0.12),
              filter: "blur(80px)",
              pointerEvents: "none",
            }}
          />
        ))}

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Chip
            icon={<FlowerIcon sx={{ fontSize: "16px !important", color: "#be185d !important" }} />}
            label="Welcome to our sweet world"
            sx={{
              mb: 3,
              bgcolor: alpha("#ec4899", 0.1),
              border: "1px solid",
              borderColor: alpha("#ec4899", 0.3),
              color: "#be185d",
              fontWeight: 700,
              letterSpacing: 0.5,
              px: 1,
            }}
          />
          <Typography
            variant="h2"
            component="h2"
            sx={{
              fontWeight: 900,
              mt: 1,
              mb: 3,
              background: "linear-gradient(135deg, #be185d 0%, #7c3aed 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              fontSize: { xs: "2.2rem", sm: "3rem", md: "3.8rem" },
              lineHeight: 1.15,
            }}
          >
            Bindi&apos;s Cupcakery
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{
              maxWidth: 580,
              mx: "auto",
              lineHeight: 1.9,
              fontWeight: 400,
              fontSize: { xs: "1rem", md: "1.15rem" },
            }}
          >
            Delicious, homemade, and preservative-free desserts crafted with love in
            every single bite — because you deserve the very best.
          </Typography>
        </Container>
      </Box>

      {/* ── Features Section ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box textAlign="center" mb={8}>
          <Typography
            variant="overline"
            sx={{ color: "primary.main", letterSpacing: 4, fontWeight: 700 }}
          >
            Our Promise
          </Typography>
          <Typography
            variant="h3"
            fontWeight={800}
            mt={1}
            sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
          >
            Why Choose Us?
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {features.map(({ icon, emoji, title, text, bgGradient, borderColor, accentColor, glowColor }, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box
                sx={{
                  background: bgGradient,
                  border: `1.5px solid ${borderColor}`,
                  borderRadius: 5,
                  p: { xs: 4, md: 5 },
                  textAlign: "center",
                  height: "100%",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.35s cubic-bezier(0.34,1.56,0.64,1)",
                  cursor: "default",
                  "&:hover": {
                    transform: "translateY(-12px)",
                    boxShadow: `0 24px 60px ${glowColor}`,
                    borderColor: accentColor,
                  },
                }}
              >
                {/* Background watermark emoji */}
                <Typography
                  sx={{
                    position: "absolute",
                    top: -8,
                    right: 12,
                    fontSize: "5rem",
                    opacity: 0.08,
                    lineHeight: 1,
                    userSelect: "none",
                  }}
                >
                  {emoji}
                </Typography>

                <Box
                  sx={{
                    width: 76,
                    height: 76,
                    borderRadius: "24px",
                    bgcolor: alpha(accentColor, 0.12),
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 3,
                    border: `1px solid ${alpha(accentColor, 0.2)}`,
                  }}
                >
                  {icon}
                </Box>
                <Typography variant="h6" fontWeight={800} mb={1.5} sx={{ letterSpacing: "-0.3px" }}>
                  {title}
                </Typography>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  lineHeight={1.85}
                  sx={{ fontSize: "0.95rem" }}
                >
                  {text}
                </Typography>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── Creations Section ── */}
      <Box
        sx={{
          background: "linear-gradient(160deg, #fff8f0 0%, #fce7f3 40%, #f5f3ff 100%)",
          py: { xs: 8, md: 12 },
        }}
      >
        <Container maxWidth="lg">
          {/* Section header */}
          <Box textAlign="center" mb={8}>
            <Typography
              variant="overline"
              sx={{ color: "#be185d", letterSpacing: 4, fontWeight: 700 }}
            >
              Fresh From The Kitchen
            </Typography>
            <Typography
              variant="h3"
              fontWeight={900}
              mt={1}
              sx={{
                background: "linear-gradient(135deg, #be185d 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                fontSize: { xs: "1.9rem", md: "2.8rem" },
              }}
            >
              Our Delicious Creations 🍰
            </Typography>
            <Typography variant="body1" color="text.secondary" mt={1.5} sx={{ fontSize: "1.05rem" }}>
              Handcrafted daily with the finest, all-natural ingredients
            </Typography>
          </Box>

          <Grid container spacing={{ xs: 2, md: 3 }}>
            {creations.map(({ name, image, tag, tagColor }, i) => (
              <Grid item xs={6} sm={4} md={4} key={i}>
                <Card
                  sx={{
                    borderRadius: 4,
                    overflow: "hidden",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.07)",
                    bgcolor: "white",
                    transition: "all 0.4s cubic-bezier(0.34,1.56,0.64,1)",
                    cursor: "pointer",
                    "&:hover": {
                      transform: "translateY(-10px) scale(1.02)",
                      boxShadow: "0 28px 60px rgba(190,24,93,0.18)",
                      "& .card-img": { transform: "scale(1.1)" },
                      "& .card-overlay": { opacity: 1 },
                    },
                  }}
                >
                  <Box sx={{ position: "relative", height: { xs: 170, md: 230 }, overflow: "hidden" }}>
                    <Box
                      className="card-img"
                      sx={{ transition: "transform 0.6s ease", height: "100%", position: "relative" }}
                    >
                      <Image src={image} alt={name} fill style={{ objectFit: "cover" }} />
                    </Box>
                    {/* Hover overlay */}
                    <Box
                      className="card-overlay"
                      sx={{
                        position: "absolute",
                        inset: 0,
                        background:
                          "linear-gradient(to top, rgba(0,0,0,0.65) 0%, transparent 60%)",
                        opacity: 0,
                        transition: "opacity 0.4s ease",
                        display: "flex",
                        alignItems: "flex-end",
                        p: 2,
                      }}
                    >
                      <Typography variant="body2" color="white" fontWeight={600} fontSize="0.85rem">
                        Tap to order →
                      </Typography>
                    </Box>
                    {/* Tag */}
                    <Chip
                      label={tag}
                      size="small"
                      sx={{
                        position: "absolute",
                        top: 10,
                        left: 10,
                        bgcolor: tagColor,
                        color: "white",
                        fontWeight: 800,
                        fontSize: "0.68rem",
                        height: 22,
                        borderRadius: "6px",
                        boxShadow: `0 4px 12px ${alpha(tagColor, 0.4)}`,
                      }}
                    />
                  </Box>
                  <CardContent sx={{ py: 2, px: 2.5 }}>
                    <Typography
                      variant="subtitle1"
                      fontWeight={700}
                      textAlign="center"
                      sx={{ fontSize: { xs: "0.85rem", md: "0.95rem" } }}
                    >
                      {name}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>

          <Box textAlign="center" mt={8}>
            <Button
              component={Link}
              href="/products"
              variant="contained"
              size="large"
              endIcon={<ArrowForwardIcon />}
              sx={{
                px: { xs: 5, md: 7 },
                py: 2,
                borderRadius: "50px",
                fontSize: "1.05rem",
                fontWeight: 800,
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                boxShadow: "0 10px 32px rgba(236,72,153,0.35)",
                "&:hover": {
                  background: "linear-gradient(135deg, #be185d, #7c3aed)",
                  boxShadow: "0 16px 44px rgba(236,72,153,0.5)",
                  transform: "translateY(-3px)",
                },
                transition: "all 0.3s",
              }}
            >
              View All Products
            </Button>
          </Box>
        </Container>
      </Box>

      {/* ── Testimonials ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Box textAlign="center" mb={8}>
          <Typography
            variant="overline"
            sx={{ color: "primary.main", letterSpacing: 4, fontWeight: 700 }}
          >
            Customer Love
          </Typography>
          <Typography
            variant="h3"
            fontWeight={800}
            mt={1}
            sx={{ fontSize: { xs: "1.8rem", md: "2.5rem" } }}
          >
            What Our Customers Say 💬
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {testimonials.map(({ name, location, text, rating, initials, color }, i) => (
            <Grid item xs={12} md={4} key={i}>
              <Box
                sx={{
                  p: { xs: 3.5, md: 4.5 },
                  borderRadius: 5,
                  border: "1.5px solid",
                  borderColor: alpha(color, 0.2),
                  background: `linear-gradient(145deg, ${alpha(color, 0.04)} 0%, white 100%)`,
                  boxShadow: "0 4px 24px rgba(0,0,0,0.05)",
                  height: "100%",
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  overflow: "hidden",
                  transition: "all 0.35s ease",
                  "&:hover": {
                    boxShadow: `0 16px 50px ${alpha(color, 0.18)}`,
                    transform: "translateY(-6px)",
                    borderColor: alpha(color, 0.45),
                  },
                }}
              >
                {/* Big quote watermark */}
                <QuoteIcon
                  sx={{
                    position: "absolute",
                    top: 12,
                    right: 16,
                    fontSize: 64,
                    color: alpha(color, 0.1),
                  }}
                />

                {/* Stars */}
                <Box sx={{ display: "flex", gap: 0.4, mb: 2.5 }}>
                  {[...Array(rating)].map((_, j) => (
                    <StarIcon key={j} sx={{ color: "#fbbf24", fontSize: 20 }} />
                  ))}
                </Box>

                <Typography
                  variant="body1"
                  color="text.secondary"
                  lineHeight={1.85}
                  mb={3}
                  fontStyle="italic"
                  sx={{ flex: 1, fontSize: "0.97rem" }}
                >
                  &ldquo;{text}&rdquo;
                </Typography>

                <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                  <Avatar
                    sx={{
                      width: 46,
                      height: 46,
                      background: `linear-gradient(135deg, ${color}, ${alpha(color, 0.65)})`,
                      fontWeight: 800,
                      fontSize: "1.1rem",
                      boxShadow: `0 4px 14px ${alpha(color, 0.35)}`,
                    }}
                  >
                    {initials}
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700} sx={{ lineHeight: 1.2 }}>
                      {name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {location}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* ── Final CTA Banner ── */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #be185d 0%, #7c3aed 100%)",
          py: { xs: 8, md: 11 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative circles */}
        <Box
          sx={{
            position: "absolute",
            top: -60,
            left: "5%",
            width: 200,
            height: 200,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: alpha("#fff", 0.1),
            pointerEvents: "none",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            bottom: -80,
            right: "8%",
            width: 280,
            height: 280,
            borderRadius: "50%",
            border: "1px solid",
            borderColor: alpha("#fff", 0.08),
            pointerEvents: "none",
          }}
        />

        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <Typography
            variant="h6"
            sx={{ color: alpha("#fff", 0.75), letterSpacing: 2, mb: 1, fontWeight: 500 }}
          >
            🎂 Special Occasions? Custom Orders?
          </Typography>
          <Typography
            variant="h3"
            fontWeight={900}
            color="white"
            mb={2}
            sx={{ fontSize: { xs: "1.9rem", md: "2.8rem" }, lineHeight: 1.2 }}
          >
            Order Your Dream Dessert Today
          </Typography>
          <Typography
            color={alpha("#fff", 0.78)}
            mb={5}
            sx={{ fontSize: "1.05rem", maxWidth: 480, mx: "auto", lineHeight: 1.8 }}
          >
            Reach out on WhatsApp for custom cakes, bulk orders, and special occasion treats.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", justifyContent: "center" }}>
            <Button
              variant="contained"
              size="large"
              startIcon={<WhatsAppIcon />}
              href="https://wa.me/918849130189"
              target="_blank"
              sx={{
                bgcolor: "#25d366",
                px: 5,
                py: 1.8,
                fontSize: "1.05rem",
                fontWeight: 700,
                borderRadius: "50px",
                boxShadow: "0 8px 28px rgba(37,211,102,0.4)",
                "&:hover": { bgcolor: "#128c7e", transform: "translateY(-2px)" },
                transition: "all 0.3s",
              }}
            >
              Chat on WhatsApp
            </Button>
            <Button
              component={Link}
              href="/contact"
              variant="outlined"
              size="large"
              sx={{
                px: 5,
                py: 1.8,
                fontSize: "1.05rem",
                fontWeight: 700,
                borderRadius: "50px",
                border: "2px solid",
                borderColor: alpha("#fff", 0.6),
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: alpha("#fff", 0.1),
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s",
              }}
            >
              Contact Us
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
