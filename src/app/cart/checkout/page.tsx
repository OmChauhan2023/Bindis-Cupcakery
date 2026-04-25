<<<<<<< HEAD
"use client";
import Checkout from "../components/CheckOut";

export default function CheckoutPage() {
  return <Checkout />;
=======
"use client"
import { useAuth } from "../../auth/AuthContext"; // ✅ Relative import (Recommended)

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function CheckoutPage() {
  const { user } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!user) router.push("/auth/login");
  }, [user]);

  if (!user) return <p>Redirecting to login...</p>;

  return <p>Proceed to checkout...</p>;
>>>>>>> a5952e490eec4534302ae02da739bc78b511b478
}
