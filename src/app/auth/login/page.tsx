"use client";

import { useState } from "react";
import { login, googleSignIn } from "../authService";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    try {
      await login(email, password);
      router.push("/"); // Redirect to home
    } catch (error) {
      alert("Login failed. Please check your credentials.");
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await googleSignIn();
      router.push("/");
    } catch (error) {
      alert("Google Login failed.");
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
      <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={handleLogin}>Login</button>
      <button className="bg-red-500 text-white px-4 py-2 rounded" onClick={handleGoogleLogin}>Login with Google</button>
    </div>
  );
}
