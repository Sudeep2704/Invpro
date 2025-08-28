import Link from "next/link";

export default function AddHome() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-3 gap-8">
        {/* Card 1 */}
        <Link href="/dashboard/clientdash/addclient">
          <div className="border border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center h-48 w-56 hover:shadow-lg transition">
            <img
              src="/circleadd.svg"
              alt="Clients"
              className="w-16 h-16 mb-3"
            />
            <h3 className="text-xl font-semibold text-gray-700">
              Add Client
            </h3>
          </div>
        </Link>

        {/* Card 2 */}
        <Link href="/dashboard/clientdash/viewclient">
          <div className="border border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center h-48 w-56 hover:shadow-lg transition">
            <img
              src="/vieweye.svg"
              alt="Invoice"
              className="w-16 h-16 mb-3"
            />
            <h3 className="text-xl font-semibold text-gray-700">
              View Client
            </h3>
          </div>
        </Link>

        {/* Card 3 */}
        <Link href="/underconst">
          <div className="border border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center h-48 w-56 hover:shadow-lg transition">
            <img
              src="/delete.svg"
              alt="Analytics"
              className="w-16 h-16 mb-3"
            />
            <h3 className="text-xl font-semibold text-gray-700">
              Delete Client 
            </h3>
          </div>
        </Link>
      </div>
    </div>
  );
}
