import { useLocation } from "react-router-dom";
import Header from "./Header";
import { Footer } from "./Footer";
import WhatsAppFloat from "./whatsapp-float";
import React from "react";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <Header />
      <main className="flex-grow">{children}</main>
      <Footer />
      <WhatsAppFloat />
    </>
  );
}
