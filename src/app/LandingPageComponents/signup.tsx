// app/signup/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [address, setAddress] = useState("");
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

    try {
      setLoading(true);
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // ✅ Keys match your updated backend
        body: JSON.stringify({
          fullName,
          email,
          phone,
          company,
          address,
          password,
        }),
      });
      setLoading(false);

      if (!res.ok) {
        const { error } = await res.json().catch(() => ({ error: "Signup failed" }));
        setErr(error || "Signup failed");
        return;
      }
      router.push("/login");
    } catch (e: any) {
      setLoading(false);
      setErr("Network error. Please try again.");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-[#2C3A53] p-6">
      <div className="bg-white w-full max-w-4xl rounded-lg shadow p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Sign Up</h1>

        {err && (
          <div className="mb-4 rounded bg-red-50 text-red-700 p-2 text-sm">{err}</div>
        )}

        <form onSubmit={submit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm mb-1">Full Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Phone No</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98xxxxxxx"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Company Name</label>
            <input
              className="w-full border rounded px-3 py-2"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm mb-1">Address</label>
            <textarea
              className="w-full border rounded px-3 py-2"
              rows={2}
              value={address}
              onChange={(e) => setAddress(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Confirm Password</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              required
              minLength={6}
            />
          </div>

          <div className="md:col-span-2">
            <button
              disabled={loading}
              className="w-full bg-indigo-600 hover:bg-indigo-700 text-white rounded py-2"
            >
              {loading ? "Creating..." : "Create Account"}
            </button>
          </div>
        </form>

        <p className="text-center text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-indigo-600 hover:underline">
            Login
          </a>
        </p>
      </div>
    </main>
  );
}
