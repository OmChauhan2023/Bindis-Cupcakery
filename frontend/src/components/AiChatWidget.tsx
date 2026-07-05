import React, { useState, useRef, useEffect } from "react";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  TextField,
  Button,
  Avatar,
  CircularProgress,
  alpha,
  Fade,
} from "@mui/material";
import {
  AutoAwesome as SparkleIcon,
  Close as CloseIcon,
  Send as SendIcon,
  Cake as CakeIcon,
  Person as PersonIcon,
} from "@mui/icons-material";
import api from "@/services/api";

interface Message {
  id: string;
  sender: "user" | "ai";
  text: string;
  time: string;
}

export default function AiChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      sender: "ai",
      text: "Hi there! 👋 Welcome to Bindi's Cupcakery in Surat! I am your personal dessert consultant. Ask me about our 100% eggless options, custom celebration boxes, or fast Surat delivery! 🧁✨",
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (open) {
      scrollToBottom();
    }
  }, [messages, open]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const query = input;
    const userMsg: Message = {
      id: Date.now().toString(),
      sender: "user",
      text: query,
      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await api.post("/chat", { message: query });
      const aiReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: res.data?.reply || "I'm having a little trouble right now! Please try asking again or chat with our Surat kitchen team on WhatsApp! 💕",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, aiReply]);
    } catch (err: any) {
      const errorReply: Message = {
        id: (Date.now() + 1).toString(),
        sender: "ai",
        text: "My connection to the Surat kitchen timed out! 🧁 Please try again or reach out on WhatsApp.",
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };
      setMessages((prev) => [...prev, errorReply]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Floating Action Button */}
      <Box
        onClick={() => setOpen(!open)}
        sx={{
          position: "fixed",
          bottom: 28,
          right: { xs: 95, sm: 104 },
          zIndex: 9999,
          width: 60,
          height: 60,
          borderRadius: "50%",
          background: "linear-gradient(135deg, #db2777 0%, #be185d 100%)",
          color: "white",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 26px rgba(219, 39, 119, 0.45)",
          cursor: "pointer",
          transition: "all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)",
          "&:hover": {
            background: "linear-gradient(135deg, #be185d 0%, #9d174d 100%)",
            transform: "scale(1.08) rotate(6deg)",
            boxShadow: "0 14px 34px rgba(219, 39, 119, 0.6)",
          },
        }}
        title="Chat with Bindi's AI Consultant"
      >
        <SparkleIcon sx={{ fontSize: 30 }} />
      </Box>

      {/* Floating Luxury Chat Window */}
      <Fade in={open} mountOnEnter unmountOnExit>
        <Paper
          elevation={24}
          sx={{
            position: "fixed",
            bottom: 100,
            right: { xs: 16, sm: 28 },
            zIndex: 10000,
            width: { xs: "calc(100vw - 32px)", sm: 380 },
            height: 520,
            maxHeight: "80vh",
            borderRadius: "22px",
            overflow: "hidden",
            display: "flex",
            flexDirection: "column",
            border: "1px solid",
            borderColor: "rgba(219, 39, 119, 0.15)",
            boxShadow: "0 24px 65px rgba(0, 0, 0, 0.22)",
            bgcolor: "#ffffff",
          }}
        >
          {/* Luxury Burgundy / Velvet Rose Header */}
          <Box
            sx={{
              p: 2.2,
              px: 2.5,
              background: "linear-gradient(135deg, #be185d 0%, #831843 100%)",
              color: "white",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              boxShadow: "0 4px 15px rgba(131, 24, 67, 0.3)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
              <Avatar
                sx={{
                  bgcolor: "#ffffff",
                  color: "#be185d",
                  width: 40,
                  height: 40,
                  boxShadow: "0 4px 14px rgba(0,0,0,0.18)",
                  border: "2px solid rgba(255, 255, 255, 0.8)",
                }}
              >
                <CakeIcon sx={{ fontSize: 22 }} />
              </Avatar>
              <Box>
                <Typography variant="subtitle1" fontWeight={800} sx={{ letterSpacing: -0.3, fontSize: "1.05rem", lineHeight: 1.2 }}>
                  Bindi's Cupcakery
                </Typography>
                <Typography variant="caption" sx={{ display: "block", fontSize: "0.72rem", opacity: 0.9, fontWeight: 500 }}>
                  Surat's Artisanal Dessert Guide ✨
                </Typography>
              </Box>
            </Box>
            <IconButton
              onClick={() => setOpen(false)}
              sx={{
                color: "white",
                bgcolor: alpha("#fff", 0.1),
                "&:hover": { bgcolor: alpha("#fff", 0.22), transform: "scale(1.05)" },
                transition: "all 0.2s",
              }}
            >
              <CloseIcon sx={{ fontSize: 18 }} />
            </IconButton>
          </Box>

          {/* Warm Ivory Chat Background */}
          <Box
            sx={{
              flex: 1,
              p: 2.2,
              overflowY: "auto",
              bgcolor: "#fffdfa",
              display: "flex",
              flexDirection: "column",
              gap: 2,
            }}
          >
            {messages.map((msg) => (
              <Box
                key={msg.id}
                sx={{
                  display: "flex",
                  flexDirection: msg.sender === "user" ? "row-reverse" : "row",
                  alignItems: "flex-start",
                  gap: 1.2,
                }}
              >
                <Avatar
                  sx={{
                    width: 30,
                    height: 30,
                    bgcolor: msg.sender === "user" ? "#0f172a" : "#ffe4e6",
                    color: msg.sender === "user" ? "white" : "#be185d",
                    fontSize: "0.75rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                  }}
                >
                  {msg.sender === "user" ? <PersonIcon fontSize="small" /> : <CakeIcon sx={{ fontSize: 16 }} />}
                </Avatar>
                <Box sx={{ maxWidth: "78%" }}>
                  <Box
                    sx={{
                      p: 1.5,
                      px: 2,
                      borderRadius: msg.sender === "user" ? "20px 20px 4px 20px" : "20px 20px 20px 4px",
                      background: msg.sender === "user" ? "linear-gradient(135deg, #db2777 0%, #be185d 100%)" : "#ffffff",
                      color: msg.sender === "user" ? "white" : "#1e293b",
                      boxShadow: msg.sender === "user" ? "0 4px 14px rgba(219, 39, 119, 0.25)" : "0 4px 16px rgba(0,0,0,0.05)",
                      border: msg.sender === "ai" ? "1px solid #f1f5f9" : "none",
                    }}
                  >
                    <Typography variant="body2" sx={{ whiteSpace: "pre-line", fontSize: "0.88rem", lineHeight: 1.55, fontWeight: msg.sender === "user" ? 600 : 500 }}>
                      {msg.text}
                    </Typography>
                  </Box>
                  <Typography
                    variant="caption"
                    sx={{
                      display: "block",
                      mt: 0.5,
                      fontSize: "0.68rem",
                      color: "#94a3b8",
                      textAlign: msg.sender === "user" ? "right" : "left",
                      px: 0.5,
                    }}
                  >
                    {msg.time}
                  </Typography>
                </Box>
              </Box>
            ))}

            {loading && (
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.2 }}>
                <Avatar sx={{ width: 30, height: 30, bgcolor: "#ffe4e6", color: "#be185d" }}>
                  <CakeIcon sx={{ fontSize: 16 }} />
                </Avatar>
                <Box sx={{ p: 1.2, px: 2, bgcolor: "#ffffff", borderRadius: "20px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: 1.2, boxShadow: "0 4px 16px rgba(0,0,0,0.05)" }}>
                  <CircularProgress size={14} sx={{ color: "#db2777" }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600}>
                    Bindi is thinking...
                  </Typography>
                </Box>
              </Box>
            )}
            <div ref={messagesEndRef} />
          </Box>

          {/* Premium Input Footer */}
          <Box
            component="form"
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            sx={{
              p: 1.6,
              px: 2,
              bgcolor: "#ffffff",
              borderTop: "1px solid #f1f5f9",
              display: "flex",
              alignItems: "center",
              gap: 1.2,
              boxShadow: "0 -4px 15px rgba(0,0,0,0.02)",
            }}
          >
            <TextField
              fullWidth
              size="small"
              placeholder="Ask about flavors, Surat delivery..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={loading}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "50px",
                  bgcolor: "#f8fafc",
                  "& fieldset": { borderColor: "#e2e8f0" },
                  "&:hover fieldset": { borderColor: "#cbd5e1" },
                  "&.Mui-focused fieldset": { borderColor: "#db2777", borderWidth: "1.5px" },
                },
              }}
            />
            <Button
              type="submit"
              variant="contained"
              disabled={loading}
              sx={{
                minWidth: 44,
                width: 44,
                height: 42,
                borderRadius: "50%",
                background: input.trim() ? "linear-gradient(135deg, #db2777 0%, #be185d 100%)" : "#f472b6",
                color: "white",
                p: 0,
                boxShadow: input.trim() ? "0 4px 14px rgba(219, 39, 119, 0.35)" : "none",
                transition: "all 0.2s",
                "&:hover": {
                  background: "linear-gradient(135deg, #be185d 0%, #9d174d 100%)",
                  boxShadow: "0 6px 18px rgba(219, 39, 119, 0.45)",
                  transform: "scale(1.05)",
                },
                "&:disabled": { background: "#e2e8f0", color: "#94a3b8" },
              }}
            >
              <SendIcon sx={{ fontSize: 18, ml: 0.2 }} />
            </Button>
          </Box>
        </Paper>
      </Fade>
    </>
  );
}
