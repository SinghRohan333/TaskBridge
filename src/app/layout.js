import { Inter } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "./globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata = {
  title: "TaskBridge",
  description: "Get your tasks done by skilled freelancers",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-full flex flex-col antialiased">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <ToastContainer position="top-right" autoClose={4000} theme="light" />
      </body>
    </html>
  );
}
