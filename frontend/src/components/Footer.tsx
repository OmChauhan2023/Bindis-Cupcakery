import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link as MuiLink,
  useTheme,
  alpha,
  Divider,
} from "@mui/material";
import {
  Facebook,
  Instagram,
  Mail,
  LocationOn as MapPin,
  Phone,
  WhatsApp,
  Favorite as HeartIcon,
} from "@mui/icons-material";
import { Link } from "react-router-dom";
import { CONTACT_PHONE_DISPLAY, CONTACT_PHONE_TEL, CONTACT_WHATSAPP_URL } from "@/lib/contact";

export function Footer() {
  const theme = useTheme();
  const waQrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=140x140&data=${encodeURIComponent(CONTACT_WHATSAPP_URL)}&color=128c7e&bgcolor=ffffff&margin=10`;

  return (
    <Box
      component="footer"
      sx={{
        pt: 8,
        pb: 4,
        background: `linear-gradient(135deg, #fce7f3 0%, #f5f3ff 100%)`,
        borderTop: `2px solid ${alpha("#ec4899", 0.15)}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={5}>
          {/* Brand Column */}
          <Grid item xs={12} md={3}>
            <Typography
              variant="h5"
              fontWeight={900}
              sx={{
                background: "linear-gradient(135deg, #be185d, #7c3aed)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
              }}
            >
              Bindi's Cupcakery
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "#be185d", fontStyle: "italic", fontWeight: 600, mb: 2 }}
            >
              Experience Bliss in Every Bite!
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 2.5 }}>
              We're known for our delicious eggless, vegetarian treats — from custom cakes and
              cupcakes to brownies and more. The perfect treat for every occasion.
            </Typography>
            <Box sx={{ display: "flex", gap: 1 }}>
              <IconButton
                component="a"
                href="https://instagram.com/bindis_cupcakery"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: "#be185d",
                  bgcolor: alpha("#ec4899", 0.1),
                  "&:hover": { bgcolor: alpha("#ec4899", 0.2), transform: "scale(1.1)" },
                  transition: "all 0.3s",
                }}
              >
                <Instagram fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href="https://facebook.com/bindis_cupcakery"
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: "#be185d",
                  bgcolor: alpha("#ec4899", 0.1),
                  "&:hover": { bgcolor: alpha("#ec4899", 0.2), transform: "scale(1.1)" },
                  transition: "all 0.3s",
                }}
              >
                <Facebook fontSize="small" />
              </IconButton>
              <IconButton
                component="a"
                href={CONTACT_WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                size="small"
                sx={{
                  color: "#25d366",
                  bgcolor: alpha("#25d366", 0.1),
                  "&:hover": { bgcolor: alpha("#25d366", 0.2), transform: "scale(1.1)" },
                  transition: "all 0.3s",
                }}
              >
                <WhatsApp fontSize="small" />
              </IconButton>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={6} md={2}>
            <Typography variant="subtitle2" fontWeight={800} color="primary.dark" mb={2} sx={{ letterSpacing: 1 }}>
              OUR MENU
            </Typography>
            {["Truffles", "Brownies", "Cookies", "Cupcakes", "Donuts"].map((item) => (
              <Box key={item} mb={1}>
                <MuiLink
                  component={Link}
                  to="/products"
                  underline="none"
                  sx={{ color: "text.secondary", fontSize: "0.875rem", "&:hover": { color: "primary.main" }, transition: "color 0.2s" }}
                >
                  {item}
                </MuiLink>
              </Box>
            ))}
          </Grid>

          {/* Contact Info */}
          <Grid item xs={6} md={3}>
            <Typography variant="subtitle2" fontWeight={800} color="primary.dark" mb={2} sx={{ letterSpacing: 1 }}>
              CONTACT US
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.8 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <MapPin sx={{ color: "#be185d", fontSize: 20, mt: 0.2, flexShrink: 0 }} />
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.7 }}>
                  Parle Point, Surat,<br />Gujarat 395007
                </Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Phone sx={{ color: "#be185d", fontSize: 20, flexShrink: 0 }} />
                <MuiLink
                  href={CONTACT_PHONE_TEL}
                  color="text.secondary"
                  sx={{ fontSize: "0.875rem", textDecoration: "none", "&:hover": { color: "primary.main" } }}
                >
                  {CONTACT_PHONE_DISPLAY}
                </MuiLink>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Mail sx={{ color: "#be185d", fontSize: 20, flexShrink: 0 }} />
                <MuiLink
                  href="mailto:bindiscupcakery@gmail.com"
                  color="text.secondary"
                  sx={{ fontSize: "0.875rem", textDecoration: "none", "&:hover": { color: "primary.main" } }}
                >
                  bindiscupcakery@gmail.com
                </MuiLink>
              </Box>
            </Box>
          </Grid>

          {/* WhatsApp QR */}
          <Grid item xs={12} md={4}>
            <Typography variant="subtitle2" fontWeight={800} color="primary.dark" mb={2} sx={{ letterSpacing: 1 }}>
              STAY CONNECTED
            </Typography>
            <Box sx={{ display: "flex", gap: 3, alignItems: "flex-start" }}>
              <Box
                sx={{
                  p: 1.2,
                  bgcolor: "white",
                  borderRadius: 3,
                  boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
                  border: "1px solid",
                  borderColor: alpha("#25d366", 0.3),
                  display: "inline-flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 1,
                }}
              >
                <img
                  src={waQrUrl}
                  alt="Scan to connect on WhatsApp"
                  width={120}
                  height={120}
                  style={{ borderRadius: 8, display: "block" }}
                />
                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  <WhatsApp sx={{ color: "#25d366", fontSize: 14 }} />
                  <Typography variant="caption" sx={{ color: "#128c7e", fontWeight: 700, fontSize: "0.65rem" }}>
                    Scan to WhatsApp
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ pt: 1 }}>
                <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.8, mb: 1.5 }}>
                  Chat with us directly on WhatsApp for custom orders, bulk enquiries, and delivery details.
                </Typography>
                <MuiLink
                  href={CONTACT_WHATSAPP_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  underline="always"
                  sx={{ color: "#25d366", fontWeight: 700, fontSize: "0.875rem" }}
                >
                  Open WhatsApp →
                </MuiLink>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4, borderColor: alpha("#ec4899", 0.15) }} />

        {/* Footer Bottom */}
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: 1 }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Bindi's Cupcakery. All rights reserved.
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
            Made with <HeartIcon sx={{ color: "#ec4899", fontSize: 14 }} /> in Surat, India
          </Typography>
        </Box>
      </Container>
    </Box>
  );
}
