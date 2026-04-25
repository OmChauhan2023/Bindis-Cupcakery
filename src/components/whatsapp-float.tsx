"use client"; // Add this line to mark the component as a Client Component

import { PhoneIcon as WhatsappIcon } from "lucide-react";
import Link from "next/link";
import styled, { keyframes } from "styled-components";

// Define the keyframe animation for slow bounce
const bounceSlow = keyframes`
  0% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px); /* Adjust the bounce height */
  }
  100% {
    transform: translateY(0);
  }
`;

// Create a styled component for the Link with the bounce animation
const WhatsAppLink = styled(Link)`
  position: fixed;
  bottom: 4rem;
  right: 4rem;
  z-index: 50;
  padding: 1rem;
  background-color: #22c55e; /* Tailwind's green-500 */
  color: white;
  border-radius: 50%;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  animation: ${bounceSlow} 1s ease-in-out infinite; /* Apply bounce animation */

  &:hover {
    background-color: #16a34a; /* Tailwind's green-600 */
    transform: scale(1.1); /* Hover effect */
  }
`;

// WhatsAppFloat component
export default function WhatsAppFloat() {
  return (
    <WhatsAppLink
      href="https://wa.me/918849130189"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
    >
      <WhatsappIcon size={32} />
    </WhatsAppLink>
  );
}