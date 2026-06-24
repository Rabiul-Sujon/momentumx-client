import { DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import AuthProvider from "@/providers/AuthProvider";
import Navbar from "@/components/shared/Navbar";
import Footer from "@/components/shared/Footer";
import QueryProvider from "@/providers/QueryProvider";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "MomentumX | Fitness & Gym Management Platform",
  description: "Discover fitness classes, book sessions, and track your fitness journey with MomentumX.",
  icons: {
    icon: '/favicon.png',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-base-100 text-white">
        <QueryProvider>
        <AuthProvider>
          <Navbar />
         
          {children}
          <Footer />
          <Toaster position="top-right" /> 
        </AuthProvider>
        </QueryProvider>
      </body>
    </html>
  );
}