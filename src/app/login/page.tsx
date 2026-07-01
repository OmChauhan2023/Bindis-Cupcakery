import { signIn } from "@/auth"
import { Box, Button, Container, Typography, Paper } from "@mui/material"
import GoogleIcon from "@mui/icons-material/Google"
import Image from "next/image"

export default function LoginPage() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "linear-gradient(135deg, #fdf4ed 0%, #f4eef9 100%)",
        py: 6,
      }}
    >
      <Container maxWidth="xs">
        <Paper
          elevation={0}
          sx={{
            p: 4,
            borderRadius: 4,
            border: "1px solid",
            borderColor: "divider",
            textAlign: "center",
            boxShadow: "0 12px 40px rgba(0,0,0,0.06)",
          }}
        >
          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                background: "linear-gradient(135deg, #ec4899, #8b5cf6)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "white",
                fontSize: 32,
              }}
            >
              🧁
            </Box>
          </Box>
          <Typography variant="h5" fontWeight={800} gutterBottom>
            Welcome to Bindi&apos;s Cupcakery
          </Typography>
          <Typography color="text.secondary" sx={{ mb: 4 }}>
            Please sign in to continue and place your orders securely.
          </Typography>

          <form
            action={async () => {
              "use server"
              await signIn("google")
            }}
          >
            <Button
              type="submit"
              fullWidth
              variant="outlined"
              size="large"
              startIcon={<GoogleIcon sx={{ color: "#DB4437" }} />}
              sx={{
                borderRadius: "50px",
                py: 1.5,
                fontWeight: 700,
                borderColor: "divider",
                color: "text.primary",
                "&:hover": {
                  borderColor: "text.primary",
                  bgcolor: "rgba(0,0,0,0.02)",
                },
              }}
            >
              Sign in with Google
            </Button>
          </form>
        </Paper>
      </Container>
    </Box>
  )
}
