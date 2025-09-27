// src/app/(app)/manage-clients/page.tsx
import Link from "next/link";
import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { connectDB } from "../../lib/mongodb";
import ClientModel from "../../models/client";
import DeleteClientButton from "../../UserCompo/buttons/DeleteClientButton"

export const dynamic = "force-dynamic";
export const revalidate = 0;

function fmt(d?: string | null) {
  if (!d) return "—";
  const date = new Date(d);
  return Number.isNaN(date.getTime()) ? "—" : date.toLocaleDateString("en-IN");
}

export default async function ManageClientsPage() {
  // 🔐 Require session
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }
  const email = session.user.email.toLowerCase();

  await connectDB();

  // 🔒 Only this user's clients
  const docs = await ClientModel.find({ ownerEmail: email })
    .sort({ createdAt: -1 })
    .lean();

  const clients = docs.map((c: any) => ({
    _id: String(c._id),
    name: c.name,
    address: c.address,
    serviceType: c.serviceType,
    joiningDate: c.joiningDate ? new Date(c.joiningDate).toISOString() : null,
    createdAt: c.createdAt ? new Date(c.createdAt).toISOString() : null,
  }));

  return (
    <div className="mx-auto max-w-5xl">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-black">Saved Clients</h1>
        <Link
          href="/dashboard/clientdash/addclient"
          className="rounded-md bg-blue-600 px-4 py-2 text-white hover:bg-blue-700 transition"
        >
          + Add Client
        </Link>
      </div>

      {clients.length === 0 ? (
        <div className="rounded-lg border border-gray-700 bg-gray-900/60 p-6 text-gray-300">
          No clients yet.
        </div>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-700">
          <table className="min-w-full divide-y divide-gray-700">
            <thead className="bg-gray-800">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Name</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Address</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Service Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Joining Date</th>
                <th className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-300">Added</th>
                <th className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-300">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-700 bg-gray-900/60">
              {clients.map((c) => (
                <tr key={c._id} className="hover:bg-gray-800/60">
                  <td className="px-4 py-3 text-gray-100">{c.name}</td>
                  <td className="px-4 py-3 text-gray-300">{c.address}</td>
                  <td className="px-4 py-3 text-gray-300">{c.serviceType}</td>
                  <td className="px-4 py-3 text-gray-300">{fmt(c.joiningDate)}</td>
                  <td className="px-4 py-3 text-gray-300">{fmt(c.createdAt)}</td>
                  <td className="px-4 py-3 text-right">
                    <DeleteClientButton id={c._id} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
