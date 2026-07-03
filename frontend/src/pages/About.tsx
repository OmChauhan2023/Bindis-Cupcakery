import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Box,
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  alpha,
  Chip,
} from "@mui/material";
import {
  Favorite as HeartIcon,
  Spa as LeafIcon,
  EmojiEvents as TrophyIcon,
  LocalFlorist as FlowerIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material";
import { CONTACT_WHATSAPP_URL } from "@/lib/contact";

const values = [
  {
    icon: <LeafIcon sx={{ fontSize: 36, color: "#22c55e" }} />,
    title: "100% Eggless",
    description:
      "Every single product is crafted without eggs — pure vegetarian goodness for every family to enjoy without worry.",
    bg: "linear-gradient(145deg, #dcfce7, #f0fdf4)",
    border: "#86efac",
  },
  {
    icon: <HeartIcon sx={{ fontSize: 36, color: "#ec4899" }} />,
    title: "Made with Love",
    description:
      "Each dessert is handcrafted in small batches, fresh every day, using the finest natural ingredients — no preservatives ever.",
    bg: "linear-gradient(145deg, #fce7f3, #fdf2f8)",
    border: "#f9a8d4",
  },
  {
    icon: <TrophyIcon sx={{ fontSize: 36, color: "#f59e0b" }} />,
    title: "Award-Winning Taste",
    description:
      "Hundreds of happy customers and thousands of treats delivered — our flavours speak for themselves.",
    bg: "linear-gradient(145deg, #fef9c3, #fffbeb)",
    border: "#fde68a",
  },
  {
    icon: <FlowerIcon sx={{ fontSize: 36, color: "#8b5cf6" }} />,
    title: "Custom Creations",
    description:
      "Birthday cakes, festive hampers, corporate gifting, and wedding dessert tables — we bring your sweet vision to life.",
    bg: "linear-gradient(145deg, #ede9fe, #f5f3ff)",
    border: "#c4b5fd",
  },
];

const milestones = [
  { year: "2020", event: "Founded as a cloud kitchen in Surat, Gujarat" },
  { year: "2021", event: "Launched our signature Brownie Tub & Truffle collections" },
  { year: "2022", event: "Crossed 500+ happy customers and began custom cake orders" },
  { year: "2023", event: "Expanded our menu to 30+ SKUs across 6 categories" },
  { year: "2024", event: "Launched our online ordering platform" },
];

export default function AboutPage() {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#fdfaf7" }}>

      {/* ── Hero ── */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #fce7f3 0%, #f5f3ff 50%, #fce7f3 100%)",
          py: { xs: 10, md: 14 },
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Box sx={{ position: "absolute", top: -80, left: -80, width: 300, height: 300, borderRadius: "50%", background: alpha("#ec4899", 0.1), filter: "blur(60px)" }} />
        <Box sx={{ position: "absolute", bottom: -80, right: -80, width: 300, height: 300, borderRadius: "50%", background: alpha("#8b5cf6", 0.1), filter: "blur(60px)" }} />
        <Container maxWidth="md" sx={{ position: "relative", zIndex: 1 }}>
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Chip
              label="Est. 2020 · Surat, Gujarat"
              sx={{ mb: 3, fontWeight: 700, bgcolor: alpha("#ec4899", 0.1), color: "#be185d", border: "1px solid", borderColor: alpha("#ec4899", 0.25) }}
            />
            <Typography
              variant="h2"
              component="h1"
              fontWeight={900}
              sx={{
                background: "linear-gradient(135deg, #be185d, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 2,
                fontSize: { xs: "2.4rem", md: "3.5rem" },
                lineHeight: 1.15,
              }}
            >
              Baked with Passion, <br />Served with Love 🧁
            </Typography>
            <Typography
              variant="h6"
              color="text.secondary"
              sx={{ maxWidth: 560, mx: "auto", lineHeight: 1.8, fontWeight: 400 }}
            >
              We are a cozy cloud kitchen born from a love of baking and a dream to spread sweetness —
              one handcrafted treat at a time.
            </Typography>
          </motion.div>
        </Container>
      </Box>

      {/* ── Our Story ── */}
      <Container maxWidth="lg" sx={{ py: { xs: 8, md: 12 } }}>
        <Grid container spacing={8} alignItems="center">
          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Box sx={{ position: "relative" }}>
                <Box
                  sx={{
                    borderRadius: 5,
                    overflow: "hidden",
                    boxShadow: "0 24px 64px rgba(190,24,93,0.15)",
                  }}
                >
                  <img
                    src="/bakery_interior.jpg"
                    alt="Bindi's Cupcakery kitchen"
                    style={{ width: "100%", height: 420, objectFit: "cover", display: "block" }}
                  />
                </Box>
                {/* floating badge */}
                <Paper
                  elevation={0}
                  sx={{
                    position: "absolute",
                    bottom: -20,
                    right: -20,
                    px: 3,
                    py: 2,
                    borderRadius: 4,
                    background: "linear-gradient(135deg, #be185d, #7c3aed)",
                    color: "white",
                    textAlign: "center",
                    boxShadow: "0 12px 32px rgba(190,24,93,0.35)",
                  }}
                >
                  <Typography variant="h4" fontWeight={900}>5+</Typography>
                  <Typography variant="caption" fontWeight={700}>Years of Sweetness</Typography>
                </Paper>
              </Box>
            </motion.div>
          </Grid>

          <Grid item xs={12} md={6}>
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}>
              <Typography variant="overline" sx={{ color: "#be185d", fontWeight: 700, letterSpacing: 3 }}>
                Our Story
              </Typography>
              <Typography variant="h3" fontWeight={900} sx={{ mb: 3, mt: 1, lineHeight: 1.25 }}>
                Baked with Passion<br />
                <Box component="span" sx={{ color: "#be185d" }}>Since 2020</Box>
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 2.5, lineHeight: 1.9, fontSize: "1.05rem" }}>
                Welcome to Bindi's Cupcakery — a cozy cloud kitchen born from a love of baking and a
                dream to spread sweetness. Established in 2020, right in the heart of our home in Surat,
                we've been creating handcrafted cupcakes and desserts that bring joy to every bite.
              </Typography>
              <Typography color="text.secondary" sx={{ mb: 3.5, lineHeight: 1.9, fontSize: "1.05rem" }}>
                What started as a passion project has blossomed into a full-fledged artisan bakery,
                delivering smiles across Gujarat. Every truffle, brownie, and custom cake we make carries
                our promise — <strong style={{ color: "#be185d" }}>made fresh, made with love, made for you.</strong>
              </Typography>
              <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
                <Button
                  component={Link}
                  to="/products"
                  variant="contained"
                  sx={{
                    borderRadius: "50px",
                    px: 4,
                    py: 1.4,
                    fontWeight: 700,
                    background: "linear-gradient(135deg, #d97a9c, #9b7bd0)",
                    boxShadow: "0 8px 24px rgba(217,122,156,0.28)",
                  }}
                >
                  Shop Our Treats
                </Button>
                <Button
                  href={CONTACT_WHATSAPP_URL}
                  target="_blank"
                  variant="outlined"
                  startIcon={<WhatsAppIcon sx={{ color: "#25d366" }} />}
                  sx={{ borderRadius: "50px", px: 4, py: 1.4, fontWeight: 700, borderColor: "#25d366", color: "#128c7e" }}
                >
                  WhatsApp Us
                </Button>
              </Box>
            </motion.div>
          </Grid>
        </Grid>
      </Container>

      {/* ── Values ── */}
      <Box sx={{ bgcolor: "white", py: { xs: 8, md: 12 } }}>
        <Container maxWidth="lg">
          <Box sx={{ textAlign: "center", mb: 8 }}>
            <Typography variant="overline" sx={{ color: "#be185d", fontWeight: 700, letterSpacing: 3 }}>
              What We Stand For
            </Typography>
            <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>
              Our Values
            </Typography>
          </Box>
          <Grid container spacing={3}>
            {values.map((v, i) => (
              <Grid item xs={12} sm={6} key={i}>
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      height: "100%",
                      borderRadius: 4,
                      background: v.bg,
                      border: "1px solid",
                      borderColor: v.border,
                      transition: "transform 0.25s, box-shadow 0.25s",
                      "&:hover": { transform: "translateY(-4px)", boxShadow: "0 16px 40px rgba(0,0,0,0.07)" },
                    }}
                  >
                    <Box sx={{ mb: 2 }}>{v.icon}</Box>
                    <Typography variant="h6" fontWeight={800} mb={1}>
                      {v.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ lineHeight: 1.8 }}>
                      {v.description}
                    </Typography>
                  </Paper>
                </motion.div>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* ── Timeline ── */}
      <Container maxWidth="md" sx={{ py: { xs: 8, md: 12 } }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography variant="overline" sx={{ color: "#be185d", fontWeight: 700, letterSpacing: 3 }}>
            Our Journey
          </Typography>
          <Typography variant="h3" fontWeight={900} sx={{ mt: 1 }}>
            Milestones
          </Typography>
        </Box>
        <Box sx={{ position: "relative" }}>
          {/* Vertical line */}
          <Box
            sx={{
              position: "absolute",
              left: { xs: 20, md: "50%" },
              top: 0,
              bottom: 0,
              width: 2,
              background: "linear-gradient(180deg, #ec4899, #8b5cf6)",
              transform: { md: "translateX(-50%)" },
            }}
          />
          {milestones.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
            >
              <Box
                sx={{
                  display: "flex",
                  mb: 4,
                  pl: { xs: 7, md: 0 },
                  justifyContent: { md: i % 2 === 0 ? "flex-start" : "flex-end" },
                  position: "relative",
                }}
              >
                {/* Dot */}
                <Box
                  sx={{
                    position: "absolute",
                    left: { xs: 12, md: "50%" },
                    top: 12,
                    width: 16,
                    height: 16,
                    borderRadius: "50%",
                    background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                    transform: { md: "translateX(-50%)" },
                    boxShadow: "0 0 0 4px white, 0 0 0 6px rgba(236,72,153,0.3)",
                    zIndex: 1,
                  }}
                />
                <Paper
                  elevation={0}
                  sx={{
                    px: 3,
                    py: 2,
                    borderRadius: 3,
                    border: "1px solid",
                    borderColor: "divider",
                    bgcolor: "white",
                    maxWidth: { md: "45%" },
                    boxShadow: "0 4px 20px rgba(0,0,0,0.04)",
                  }}
                >
                  <Typography
                    variant="overline"
                    sx={{ color: "#be185d", fontWeight: 800, letterSpacing: 2 }}
                  >
                    {m.year}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mt: 0.3, lineHeight: 1.7 }}>
                    {m.event}
                  </Typography>
                </Paper>
              </Box>
            </motion.div>
          ))}
        </Box>
      </Container>

      {/* ── Gallery Peek ── */}
      <Box sx={{ bgcolor: "#fce7f3", py: { xs: 6, md: 8 }, textAlign: "center" }}>
        <Container maxWidth="lg">
          <Typography variant="h4" fontWeight={900} mb={1}>
            A Peek Into Our Kitchen 📸
          </Typography>
          <Typography color="text.secondary" mb={5}>
            Fresh bakes, happy faces, and a whole lot of love.
          </Typography>
          <Grid container spacing={2}>
            {["/bakery_1.jpg", "/bakery_2.jpg", "/bakery_3.jpg", "/bakery_4.jpg", "/bakery_5.jpg", "/baking_process.jpg"].map((src, i) => (
              <Grid item xs={6} sm={4} md={2} key={i}>
                <Box
                  sx={{
                    borderRadius: 3,
                    overflow: "hidden",
                    height: 140,
                    transition: "transform 0.3s",
                    "&:hover": { transform: "scale(1.04)" },
                  }}
                >
                  <img src={src} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>
              </Grid>
            ))}
          </Grid>
          <Button
            component={Link}
            to="/gallery"
            variant="outlined"
            sx={{
              mt: 4,
              borderRadius: "50px",
              px: 5,
              py: 1.4,
              fontWeight: 700,
              borderColor: "#be185d",
              color: "#be185d",
              "&:hover": { bgcolor: alpha("#be185d", 0.05) },
            }}
          >
            View Full Gallery
          </Button>
        </Container>
      </Box>

      {/* ── CTA ── */}
      <Box
        sx={{
          background: "linear-gradient(135deg, #be185d, #7c3aed)",
          py: { xs: 8, md: 10 },
          textAlign: "center",
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="h3" fontWeight={900} color="white" mb={2}>
            Ready to Order? 🎂
          </Typography>
          <Typography color={alpha("#fff", 0.8)} mb={4} sx={{ lineHeight: 1.8 }}>
            Browse our full menu or chat with us directly on WhatsApp for custom orders.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              component={Link}
              to="/products"
              variant="contained"
              size="large"
              sx={{
                borderRadius: "50px",
                px: 5,
                py: 1.6,
                fontWeight: 700,
                bgcolor: "white",
                color: "#be185d",
                "&:hover": { bgcolor: alpha("#fff", 0.9) },
              }}
            >
              Browse Menu
            </Button>
            <Button
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              variant="contained"
              size="large"
              startIcon={<WhatsAppIcon />}
              sx={{
                borderRadius: "50px",
                px: 5,
                py: 1.6,
                fontWeight: 700,
                bgcolor: "#25d366",
                "&:hover": { bgcolor: "#128c7e" },
              }}
            >
              WhatsApp Us
            </Button>
          </Box>
        </Container>
      </Box>
    </Box>
  );
}
