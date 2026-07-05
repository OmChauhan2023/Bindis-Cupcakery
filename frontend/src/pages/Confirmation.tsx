import { useEffect, useState } from "react";
import { useNavigate, Link, useSearchParams } from "react-router-dom";
import { Box, Typography, Button, Container, LinearProgress, alpha, Chip } from "@mui/material";
import {
  Home as HomeIcon,
  ShoppingBag as ShopIcon,
  WhatsApp as WhatsAppIcon,
  Security as SecurityIcon,
} from "@mui/icons-material";
import { motion } from "framer-motion";
import confetti from "canvas-confetti";
import { CONTACT_WHATSAPP_URL } from "@/lib/contact";

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const orderId = searchParams.get("orderId") || "ORD-SUCCESS";
  const [countdown, setCountdown] = useState(12);

  const fireConfetti = () => {
    // Main center burst
    confetti({
      particleCount: 100,
      spread: 80,
      origin: { y: 0.6 },
      colors: ["#22c55e", "#10b981", "#ec4899", "#8b5cf6", "#f59e0b"],
    });

    // Left side cannon (delayed slightly)
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 60,
        spread: 55,
        origin: { x: 0, y: 0.7 },
        colors: ["#22c55e", "#ec4899", "#6366f1"],
      });
    }, 300);

    // Right side cannon (delayed slightly)
    setTimeout(() => {
      confetti({
        particleCount: 60,
        angle: 120,
        spread: 55,
        origin: { x: 1, y: 0.7 },
        colors: ["#10b981", "#8b5cf6", "#f59e0b"],
      });
    }, 500);
  };

  useEffect(() => {
    // Fire celebratory confetti explosion on load
    fireConfetti();

    const interval = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) {
          clearInterval(interval);
          navigate("/");
          return 0;
        }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, [navigate]);

  const progress = ((12 - countdown) / 12) * 100;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        background: "linear-gradient(160deg, #f0fdf4 0%, #fce7f3 40%, #f5f3ff 100%)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Decorative ambient blobs */}
      <Box sx={{ position: "absolute", top: -80, left: -80, width: 350, height: 350, borderRadius: "50%", background: alpha("#22c55e", 0.15), filter: "blur(70px)", pointerEvents: "none" }} />
      <Box sx={{ position: "absolute", bottom: -80, right: -80, width: 350, height: 350, borderRadius: "50%", background: alpha("#ec4899", 0.15), filter: "blur(70px)", pointerEvents: "none" }} />

      <Container maxWidth="sm">
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 30 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.6, type: "spring", bounce: 0.4 }}
        >
          <Box
            sx={{
              bgcolor: "white",
              borderRadius: 6,
              p: { xs: 4, md: 6 },
              textAlign: "center",
              boxShadow: "0 24px 80px rgba(34,197,94,0.15), 0 8px 32px rgba(0,0,0,0.06)",
              border: "2px solid",
              borderColor: alpha("#22c55e", 0.3),
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* GOOGLE PAY / PHONEPE STYLE PAYMENT SUCCESS ANIMATION */}
            <Box
              onClick={fireConfetti}
              sx={{
                position: "relative",
                width: 130,
                height: 130,
                mx: "auto",
                mb: 3,
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
              title="Click to celebrate again!"
            >
              {/* Expanding Ripple Ring 1 */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: [1, 1.6, 2], opacity: [0.6, 0.2, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: alpha("#22c55e", 0.25),
                }}
              />

              {/* Expanding Ripple Ring 2 */}
              <motion.div
                initial={{ scale: 0.8, opacity: 0.8 }}
                animate={{ scale: [1, 1.4, 1.8], opacity: [0.5, 0.15, 0] }}
                transition={{ duration: 2, delay: 0.6, repeat: Infinity, ease: "easeOut" }}
                style={{
                  position: "absolute",
                  width: "100%",
                  height: "100%",
                  borderRadius: "50%",
                  backgroundColor: alpha("#10b981", 0.3),
                }}
              />

              {/* Glowing Center Circle */}
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                style={{
                  width: 96,
                  height: 96,
                  borderRadius: "50%",
                  background: "linear-gradient(135deg, #22c55e, #10b981)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 12px 36px rgba(34,197,94,0.45)",
                  zIndex: 2,
                }}
              >
                {/* SVG Drawing Checkmark */}
                <svg width="48" height="48" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <motion.path
                    d="M14 26 L22 34 L38 16"
                    fill="transparent"
                    strokeWidth="5"
                    stroke="#ffffff"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    initial={{ pathLength: 0, opacity: 0 }}
                    animate={{ pathLength: 1, opacity: 1 }}
                    transition={{ delay: 0.3, duration: 0.6, ease: "easeOut" }}
                  />
                </svg>
              </motion.div>
            </Box>

            {/* Payment Verified Chip Badge */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Chip
                icon={<SecurityIcon style={{ fontSize: 16, color: "#10b981" }} />}
                label="Payment Verified & Order Secured"
                sx={{
                  bgcolor: alpha("#10b981", 0.12),
                  color: "#10b981",
                  fontWeight: 800,
                  fontSize: "0.8rem",
                  py: 1.8,
                  px: 1,
                  borderRadius: "50px",
                  mb: 2.5,
                  boxShadow: "0 4px 12px rgba(16,185,129,0.1)",
                }}
              />
            </motion.div>

            <Typography
              variant="h3"
              fontWeight={900}
              sx={{
                background: "linear-gradient(135deg, #16a34a, #22c55e)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                mb: 1,
                fontSize: { xs: "1.9rem", md: "2.4rem" },
                letterSpacing: -0.5,
              }}
            >
              Order Confirmed! 🎉
            </Typography>

            {orderId && orderId !== "ORD-SUCCESS" && (
              <Typography variant="subtitle2" sx={{ fontWeight: 800, color: "text.secondary", mb: 1.5, fontFamily: "monospace" }}>
                Order ID: #{orderId.slice(-6).toUpperCase()}
              </Typography>
            )}

            <Typography
              variant="body1"
              color="text.secondary"
              fontWeight={500}
              sx={{ lineHeight: 1.7, mb: 3, fontSize: { xs: "0.95rem", md: "1.05rem" }, maxWidth: 440, mx: "auto" }}
            >
              Thank you for ordering from Bindi's Cupcakery! Your payment reference has been recorded and kitchen preparation is starting. 🧁💕
            </Typography>

            {/* WhatsApp button */}
            <Button
              href={CONTACT_WHATSAPP_URL}
              target="_blank"
              variant="contained"
              fullWidth
              startIcon={<WhatsAppIcon />}
              sx={{
                bgcolor: "#25d366",
                borderRadius: "50px",
                py: 1.6,
                mb: 2.5,
                fontWeight: 800,
                fontSize: "1rem",
                boxShadow: "0 8px 24px rgba(37,211,102,0.35)",
                "&:hover": { bgcolor: "#128c7e", transform: "translateY(-2px)", boxShadow: "0 12px 28px rgba(37,211,102,0.45)" },
                transition: "all 0.25s",
              }}
            >
              Track Order via WhatsApp
            </Button>

            {/* Action buttons */}
            <Box sx={{ display: "flex", gap: 2 }}>
              <Button
                component={Link}
                to="/"
                variant="outlined"
                startIcon={<HomeIcon />}
                fullWidth
                sx={{
                  borderRadius: "50px",
                  py: 1.4,
                  fontWeight: 700,
                  borderColor: alpha("#be185d", 0.4),
                  color: "#be185d",
                  "&:hover": { bgcolor: alpha("#be185d", 0.05) },
                }}
              >
                Home
              </Button>
              <Button
                component={Link}
                to="/products"
                variant="contained"
                startIcon={<ShopIcon />}
                fullWidth
                sx={{
                  borderRadius: "50px",
                  py: 1.4,
                  fontWeight: 700,
                  background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                  boxShadow: "0 8px 24px rgba(236,72,153,0.3)",
                  "&:hover": { transform: "translateY(-2px)" },
                  transition: "all 0.25s",
                }}
              >
                Order More
              </Button>
            </Box>

            {/* Countdown bar */}
            <Box sx={{ mt: 4 }}>
              <Typography variant="caption" color="text.secondary" fontWeight={600}>
                Redirecting to home in {countdown}s... (Click checkmark for more confetti!)
              </Typography>
              <LinearProgress
                variant="determinate"
                value={progress}
                sx={{
                  mt: 1,
                  borderRadius: 4,
                  height: 5,
                  bgcolor: alpha("#22c55e", 0.15),
                  "& .MuiLinearProgress-bar": {
                    background: "linear-gradient(90deg, #22c55e, #10b981)",
                    borderRadius: 4,
                  },
                }}
              />
            </Box>
          </Box>
        </motion.div>
      </Container>
    </Box>
  );
}
