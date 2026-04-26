"use client"

import { useState } from "react"
import {
  Box,
  Container,
  Typography,
  Paper,
  Grid,
  Button,
  TextField,
  Link as MuiLink,
  alpha,
  Stack,
} from "@mui/material"
import {
  LocationOn as MapPinIcon,
  Phone as PhoneIcon,
  AccessTime as ClockIcon,
  WhatsApp as WhatsAppIcon,
  Send as SendIcon,
} from "@mui/icons-material"
import { motion } from "framer-motion"

const contactItems = [
  {
    icon: <MapPinIcon sx={{ fontSize: 32, color: "primary.main" }} />,
    label: "Our Location",
    value: "Parle Point, Surat, Gujarat 395007",
    href: "https://maps.google.com/?q=Parle+Point+Surat",
    bg: "rgba(252, 231, 243, 0.4)",
    border: "rgba(236,72,153,0.2)",
  },
  {
    icon: <PhoneIcon sx={{ fontSize: 32, color: "#8b5cf6" }} />,
    label: "Call Us",
    value: "+91 88491-30189",
    href: "tel:+918849130189",
    bg: "rgba(245, 243, 255, 0.4)",
    border: "rgba(139,92,246,0.2)",
  },
  {
    icon: <ClockIcon sx={{ fontSize: 32, color: "#f59e0b" }} />,
    label: "Working Hours",
    value: "Daily: 11:00 AM – 8:00 PM",
    bg: "rgba(255, 251, 235, 0.4)",
    border: "rgba(245,158,11,0.2)",
  },
]

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Simulate form submission
    alert("Thank you for your message! We will get back to you soon.")
    setFormData({ name: "", email: "", message: "" })
  }

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #fdf2f8 0%, #ffffff 50%, #f5f3ff 100%)",
        pt: { xs: 6, md: 10 },
        pb: 12,
      }}
    >
      <Container maxWidth="lg">
        {/* Header Section */}
        <Box textAlign="center" mb={10}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography variant="overline" sx={{ color: "primary.main", letterSpacing: 5, fontWeight: 800, mb: 2, display: "block" }}>
              GET IN TOUCH
            </Typography>
            <Typography
              variant="h2"
              fontWeight={900}
              sx={{
                fontSize: { xs: "2.5rem", md: "4rem" },
                background: "linear-gradient(135deg, #be185d 0%, #7c3aed 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 3,
                lineHeight: 1.2,
              }}
            >
              We&apos;d Love to Hear <br /> From You 💌
            </Typography>
            <Typography variant="h6" color="text.secondary" maxWidth={700} mx="auto" sx={{ fontWeight: 400, opacity: 0.8 }}>
              Have a question about our treats or want a custom cake for your special day? 
              Drop us a message and we&apos;ll get back to you!
            </Typography>
          </motion.div>
        </Box>

        <Grid container spacing={6}>
          {/* Left Column: Contact Details */}
          <Grid item xs={12} md={5}>
            <Stack spacing={4}>
              {contactItems.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 + 0.3 }}
                >
                  <Paper
                    elevation={0}
                    sx={{
                      p: 4,
                      borderRadius: 6,
                      background: item.bg,
                      backdropFilter: "blur(10px)",
                      border: `1px solid ${item.border}`,
                      display: "flex",
                      alignItems: "center",
                      gap: 4,
                      transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
                      cursor: item.href ? "pointer" : "default",
                      "&:hover": {
                        transform: "scale(1.02) translateX(10px)",
                        boxShadow: `0 20px 40px ${item.border}`,
                        background: "white",
                      },
                    }}
                    component={item.href ? "a" : "div"}
                    href={item.href}
                    target={item.href?.startsWith("http") ? "_blank" : undefined}
                    style={{ textDecoration: "none" }}
                  >
                    <Box 
                      sx={{ 
                        p: 2, 
                        borderRadius: 4, 
                        bgcolor: "white", 
                        boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                        display: "flex"
                      }}
                    >
                      {item.icon}
                    </Box>
                    <Box>
                      <Typography variant="caption" color="text.secondary" fontWeight={800} letterSpacing={2} display="block" mb={0.5}>
                        {item.label.toUpperCase()}
                      </Typography>
                      <Typography variant="h6" fontWeight={700} color="text.primary">
                        {item.value}
                      </Typography>
                    </Box>
                  </Paper>
                </motion.div>
              ))}

              {/* WhatsApp CTA */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.6 }}
              >
                <Paper
                  sx={{
                    p: 4,
                    borderRadius: 6,
                    background: "linear-gradient(135deg, #25d366 0%, #128c7e 100%)",
                    color: "white",
                    boxShadow: "0 20px 40px rgba(37,211,102,0.3)",
                    textAlign: "center",
                  }}
                >
                  <Typography variant="h5" fontWeight={800} mb={1}>Quick Chat? 🍰</Typography>
                  <Typography variant="body2" sx={{ opacity: 0.9, mb: 3 }}>
                    The fastest way to place your order is via WhatsApp!
                  </Typography>
                  <Button
                    variant="contained"
                    startIcon={<WhatsAppIcon />}
                    href="https://wa.me/918849130189"
                    target="_blank"
                    sx={{
                      bgcolor: "white",
                      color: "#128c7e",
                      fontWeight: 700,
                      px: 4,
                      py: 1.5,
                      borderRadius: 4,
                      "&:hover": { bgcolor: alpha("#fff", 0.9), transform: "translateY(-2px)" },
                    }}
                  >
                    Message on WhatsApp
                  </Button>
                </Paper>
              </motion.div>
            </Stack>
          </Grid>

          {/* Right Column: Contact Form */}
          <Grid item xs={12} md={7}>
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Paper
                elevation={0}
                sx={{
                  p: { xs: 4, md: 6 },
                  borderRadius: 8,
                  bgcolor: "white",
                  boxShadow: "0 40px 100px rgba(0,0,0,0.06)",
                  border: "1px solid rgba(0,0,0,0.03)",
                }}
              >
                <Typography variant="h4" fontWeight={800} mb={4}>Send us a Message</Typography>
                <form onSubmit={handleSubmit}>
                  <Stack spacing={3}>
                    <Grid container spacing={3}>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Your Name"
                          variant="filled"
                          required
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          sx={{ "& .MuiFilledInput-root": { bgcolor: "#f8fafc", borderRadius: 3 } }}
                        />
                      </Grid>
                      <Grid item xs={12} sm={6}>
                        <TextField
                          fullWidth
                          label="Email Address"
                          variant="filled"
                          type="email"
                          required
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          sx={{ "& .MuiFilledInput-root": { bgcolor: "#f8fafc", borderRadius: 3 } }}
                        />
                      </Grid>
                    </Grid>
                    <TextField
                      fullWidth
                      label="Your Message"
                      variant="filled"
                      multiline
                      rows={5}
                      required
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      sx={{ "& .MuiFilledInput-root": { bgcolor: "#f8fafc", borderRadius: 3 } }}
                    />
                    <Button
                      type="submit"
                      variant="contained"
                      size="large"
                      endIcon={<SendIcon />}
                      sx={{
                        py: 2,
                        borderRadius: 4,
                        fontWeight: 800,
                        fontSize: "1.1rem",
                        background: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
                        boxShadow: "0 10px 30px rgba(236,72,153,0.3)",
                        "&:hover": {
                          background: "linear-gradient(135deg, #be185d 0%, #7c3aed 100%)",
                          transform: "translateY(-3px)",
                          boxShadow: "0 15px 40px rgba(236,72,153,0.4)",
                        },
                      }}
                    >
                      Send Message
                    </Button>
                    <Typography variant="body2" color="text.secondary" textAlign="center">
                      Or email us directly at{" "}
                      <MuiLink href="mailto:info@bindiscupcakery.com" fontWeight={700} color="primary">
                        info@bindiscupcakery.com
                      </MuiLink>
                    </Typography>
                  </Stack>
                </form>
              </Paper>
            </motion.div>
          </Grid>
        </Grid>

        {/* Map Section */}
        <Box sx={{ mt: 10 }}>
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 }}
          >
            <Typography variant="h5" fontWeight={800} mb={4} textAlign="center">Find Us on the Map 🗺️</Typography>
            <Paper
              elevation={0}
              sx={{
                borderRadius: 8,
                overflow: "hidden",
                boxShadow: "0 40px 100px rgba(0,0,0,0.1)",
                border: "10px solid white",
              }}
            >
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d567.2925023793136!2d72.7914954!3d21.174258!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be04ddd6dae8af5%3A0xe17d92a28035ffe2!2sParle%20Point!5e0!3m2!1sen!2sin!4v1707900000000!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0, display: "block" }}
                allowFullScreen
                loading="lazy"
              />
            </Paper>
          </motion.div>
        </Box>
      </Container>
    </Box>
  )
}

