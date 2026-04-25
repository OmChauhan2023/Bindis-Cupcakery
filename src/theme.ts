"use client";

import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#ec4899", // pink-500
      light: "#fbcfe8", // pink-200
      dark: "#be185d", // pink-700
      contrastText: "#fff",
    },
    secondary: {
      main: "#f472b6", // pink-400
    },
    background: {
      default: "#fff5f7", // very light pink/white
      paper: "#ffffff",
    },
  },
  typography: {
    fontFamily: "var(--font-inter), sans-serif",
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "8px",
          textTransform: "none",
        },
      },
    },
  },
});

export default theme;
