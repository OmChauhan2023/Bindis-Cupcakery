"use client";


import {
  Box,
  Container,
  Grid,
  Typography,
  IconButton,
  Link as MuiLink,
  useTheme,
  alpha,
  Paper
} from "@mui/material"
import {
  Facebook,
  Instagram,
  Mail,
  LocationOn as MapPin,
  Phone
} from "@mui/icons-material"

export function Footer() {
  const theme = useTheme()

  return (
    <Box
      component="footer"
      sx={{
        py: 8,
        background: `linear-gradient(to right, ${alpha(theme.palette.primary.light, 0.3)}, ${alpha(theme.palette.primary.light, 0.1)})`,
        borderTop: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4} alignItems="center">
          {/* Contact Info */}
          <Grid item xs={12} md={4}>
            <Typography variant="h6" color="primary.dark" gutterBottom sx={{ fontWeight: 600 }}>
              Contact Us
            </Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}>
                <Phone color="primary" />
                <Box sx={{ display: "flex", flexDirection: "column" }}>
                  <MuiLink
                    href="tel:+918849130189"
                    color="text.secondary"
                    sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
                  >
                    +91 88491-30189
                  </MuiLink>
                  <MuiLink
                    href="tel:+919978677790"
                    color="text.secondary"
                    sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
                  >
                    +91 99786-77790
                  </MuiLink>
                </Box>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <Mail color="primary" />
                <MuiLink
                  href="mailto:info@bindiscupcakery.com"
                  color="text.secondary"
                  sx={{ textDecoration: "none", "&:hover": { color: "primary.main" } }}
                >
                  info@bindiscupcakery.com
                </MuiLink>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                <MapPin color="primary" />
                <Typography variant="body2" color="text.secondary">
                  Parle Point, Surat, Gujarat 395007
                </Typography>
              </Box>
            </Box>
          </Grid>

          {/* Social Media */}
          <Grid item xs={12} md={4} sx={{ textAlign: "center" }}>
            <Typography variant="h6" color="primary.dark" gutterBottom sx={{ fontWeight: 600 }}>
              Follow Us
            </Typography>
            <Box sx={{ display: "flex", justifyContent: "center", gap: 2 }}>
              <IconButton
                component="a"
                href="https://instagram.com/bindis_cupcakery"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "primary.main",
                  "&:hover": { color: "primary.dark", transform: "scale(1.1)" },
                  transition: "all 0.3s"
                }}
              >
                <Instagram fontSize="large" />
              </IconButton>
              <IconButton
                component="a"
                href="https://facebook.com/bindis_cupcakery"
                target="_blank"
                rel="noopener noreferrer"
                sx={{
                  color: "primary.main",
                  "&:hover": { color: "primary.dark", transform: "scale(1.1)" },
                  transition: "all 0.3s"
                }}
              >
                <Facebook fontSize="large" />
              </IconButton>
            </Box>
          </Grid>

          {/* Google Map Embed */}
          <Grid item xs={12} md={4}>
            <Paper
              elevation={2}
              sx={{
                borderRadius: 2,
                overflow: "hidden",
                height: 150,
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d567.2925023793136!2d72.7914954!3d21.174258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ddd6dae8af5%3A0xe17d92a28035ffe2!2sParle%20Point!5e0!3m2!1sen!2sin!4v1707900000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
              ></iframe>
            </Paper>
          </Grid>
        </Grid>

        {/* Footer Bottom */}
        <Box sx={{ mt: 6, pt: 3, borderTop: `1px solid ${theme.palette.divider}`, textAlign: "center" }}>
          <Typography variant="body2" color="text.secondary">
            © {new Date().getFullYear()} Bindi&apos;s Cupcakery. All rights reserved.
          </Typography>
        </Box>
      </Container>
    </Box>
  )
}
