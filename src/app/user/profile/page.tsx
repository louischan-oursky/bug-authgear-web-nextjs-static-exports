"use client";

import { useAppContextInner } from "@/context/ClientAuthContext";
import { useEffect } from "react";

export default function Home() {
  const { startAuth } = useAppContextInner();
  useEffect(() => {
    // console.log(authgear);
  }, []);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      profile
      <button onClick={startAuth}>
        start auth
      </button>
    </main>
  );
}
