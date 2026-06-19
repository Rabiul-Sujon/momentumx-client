import { DM_Sans } from "next/font/google";
import "./globals.css";

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "MomentumX | Fitness & Gym Management Platform",
  description: "Discover fitness classes, book sessions, and track your fitness journey with MomentumX.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${dmSans.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-base-100 text-white">
        {children}
      </body>
    </html>
  );
}