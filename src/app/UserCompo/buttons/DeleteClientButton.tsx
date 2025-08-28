// src/app/(app)/manage-clients/DeleteClientButton.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteClientButton({ id }: { id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/clients/${id}`, { method: "DELETE" });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to delete");
      }
      setOpen(false);
      router.refresh(); // reload server component data
    } catch (e: any) {
      alert(e.message || "Delete failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="rounded-md bg-red-600 px-3 py-1.5 text-white text-sm hover:bg-red-700"
      >
        Delete
      </button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-80 rounded-lg bg-white p-5 text-center">
            <h3 className="mb-2 text-lg font-semibold text-gray-900">
              Delete this client?
            </h3>
            <p className="mb-4 text-sm text-gray-600">
              This action cannot be undone.
            </p>
            <div className="flex justify-center gap-3">
              <button
                onClick={handleDelete}
                disabled={loading}
                className="rounded-md bg-red-600 px-4 py-2 text-white hover:bg-red-700 disabled:opacity-60"
              >
                {loading ? "Deleting..." : "Yes, delete"}
              </button>
              <button
                onClick={() => setOpen(false)}
                className="rounded-md bg-gray-200 px-4 py-2 text-gray-800 hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
