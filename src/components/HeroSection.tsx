"use client";

import Image from "next/image";
import Link from "next/link";
import { Box, Typography, Button, Container, alpha, Chip, Grid } from "@mui/material";
import {
  WhatsApp as WhatsAppIcon,
  ArrowForward as ArrowForwardIcon,
  Star as StarIcon,
} from "@mui/icons-material";

export default function HeroSection() {
  return (
    <Box
      component="section"
      sx={{
        position: "relative",
        minHeight: { xs: "auto", md: "100vh" },
        pt: { xs: 14, md: 0 },
        pb: { xs: 8, md: 0 },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        background: "radial-gradient(circle at 100% 0%, #fdf2f8 0%, #fff0f6 50%, #fce7f3 100%)",
      }}
    >
      {/* Decorative blobs */}
      <Box sx={{ position: "absolute", top: -150, right: -50, width: 400, height: 400, borderRadius: "50%", background: alpha("#f472b6", 0.15), filter: "blur(60px)" }} />
      <Box sx={{ position: "absolute", bottom: -150, left: -100, width: 400, height: 400, borderRadius: "50%", background: alpha("#fbbf24", 0.15), filter: "blur(60px)" }} />

      <Container maxWidth="lg" sx={{ position: "relative", zIndex: 2 }}>
        <Grid container spacing={{ xs: 6, md: 4 }} alignItems="center">
          
          {/* Left Content */}
          <Grid item xs={12} md={6}>
            <Box sx={{ pr: { md: 4 }, textAlign: { xs: "center", md: "left" } }}>
              <Chip
                label="✨ Surat's #1 Eggless Bakery"
                sx={{
                  mb: 3,
                  bgcolor: alpha("#ec4899", 0.1),
                  color: "#be185d",
                  border: "1px solid",
                  borderColor: alpha("#ec4899", 0.3),
                  fontWeight: 700,
                  letterSpacing: 0.5,
                  px: 1,
                  fontSize: { xs: "0.75rem", md: "0.875rem" },
                  animation: "fadeInUp 0.8s ease-out both",
                }}
              />

              <Typography
                variant="h1"
                sx={{
                  fontWeight: 900,
                  fontSize: { xs: "2.8rem", sm: "3.5rem", md: "4.2rem", lg: "5rem" },
                  lineHeight: 1.1,
                  color: "#1e293b",
                  mb: 2.5,
                  letterSpacing: "-1px",
                  animation: "fadeInUp 0.8s 0.15s ease-out both",
                  "@keyframes fadeInUp": {
                    from: { opacity: 0, transform: "translateY(20px)" },
                    to: { opacity: 1, transform: "translateY(0)" }
                  }
                }}
              >
                Baked Fresh. <br />
                <Box component="span" sx={{
                  background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}>
                  Made with Love.
                </Box>
              </Typography>

              <Typography
                variant="h6"
                sx={{
                  color: "#64748b",
                  mb: 4,
                  fontWeight: 400,
                  fontSize: { xs: "1.1rem", md: "1.2rem" },
                  lineHeight: 1.6,
                  maxWidth: { xs: "100%", md: "90%" },
                  animation: "fadeInUp 0.8s 0.3s ease-out both",
                }}
              >
                Indulge in our 100% vegetarian, eggless desserts crafted daily with premium ingredients and no preservatives.
              </Typography>

              <Box
                sx={{
                  display: "flex",
                  gap: 2,
                  flexWrap: "wrap",
                  justifyContent: { xs: "center", md: "flex-start" },
                  animation: "fadeInUp 0.8s 0.45s ease-out both",
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
                    px: { xs: 3, md: 4 },
                    py: 1.6,
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    borderRadius: "50px",
                    boxShadow: "0 8px 24px rgba(37,211,102,0.35)",
                    "&:hover": {
                      bgcolor: "#128c7e",
                      boxShadow: "0 12px 32px rgba(37,211,102,0.45)",
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
                    px: { xs: 3, md: 4 },
                    py: 1.6,
                    fontSize: "1.05rem",
                    fontWeight: 700,
                    borderRadius: "50px",
                    border: "2px solid",
                    borderColor: "#ec4899",
                    color: "#ec4899",
                    "&:hover": {
                      borderColor: "#be185d",
                      bgcolor: alpha("#ec4899", 0.05),
                      color: "#be185d",
                      transform: "translateY(-2px)",
                    },
                    transition: "all 0.3s",
                  }}
                >
                  Explore Menu
                </Button>
              </Box>
              
              {/* Trust markers */}
              <Box sx={{ mt: 5, display: "flex", alignItems: "center", gap: 2, justifyContent: { xs: "center", md: "flex-start" }, animation: "fadeInUp 0.8s 0.6s ease-out both" }}>
                <Box sx={{ display: "flex", mr: 1 }}>
                   {[1, 2, 3, 4, 5].map((s) => <StarIcon key={s} sx={{ color: "#fbbf24", fontSize: 22 }} />)}
                </Box>
                <Typography variant="body2" sx={{ fontWeight: 600, color: "#475569" }}>
                  500+ Happy Customers
                </Typography>
              </Box>

            </Box>
          </Grid>

          {/* Right Content - Hero Image */}
          <Grid item xs={12} md={6}>
             <Box sx={{ position: "relative", height: { xs: 400, md: 600 }, width: "100%", display: "flex", justifyContent: "center", alignItems: "center", animation: "fadeInUp 0.8s 0.3s ease-out both" }}>
                {/* Decorative background behind image */}
                <Box sx={{ 
                  position: "absolute", 
                  width: "80%", 
                  height: "90%", 
                  background: "linear-gradient(135deg, #fce7f3 0%, #f3e8ff 100%)", 
                  borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%",
                  animation: "morph 8s ease-in-out infinite",
                  "@keyframes morph": {
                    "0%": { borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" },
                    "50%": { borderRadius: "70% 30% 30% 70% / 70% 70% 30% 30%" },
                    "100%": { borderRadius: "30% 70% 70% 30% / 30% 30% 70% 70%" }
                  }
                }} />
                
                {/* Main Image in an Arch/Pill */}
                <Box sx={{ 
                  position: "relative", 
                  width: "75%", 
                  height: "85%", 
                  borderRadius: "200px 200px 24px 24px",
                  overflow: "hidden",
                  boxShadow: "0 24px 60px rgba(236, 72, 153, 0.2)",
                  border: "8px solid white"
                }}>
                  <Image src="/bakery_1.jpg" alt="Bindi's Cupcakery Delicious Desserts" fill style={{ objectFit: "cover" }} priority />
                </Box>

                {/* Floating Element 1 */}
                <Box sx={{ 
                  position: "absolute", 
                  bottom: "10%", 
                  left: "-5%", 
                  bgcolor: "white", 
                  p: 2, 
                  borderRadius: 4, 
                  boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
                  display: "flex",
                  alignItems: "center",
                  gap: 1.5,
                  animation: "float 6s ease-in-out infinite",
                  "@keyframes float": {
                    "0%": { transform: "translateY(0px)" },
                    "50%": { transform: "translateY(-15px)" },
                    "100%": { transform: "translateY(0px)" }
                  }
                }}>
                  <Box sx={{ width: 48, height: 48, borderRadius: "50%", position: "relative", overflow: "hidden" }}>
                    <Image src="/Rasmalai_Truffle.jpg" alt="Rasmalai Truffle" fill style={{ objectFit: "cover" }} />
                  </Box>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#ec4899", fontWeight: 700, letterSpacing: 0.5 }}>NEW ARRIVAL</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 800, color: "#1e293b" }}>Rasmalai Truffle</Typography>
                  </Box>
                </Box>

                {/* Floating Element 2 */}
                <Box sx={{ 
                  position: "absolute", 
                  top: "15%", 
                  right: "-5%", 
                  bgcolor: "white", 
                  p: 1.5, 
                  borderRadius: 4, 
                  boxShadow: "0 12px 32px rgba(0,0,0,0.1)",
                  animation: "float 7s ease-in-out infinite reverse"
                }}>
                  <Typography sx={{ fontSize: "1.8rem", lineHeight: 1 }}>🧁</Typography>
                </Box>

             </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
