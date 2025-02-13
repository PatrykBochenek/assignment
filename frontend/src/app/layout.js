import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Pluto Data Tech Assignment: Cricket Analytics",
  description: "Cricket match simulation and analysis dashboard",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased min-h-full bg-gray-50`}>
        <div className="min-h-screen flex flex-col">
          <header className="bg-white border-b border-gray-200">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <span className="text-xl font-semibold text-gray-900">Pluto Data Tech Assignment: Cricket Analytics</span>
                </div>
              </div>
            </nav>
          </header>
          <main className="flex-1">
            {children}
          </main>
          <footer className="bg-white border-t border-gray-200">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-12 items-center justify-center">
                <span className="text-sm text-gray-500">© 2025 Patryk Bochenek. All rights reserved (whatever this means).</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}