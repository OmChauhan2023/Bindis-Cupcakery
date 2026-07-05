import { Box } from "@mui/material";
import WhatsAppIcon from "@mui/icons-material/WhatsApp";
import { CONTACT_WHATSAPP_URL } from "@/lib/contact";

export default function WhatsAppFloat() {
  return (
    <Box
      component="a"
      href={CONTACT_WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      sx={{
        position: "fixed",
        bottom: 28,
        right: 28,
        zIndex: 9999,
        width: 60,
        height: 60,
        borderRadius: "50%",
        bgcolor: "#25D366", // Official WhatsApp green
        color: "white",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 8px 24px rgba(37, 211, 102, 0.4)",
        cursor: "pointer",
        transition: "all 0.25s ease",
        "&:hover": {
          bgcolor: "#20bd5a",
          transform: "scale(1.06)",
          boxShadow: "0 12px 30px rgba(37, 211, 102, 0.55)",
        },
        textDecoration: "none",
      }}
    >
      <WhatsAppIcon sx={{ fontSize: 36 }} />
    </Box>
  );
}
