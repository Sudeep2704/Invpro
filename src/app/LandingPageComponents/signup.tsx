// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErr(null);

    if (password !== confirm) {
      setErr("Passwords do not match");
      return;
    }
    setLoading(true);
    const res = await fetch("/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password }),
    });
    setLoading(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Signup failed" }));
      setErr(error || "Signup failed");
      return;
    }
    router.push("/login");
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-6">
      <div className="bg-white w-full max-w-md rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>
        {err && <div className="mb-4 rounded bg-red-50 text-red-700 p-2 text-sm">{err}</div>}

        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Name</label>
            <input className="w-full border rounded px-3 py-2" value={name}
              onChange={(e)=>setName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input className="w-full border rounded px-3 py-2" type="email" required
              value={email} onChange={(e)=>setEmail(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Password</label>
            <input className="w-full border rounded px-3 py-2" type="password" required
              value={password} onChange={(e)=>setPassword(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input className="w-full border rounded px-3 py-2" type="password" required
              value={confirm} onChange={(e)=>setConfirm(e.target.value)} />
          </div>
          <button disabled={loading}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2">
            {loading ? "Creating..." : "Create Account"}
          </button>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account? <a href="/login" className="text-indigo-600 hover:underline">Login</a>
        </p>
      </div>
    </main>
  );
}
