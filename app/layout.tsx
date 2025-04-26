import type React from "react"
import type { Metadata } from "next/dist/lib/metadata/types/metadata-interface"
import { Playfair_Display, Lato } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import { AuthProvider } from "@/lib/auth/AuthContext"
import ProtectedRoute from "@/components/ProtectedRoute"

// Define fonts
const playfair = Playfair_Display({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-playfair",
})

const lato = Lato({
  subsets: ["latin"],
  weight: ["100", "300", "400", "700", "900"],
  display: "swap",
  variable: "--font-lato",
})

export const metadata: Metadata = {
  title: "Health Information System",
  description: "A system for managing clients and health programs",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${playfair.variable} ${lato.variable} font-sans`}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <AuthProvider>
            <ProtectedRoute>
              <div className="min-h-screen bg-gradient-to-b from-blue-50 to-teal-50">
                <Navbar />
                <main className="container mx-auto py-4 px-4 md:px-6">{children}</main>
                <Toaster />
              </div>
            </ProtectedRoute>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
