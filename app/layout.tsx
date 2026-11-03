import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/site-header";
import { SkidFooter } from "@/components/skid-footer";
import { Providers } from "@/components/providers";
import { PresentationPointer } from "@/components/presentation-pointer";

export const metadata: Metadata = {
  title: "Italian Rides — Eighty Years of the Wasp",
  description:
    "Interactive tribute to Vespa milestones 1946–2018: white-frieze timeline, 3D inspection, parts, garage, workshop and clubs.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <PresentationPointer />
          <SiteHeader />
          <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
            {children}
          </main>
          <SkidFooter />
        </Providers>
      </body>
    </html>
  );
}
