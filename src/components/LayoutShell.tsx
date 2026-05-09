"use client";

import { usePathname } from "next/navigation";
import Header from "./Header";
import { Footer } from "./Footer";
import WhatsAppFloat from "./whatsapp-float";

export default function LayoutShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

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
