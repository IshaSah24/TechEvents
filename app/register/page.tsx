"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { jwtDecode } from "jwt-decode";

async function registerUser(name: string, email: string, password: string) {
  const res = await fetch("/api/auth/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, email, password }),
  });
  return res.json();
}

async function loginUser(email: string, password: string) {
  const res = await fetch("/api/auth/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return res.json();
}

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const redirect =
    typeof window !== "undefined"
      ? new URLSearchParams(window.location.search).get("redirect")
      : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const reg = await registerUser(name, email, password);
      if (!reg || reg.error) {
        setError(reg?.error || "Registration failed");
        return;
      }

      const login = await loginUser(email, password);
      if (login?.token) {
        localStorage.setItem("token", login.token);
        try {
          const decoded: any = jwtDecode(login.token);
          localStorage.setItem(
            "user",
            JSON.stringify({
              id: decoded.userId,
              email: decoded.email,
              role: decoded.role,
            })
          );
        } catch {}
        const redirectUrl = typeof redirect === "string" ? redirect : "/";
        router.replace(redirectUrl);
        return;
      }

      setError(
        "Registration succeeded but could not log you in automatically."
      );
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
        <h2 className="text-xl font-semibold mb-4">Create account</h2>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Name"
          required
          disabled={loading}
          className="w-full mb-3 p-2 rounded bg-black/10"
        />
        <input
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          type="email"
          required
          disabled={loading}
          className="w-full mb-3 p-2 rounded bg-black/10"
        />
        <input
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Password"
          type="password"
          required
          disabled={loading}
          className="w-full mb-3 p-2 rounded bg-black/10"
        />

        {error && <div className="text-red-400 mb-3">{error}</div>}

        <button
          disabled={loading}
          className="w-full p-2 bg-green-600 rounded text-white"
        >
          {loading ? "Creating..." : "Create account"}
        </button>

        <p className="mt-4 text-sm text-white/70 text-center">
          Already have an account?{" "}
          <a
            href={`/login?redirect=${encodeURIComponent(redirect || "/")}`}
            className="text-blue-400 underline"
          >
            Sign in
          </a>
        </p>
      </form>
    </div>
  );
}
