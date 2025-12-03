"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { jwtDecode } from "jwt-decode";

async function loginUser(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirect = searchParams?.get("redirect") || "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return; 
    try {
      const payload: any = jwtDecode(token);
      if (payload?.exp && Date.now() >= payload.exp * 1000) {
        localStorage.removeItem("token"); 
        return;
      }
      router.replace(redirect);
    } catch {
      localStorage.removeItem("token"); 
    }
  }, [redirect, router]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const data = await loginUser(email, password);
      if (!data || data.error) {
        setError(data?.error || "Login failed");
        return;
      }
      const token = data.token;
      if (!token) {
        setError("No token returned from server");
        return;
      }

      localStorage.setItem("token", token);
      try {
        const decoded: any = jwtDecode(token);
        localStorage.setItem(
          "user",
          JSON.stringify({
            id: decoded.userId,
            email: decoded.email,
            role: decoded.role,
          })
        );
      } catch {}

      router.replace(redirect);
    } catch (err: any) {
      setError(err.message || "Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 z-1">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md p-6 bg-white/5 rounded"
      >
        <h2 className="text-xl font-semibold mb-4">Sign in</h2>

        <label className="block mb-2 text-sm">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
          className="w-full mb-3 p-2 rounded border bg-gray-800 text-white placeholder:text-gray-400"
        />

        <label className="block mb-2 text-sm">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
          className="w-full mb-3 p-2 rounded border bg-gray-800 text-white placeholder:text-gray-400"
        />

        {error && <div className="text-red-400 mb-3">{error}</div>}

        <button
          disabled={loading}
          className="w-full p-2 bg-blue-600 rounded text-white"
        >
          {loading ? "Signing in..." : "Sign in"}
        </button>

      <div className="w-full ">
      <p className="mt-4 w-full text-sm text-white/70 flex gap-2 justify-center  ">
          Don’t have an account?{" "}
          <a
            href={`/register?redirect=${encodeURIComponent(redirect)}`}
            className="text-blue-400 underline"
          >
            Create one
          </a>
        </p>
      </div>
      </form>
    </div>
  );
}
