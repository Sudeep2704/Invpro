"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

type ClientLite = { _id: string; name: string };

export default function AddInvoice() {
  const [clients, setClients] = useState<ClientLite[]>([]);
  const [loadingClients, setLoadingClients] = useState(true);
  const [clientError, setClientError] = useState<string | null>(null);

  const [form, setForm] = useState({
    fyYear: "",
    clientId: "",
    name: "",
    date: "",
    number: "",
    amount: "",
    description: "",
    isPaid: "no",
    pdfFile: null as File | null,
  });

  useEffect(() => {
    (async () => {
      try {
        setLoadingClients(true);
        setClientError(null);

        const res = await fetch("/api/clients", { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to load clients");

        const data = await res.json();
        const list: ClientLite[] = (data?.clients || []).map((c: any) => ({
          _id: String(c._id),
          name: c.name,
        }));
        setClients(list);

        const params = new URLSearchParams(window.location.search);
        const newClientId = params.get("newClientId");
        if (newClientId) setForm((f) => ({ ...f, clientId: newClientId }));
      } catch (e: any) {
        setClientError(e?.message || "Could not load clients");
      } finally {
        setLoadingClients(false);
      }
    })();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setForm((prev) => ({ ...prev, pdfFile: e.target.files![0] }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pdfFile) return alert("Please upload a PDF");
    if (!form.clientId) return alert("Please select a client");

    const data = new FormData();
    data.append("file", form.pdfFile);

    const uploadRes = await fetch("/api/upload", { method: "POST", body: data });
    if (!uploadRes.ok) return alert("File upload failed");
    const uploadData = await uploadRes.json();
    const pdfUrl = uploadData.secure_url;

    const res = await fetch("/api/invoices", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fyYear: form.fyYear,
        clientId: form.clientId,
        name: form.name,
        date: form.date,
        number: form.number,
        amount: Number(form.amount),
        description: form.description,
        isPaid: form.isPaid === "yes",
        pdfUrl,
      }),
    });

    if (!res.ok) {
      const err = await res.text();
      return alert(`Failed to add invoice: ${err}`);
    }

    alert("Invoice added!");
    setForm({
      fyYear: "",
      clientId: "",
      name: "",
      date: "",
      number: "",
      amount: "",
      description: "",
      isPaid: "no",
      pdfFile: null,
    });
  };

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-50 p-6">
      <form
        onSubmit={handleSubmit}
        className="bg-white shadow-md border border-gray-300 p-8 w-full max-w-lg space-y-6 rounded-none" // ⬅️ rectangular
      >
        <h2 className="text-2xl font-semibold text-gray-800 text-center">
          Add Invoice
        </h2>

        {/* FY Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Financial Year
          </label>
          <select
            name="fyYear"
            value={form.fyYear}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-none"
          >
            <option value="">Select FY Year</option>
            <option value="2024-25">2024-25</option>
            <option value="2025-26">2025-26</option>
          </select>
        </div>

        {/* Client (from MongoDB) */}
        <div>
          <div className="flex items-center justify-between">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client
            </label>
            <Link href="/addclient" className="text-sm text-blue-600 hover:underline">
              + Add new client
            </Link>
          </div>

          {loadingClients ? (
            <div className="text-sm text-gray-500">Loading clients…</div>
          ) : clientError ? (
            <div className="text-sm text-red-600">{clientError}</div>
          ) : (
            <select
              name="clientId"
              value={form.clientId}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-none"
            >
              <option value="">Select a client</option>
              {clients.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.name}
                </option>
              ))}
            </select>
          )}
        </div>

        {/* Invoice Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invoice Name
          </label>
          <input
            name="name"
            placeholder="Enter invoice name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-none"
          />
        </div>

        {/* Date */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Date
          </label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-none"
          />
        </div>

        {/* Invoice Number */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Invoice Number
          </label>
          <input
            name="number"
            placeholder="INV-001"
            value={form.number}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-none"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Amount
          </label>
          <input
            type="number"
            name="amount"
            placeholder="Enter amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-none"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>
          <textarea
            name="description"
            placeholder="Enter description"
            value={form.description}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-none"
          />
        </div>

        {/* Payment Status */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Payment Status
          </label>
          <div className="flex items-center gap-6">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isPaid"
                value="yes"
                checked={form.isPaid === "yes"}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>Yes</span>
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="isPaid"
                value="no"
                checked={form.isPaid === "no"}
                onChange={handleChange}
                className="text-blue-600 focus:ring-blue-500"
              />
              <span>No</span>
            </label>
          </div>
        </div>

        {/* PDF Upload */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Upload PDF
          </label>
          <input
            type="file"
            accept="application/pdf"
            onChange={handleFile}
            required
            className="w-full p-3 border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-none"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-between gap-4">
          <button
            type="submit"
            className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium shadow focus:outline-none focus:ring-2 focus:ring-blue-500 rounded-none"
          >
            Submit
          </button>
          <button
            type="reset"
            onClick={() =>
              setForm({
                fyYear: "",
                clientId: "",
                name: "",
                date: "",
                number: "",
                amount: "",
                description: "",
                isPaid: "no",
                pdfFile: null,
              })
            }
            className="flex-1 px-4 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium shadow focus:outline-none focus:ring-2 focus:ring-gray-400 rounded-none"
          >
            Reset
          </button>
        </div>
      </form>
    </div>
  );
}
