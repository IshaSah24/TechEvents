import React, { Suspense } from "react";
import LoginClient from "./LoginClient";

export default function Page() {
  return (
    <main className="min-h-screen flex items-center justify-center p-4 z-1">
      <Suspense fallback={<div className="p-6">Loading…</div>}>
        <LoginClient />
      </Suspense>
    </main>
  );
}
