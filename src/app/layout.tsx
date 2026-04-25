import "./globals.css";
import { Inter } from "next/font/google";
import Header from "../components/Header";
import { Footer } from "../components/Footer";
import { CartProvider } from "./cart/components/CartContext";
import { AuthProvider } from "./auth/AuthContext";
import WhatsAppFloat from "@/components/whatsapp-float";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v15-appRouter";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import theme from "@/theme";

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
      <body className={`${inter.variable} ${inter.className} flex flex-col min-h-screen`}>
        <AppRouterCacheProvider>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <AuthProvider>
              <CartProvider>
                <Header />
                <main className="flex-grow">{children}</main>
                <Footer />
                <WhatsAppFloat />
              </CartProvider>
            </AuthProvider>
          </ThemeProvider>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
