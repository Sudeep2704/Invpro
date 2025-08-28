// src/app/(app)/add-client/page.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type ClientForm = {
  name: string;
  address: string;
  serviceType: string;
  joiningDate: string; // yyyy-mm-dd
};

type ApiOk = { success: true; client: any };
type ApiErr = { error: string };

export default function AddClientPage() {
  const router = useRouter();

  const [form, setForm] = useState<ClientForm>({
    name: "",
    address: "",
    serviceType: "",
    joiningDate: "",
  });

  const [submitting, setSubmitting] = useState(false);
  const [msg, setMsg] = useState<null | { type: "ok" | "err"; text: string }>(null);

  const onChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMsg(null);

    if (!form.name || !form.address || !form.serviceType || !form.joiningDate) {
      setMsg({ type: "err", text: "All fields are required." });
      setSubmitting(false);
      return;
    }

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          address: form.address.trim(),
          serviceType: form.serviceType.trim(),
          joiningDate: form.joiningDate, // backend: new Date(joiningDate)
        }),
      });

      const data: ApiOk | ApiErr = await res.json();
      if (!res.ok) throw new Error(("error" in data && data.error) || "Failed to save client");

      setMsg({ type: "ok", text: "Client added successfully." });
      setForm({ name: "", address: "", serviceType: "", joiningDate: "" });

      // Optional: navigate after success
      // router.push("/manage-clients");
    } catch (err: any) {
      setMsg({ type: "err", text: err.message || "Something went wrong." });
    } finally {
      setSubmitting(false);
      setTimeout(() => setMsg(null), 2500); // auto hide toast/msg
    }
  };

  return (
    <div className="relative max-w-xl mx-auto mt-8 rounded-lg border border-gray-700 bg-gray-900/60 p-6">
      <h1 className="text-2xl font-semibold text-white mb-5">Add Client</h1>

      <form onSubmit={onSubmit} className="space-y-4">
        {/* Client Name */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Client Name</label>
          <input
            name="name"
            value={form.name}
            onChange={onChange}
            placeholder="e.g., Acme Corp."
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 outline-none focus:border-gray-600"
            required
          />
        </div>

        {/* Client Address */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Client Address</label>
          <textarea
            name="address"
            value={form.address}
            onChange={onChange}
            placeholder="Street, City, State, ZIP"
            rows={3}
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 outline-none focus:border-gray-600"
            required
          />
        </div>

        {/* Service Type */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Service Type</label>
          <input
            name="serviceType"
            value={form.serviceType}
            onChange={onChange}
            placeholder="e.g., Development, Design, Support"
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 outline-none focus:border-gray-600"
            required
          />
        </div>

        {/* Date of Joining */}
        <div>
          <label className="block text-sm text-gray-300 mb-1">Date of Joining</label>
          <input
            type="date"
            name="joiningDate"
            value={form.joiningDate}
            onChange={onChange}
            className="w-full rounded-md border border-gray-700 bg-gray-800 px-3 py-2 text-gray-100 outline-none focus:border-gray-600"
            required
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-md bg-blue-600 py-2 text-white transition hover:bg-blue-700 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {submitting ? "Saving..." : "Save Client"}
        </button>
      </form>

      {/* Inline error (keep as is) */}
      {msg?.type === "err" && (
        <p className="mt-4 text-sm text-red-300" role="alert">
          {msg.text}
        </p>
      )}

      {/* Floating success toast */}
      {msg?.type === "ok" && <ToastSuccess text={msg.text} />}
    </div>
  );
}

/* --------- Tiny toast component --------- */
function ToastSuccess({ text }: { text: string }) {
  return (
    <div
      className="fixed right-4 top-4 z-50 rounded-md border border-emerald-700/40 bg-emerald-900/90 px-4 py-3 text-emerald-100 shadow-lg backdrop-blur"
      role="status"
      aria-live="polite"
    >
      <div className="font-medium">Success</div>
      <div className="text-sm">{text}</div>
    </div>
  );
}
