"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ConfirmationPage() {
  const router = useRouter();

  // Automatically redirect to home after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      router.push("/");
    }, 5000); // Redirect after 5 sec
    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="max-w-3xl mx-auto p-6 text-center">
      <h2 className="text-3xl font-bold text-green-600 mb-4">✅ Order Placed Successfully!</h2>
      <p className="text-lg text-gray-700">
        Thank you for your order! We&apos;ll start preparing it soon.
      </p>
      <p className="text-sm text-gray-500 mt-2">You will be redirected to the homepage shortly...</p>

      <Link
        href="/"
        className="mt-6 inline-block bg-pink-500 text-white px-4 py-2 rounded shadow hover:bg-pink-600 transition"
      >
        Go to Home Now
      </Link>
    </div>
  );
}
