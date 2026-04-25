import "./globals.css";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
<<<<<<< HEAD
import { CartProvider } from "./cart/components/CartContext";
import WhatsAppFloat from "@/components/whatsapp-float";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";
=======
import { CartProvider } from "./cart/CartContext"; // Import CartProvider
import { AuthProvider } from "./auth/AuthContext"; // Import AuthProvider
import WhatsAppFloat from "@/components/whatsapp-float"; // Import WhatsApp Float
>>>>>>> a5952e490eec4534302ae02da739bc78b511b478

const inter = Inter({ 
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata = {
  title: "Bindi's Cupcakery",
  description: "Vegetarian, eggless bakery offering homemade, preservative-free desserts",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
<<<<<<< HEAD
      <body className={`${inter.variable} ${inter.className} flex flex-col min-h-screen`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <CartProvider>
              <Header />
              <main className="flex-grow">{children}</main>
              <Footer />
              <WhatsAppFloat />
            </CartProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
=======
      <body className={`${inter.className} flex flex-col min-h-screen`}>
        <AuthProvider> {/* Wrap everything inside AuthProvider */}
          <CartProvider> {/* CartProvider inside AuthProvider */}
            <Header />
            <main className="flex-grow">{children}</main>
            <Footer />
            <WhatsAppFloat /> {/* Ensure WhatsApp Floating Icon is always visible */}
          </CartProvider>
        </AuthProvider>
>>>>>>> a5952e490eec4534302ae02da739bc78b511b478
      </body>
    </html>
  );
}
