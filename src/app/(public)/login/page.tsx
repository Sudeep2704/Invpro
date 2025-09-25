// app/(public)/login/page.tsx  (server component)
import { Suspense } from "react";
import Landing from "../../LandingPageComponents/login"; // make sure this file starts with "use client"

export default function Page() {
  return (
    <>
      <Suspense fallback={<div>Loading login...</div>}>
        <Landing />
      </Suspense>
    </>
  );
}
