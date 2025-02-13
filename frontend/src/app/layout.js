import { Geist, Geist_Mono } from "next/font/google";
import Image from "next/image";
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
          <header className="bg-gray-900">
            <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex h-16 items-center justify-between">
                <div className="flex items-center">
                  <div className="relative h-8 w-32">
                    <Image
                      src="/logo.png"
                      alt="Pluto Data Tech Logo"
                      fill
                      className="object-contain"
                      priority
                    />
                  </div>
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
                <span className="text-sm text-gray-500">© 2025 Patryk Bochenek. All rights reserved.</span>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}