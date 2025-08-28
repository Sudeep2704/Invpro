// app/under-construction/page.tsx
"use client";

import Link from "next/link";

export default function UnderConstructionPage() {
  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
      <section className="rounded-xl p-10 text-center w-full max-w-lg">
        <div className="mb-6 flex justify-center">
          <img
            src="/underconst.svg"
            alt="Under construction illustration"
            className="h-24 w-auto"
          />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">Page Under Construction</h1>
        <p className="text-gray-600 mb-8">
          We’re building this feature. Please check back soon!
        </p>

        <Link
          href="/dashboard"
          className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          Return to Dashboard
        </Link>
      </section>
    </main>
  );
}
