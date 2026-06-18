import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Chatbot from "@/components/Chatbot";

const geist = Geist({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: { default: "ScholarHub – Find Scholarships for Indian Students", template: "%s | ScholarHub" },
  description: "Discover government, private and international scholarships available for Indian students. Filter by education level, field of study and more.",
  keywords: ["scholarships India", "Indian students scholarships", "government scholarships", "education funding"],
  openGraph: {
    title: "ScholarHub",
    description: "Find scholarships for Indian students",
    type: "website"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geist.className} bg-[#f8f7ff] text-gray-900 antialiased`}>
        <Providers>
          <Navbar />
          <main className="min-h-screen">{children}</main>
          <Footer />
          <Chatbot />
        </Providers>
      </body>
    </html>
  );
}
