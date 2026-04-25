"use client";

import { useState } from "react";
import { signUp } from "../authService";
import { useRouter } from "next/navigation";

export default function SignUpPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSignUp = async () => {
    try {
      await signUp(email, password);
      router.push("/auth/login"); // Redirect to login after signup
    } catch (error) {
      alert("Signup failed. Try again.");
    }
  };

  return (
    <div className="flex flex-col items-center gap-4 p-6">
      <input
        type="email"
        placeholder="Email"
        className="border p-2 rounded"
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        className="border p-2 rounded"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button className="bg-green-500 text-white px-4 py-2 rounded" onClick={handleSignUp}>Sign Up</button>
    </div>
  );
}
