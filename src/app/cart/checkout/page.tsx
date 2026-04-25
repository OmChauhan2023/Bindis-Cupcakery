"use client";
import Checkout from "../components/CheckOut";
import { useAuth } from "../../auth/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/auth/login");
  }, [user, router]);

  if (!user) return <p>Redirecting to login...</p>;

  return <Checkout />;
}
