"use client"

import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  alpha,
  Link as MuiLink,
} from "@mui/material"
import {
  LocationOn as MapPinIcon,
  Phone as PhoneIcon,
  AccessTime as ClockIcon,
  WhatsApp as WhatsAppIcon,
} from "@mui/icons-material"

const contactItems = [
  {
    icon: <MapPinIcon sx={{ fontSize: 32, color: "primary.main" }} />,
    label: "Our Location",
    value: "Parle Point, Surat, Gujarat 395007",
    href: "https://maps.google.com/?q=Parle+Point+Surat",
    bg: "linear-gradient(135deg, #fce7f3, #fdf2f8)",
    border: "rgba(236,72,153,0.2)",
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 32, color: "#8b5cf6" }} />,
    label: "Call Us",
    value: "+91 88491-30189",
    href: "tel:+918849130189",
    bg: "linear-gradient(135deg, #f5f3ff, #faf5ff)",
    border: "rgba(139,92,246,0.2)",
  },
  {
    icon: <ClockIcon sx={{ fontSize: 32, color: "#f59e0b" }} />,
    label: "Working Hours",
    value: "Daily: 11:00 AM – 8:00 PM",
    bg: "linear-gradient(135deg, #fffbeb, #fef3c7)",
    border: "rgba(245,158,11,0.2)",
  },
]

export default function Contact() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #fce7f3 0%, #fff 40%, #f5f3ff 100%)",
        pt: 8,
        pb: 12,
      }}
    >
      <Container maxWidth="md">
        {/* Header */}
        <Box textAlign="center" mb={8}>
          <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 4, fontWeight: 700 }}>
            get in touch
          </Typography>
          <Typography
            variant="h2"
            fontWeight={800}
            sx={{
              background: "linear-gradient(135deg, #be185d, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mt: 1,
              mb: 2,
            }}
          >
            Contact Us 📞
          </Typography>
          <Typography variant="body1" color="text.secondary" maxWidth={500} mx="auto" lineHeight={1.8}>
            Have a question or want to place a special order? We'd love to hear from you!
          </Typography>
        </Box>

        {/* Contact Info Cards */}
        <Grid container spacing={3} mb={5}>
          {contactItems.map(({ icon, label, value, href, bg, border }, i) => (
            <Grid item xs={12} sm={4} key={i}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 4,
                  p: 4,
                  textAlign: "center",
                  background: bg,
                  border: `1px solid ${border}`,
                  transition: "all 0.3s",
                  cursor: href ? "pointer" : "default",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: `0 20px 50px ${border}`,
                  },
                }}
                component={href ? "a" : "div"}
                href={href}
                target={href?.startsWith("http") ? "_blank" : undefined}
              >
                <Box mb={1.5}>{icon}</Box>
                <Typography variant="caption" color="text.secondary" fontWeight={700} letterSpacing={2} display="block" mb={0.5}>
                  {label.toUpperCase()}
                </Typography>
                <Typography variant="body1" fontWeight={600} color="text.primary">
                  {value}
                </Typography>
              </Paper>
            </Grid>
          ))}
        </Grid>

        {/* CTA Section */}
        <Paper
          elevation={0}
          sx={{
            borderRadius: 5,
            p: { xs: 4, md: 6 },
            background: "white",
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
          }}
        >
          <Typography variant="h5" fontWeight={700} mb={1}>
            Ready to Order? 🍰
          </Typography>
          <Typography color="text.secondary" mb={4} lineHeight={1.8}>
            Place an order or ask us anything directly on WhatsApp. We respond quickly!
            <br />
            We offer convenient pickup from our cloud kitchen in Surat.
          </Typography>

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
              borderRadius: "50px",
              fontWeight: 700,
              fontSize: "1.05rem",
              boxShadow: "0 8px 30px rgba(37,211,102,0.35)",
              "&:hover": {
                bgcolor: "#128c7e",
                transform: "translateY(-2px)",
                boxShadow: "0 12px 40px rgba(37,211,102,0.45)",
              },
              transition: "all 0.3s",
            }}
          >
            Chat on WhatsApp
          </Button>

          <Typography variant="body2" color="text.disabled" mt={3}>
            Or email us at{" "}
            <MuiLink href="mailto:info@bindiscupcakery.com" color="primary">
              info@bindiscupcakery.com
            </MuiLink>
          </Typography>
        </Paper>

        {/* Map */}
        <Box
          sx={{
            mt: 5,
            borderRadius: 5,
            overflow: "hidden",
            boxShadow: "0 8px 40px rgba(0,0,0,0.08)",
            border: "1px solid",
            borderColor: "divider",
          }}
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d567.2925023793136!2d72.7914954!3d21.174258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ddd6dae8af5%3A0xe17d92a28035ffe2!2sParle%20Point!5e0!3m2!1sen!2sin!4v1707900000000!5m2!1sen!2sin"
            width="100%"
            height="300"
            style={{ border: 0, display: "block" }}
            allowFullScreen
            loading="lazy"
          />
        </Box>
      </Container>
    </Box>
  )
}
