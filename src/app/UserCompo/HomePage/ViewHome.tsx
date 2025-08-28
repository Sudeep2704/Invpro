import Link from "next/link";

export default function AddHome() {
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="grid grid-cols-3 gap-8">
        {/* Card 1 */}
        <Link href="/dashboard/viewhome/viewinv">
          <div className="border border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center h-48 w-56 hover:shadow-lg transition">
            <img
              src="/vieweye.svg"
              alt="Clients"
              className="w-16 h-16 mb-3"
            />
            <h3 className="text-xl font-semibold text-gray-700">
              View Saved Invoice
            </h3>
          </div>
        </Link>

        {/* Card 2 */}
        <Link href="/underconst">
          <div className="border border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center h-48 w-56 hover:shadow-lg transition">
            <img
              src="/addbills.svg"
              alt="Invoice"
              className="w-16 h-16 mb-3"
            />
            <h3 className="text-xl font-semibold text-gray-700">
              View Saved Bills
            </h3>
          </div>
        </Link>

        {/* Card 3 */}
        <Link href="/underconst">
          <div className="border border-gray-400 rounded-lg p-6 flex flex-col items-center justify-center text-center h-48 w-56 hover:shadow-lg transition">
            <img
              src="/personsee.svg"
              alt="view employee"
              className="w-16 h-16 mb-3"
            />
            <h3 className="text-xl font-semibold text-gray-700">
              View Employee 
            </h3>
          </div>
        </Link>
      </div>
    </div>
  );
}
