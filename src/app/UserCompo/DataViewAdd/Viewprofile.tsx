// src/app/profile/page.tsx
"use client";

import { useState } from "react";
import { FaUserCircle } from "react-icons/fa";

type UserProfile = {
  id: string;
  fullName: string;   // read-only
  email: string;      // read-only
  phone: string;      // editable
  address: string;    // editable
  company?: string;   // editable
};

const initialData: UserProfile = {
  id: "u_1001",
  fullName: "Sudeep Kumar Manna",
  email: "sudeep@example.com",
  phone: "+91 98765 43210",
  address: "KIIT, Bhubaneswar, Odisha",
  company: "NSS / KIIT",
};

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(initialData);
  const [draftProfile, setDraftProfile] = useState<UserProfile>(initialData); // temp edits
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<null | { type: "success" | "error"; text: string }>(null);

  const handleChange = (key: keyof UserProfile, value: string) => {
    setDraftProfile((p) => ({ ...p, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);

    try {
      // Replace with API call
      await new Promise((r) => setTimeout(r, 700));

      setProfile(draftProfile); // commit edits
      setIsEditing(false);
      setMessage({ type: "success", text: "Profile updated successfully." });
    } catch {
      setMessage({ type: "error", text: "Failed to update profile." });
    } finally {
      setSaving(false);
      setTimeout(() => setMessage(null), 2500);
    }
  };

  const handleCancel = () => {
    setDraftProfile(profile); // reset edits
    setIsEditing(false);
  };

  return (
    <div className="mx-auto max-w-4xl">
      {/* Header */}
      <div className="mb-6 flex items-center gap-4">
        <FaUserCircle className="text-5xl text-gray-500" />
        <div>
          <h1 className="text-2xl font-semibold text-black">User Profile</h1>
          <p className="text-sm text-gray-600">Only Some fields are Editable</p>
        </div>
      </div>

      {/* Card */}
      <div className="rounded-lg border border-gray-700 p-6">
        <section className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {/* Always read-only */}
          <ReadOnlyField label="Full Name" value={profile.fullName} />
          <ReadOnlyField label="Email" value={profile.email} />

          {/* Editable only when isEditing = true */}
          {isEditing ? (
            <>
              <EditableField
                label="Phone"
                value={draftProfile.phone}
                onChange={(v) => handleChange("phone", v)}
              />
              <EditableField
                label="Address"
                value={draftProfile.address}
                onChange={(v) => handleChange("address", v)}
              />
              <EditableField
                label="Company"
                value={draftProfile.company ?? ""}
                onChange={(v) => handleChange("company", v)}
              />
            </>
          ) : (
            <>
              <ReadOnlyField label="Phone" value={profile.phone} />
              <ReadOnlyField label="Address" value={profile.address} />
              <ReadOnlyField label="Company" value={profile.company ?? ""} />
            </>
          )}
        </section>

        {/* Actions */}
        <div className="mt-6 flex items-center justify-end gap-3">
          {message && (
            <span
              className={`rounded-md px-3 py-1 text-sm ${
                message.type === "success"
                  ? "bg-green-700/40 text-green-200"
                  : "bg-red-700/40 text-red-200"
              }`}
            >
              {message.text}
            </span>
          )}

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="rounded-md bg-yellow-600 px-4 py-2 text-white transition hover:bg-yellow-700"
            >
              Edit
            </button>
          ) : (
            <>
              <button
                onClick={handleCancel}
                className="rounded-md bg-red-500 px-4 py-2 text-white transition hover:bg-red-700"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="rounded-md bg-blue-400 px-4 py-2 text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {saving ? "Saving..." : "Save"}
              </button>
            </>
          )}
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500">
        Only <span className="font-medium text-gray-300">Phone, Address, Company</span> are editable, Further Queries Contact Developer.
      </p>
    </div>
  );
}

/* ---------- Small UI helpers ---------- */

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <label className="mb-1 block text-sm text-black">{children}</label>;
}

function ReadOnlyField({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <div className="rounded-md border border-gray-700  px-3 py-2 text-gray-800">
        {value || <span className="text-gray-500">—</span>}
      </div>
    </div>
  );
}

function EditableField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <FieldLabel>{label}</FieldLabel>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-md border border-gray-700 px-3 py-2 text-black outline-none transition focus:border-gray-600"
      />
    </div>
  );
}
