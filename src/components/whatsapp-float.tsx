"use client";

import { PhoneIcon as WhatsappIcon } from "lucide-react";
import Link from "next/link";

export default function WhatsAppFloat() {
  return (
    <Link
      href="https://wa.me/918849130189"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-16 right-16 z-50 p-4 bg-green-500 text-white rounded-full shadow-lg hover:bg-green-600 hover:scale-110 transition-all duration-300 animate-bounce"
    >
      <WhatsappIcon size={32} />
    </Link>
  );
}
