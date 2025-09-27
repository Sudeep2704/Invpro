// app/login/page.tsx
"use client";

import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") || "/dashboard";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const doLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null); setLoading(true);
    const res = await signIn("credentials", {
      email, password, redirect: false,
    });
    setLoading(false);

    if (res?.ok) router.push(callbackUrl);
    else setErr(res?.error || "Invalid credentials");
  };

  const demoLogin = async () => {
    setErr(null); setLoading(true);
    const res = await signIn("credentials", {
      email: "demo@demo.com",
      password: "demo123",
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) router.push("/");
    else setErr(res?.error || "Demo login failed");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#2C3A53] p-6">
      <div className="bg-white w-full max-w-md rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>

        {err && <div className="mb-4 rounded bg-red-50 text-red-700 p-2 text-sm">{err}</div>}

        <form onSubmit={doLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="w-full border rounded px-3 py-2" type="email"
              value={email} onChange={(e)=>setEmail(e.target.value)} required />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input className="w-full border rounded px-3 py-2" type="password"
              value={password} onChange={(e)=>setPassword(e.target.value)} required />
          </div>
          <button disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2">
            {loading ? "Signing in..." : "Login"}
          </button>
        </form>

        <button 
          className="w-full mt-4 bg-gray-200 hover:bg-gray-300 text-gray-900 rounded py-2">
          Login with Demo Account
        </button>

        <p className="text-center text-sm mt-6">
          No account? <a href="/signup" className="text-indigo-600 hover:underline">Sign up</a>
        </p>
      </div>
    </main>
  );
}
