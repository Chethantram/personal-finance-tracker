import {Outfit } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { ClerkProvider } from "@clerk/nextjs";
import { Toaster } from "@/components/ui/sonner";

const outfit = Outfit({
  weight:['100','200','300','400','500','600','700','800'],
  subsets: ["latin"],
});


export const metadata = {
  title: "CTR-Finance",
  description: "Finance Management",
};

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${outfit.className} antialiased text-gray-800`}
      >
        <Header/>
        <main className="min-h-screen ">

        {children}
        <Toaster richColors/>
        </main>
        <Footer/>
      </body>
    </html>
    </ClerkProvider>
  );
}
