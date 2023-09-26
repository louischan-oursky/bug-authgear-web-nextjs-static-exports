'use client'

import ClientOnly from "./components/ClientOnly";
import "./globals.css";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <ClientOnly>
          <>{children}</>
        </ClientOnly>
      </body>
    </html>
  );
}
