import type React from "react"
import type { Metadata } from "next"
import { Inter, Montserrat } from "next/font/google"
import "./globals.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { AuthProvider } from "@/contexts/auth-context"
import { QueryProvider } from "@/providers/query-provider"
import { StoreHydration } from "@/components/providers/store-hydration"

const inter = Inter({ 
  subsets: ["latin"],
  variable: '--font-inter',
  display: 'swap',
})

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: '--font-montserrat',
  display: 'swap',
  weight: ['500', '600', '700', '800'],
})

export const metadata: Metadata = {
  title: "AdoptMe - Find Your Perfect Pet Companion",
  description: "Monito connects you with your perfect pet companion. Browse thousands of adoptable pets from shelters nationwide and find your new best friend today.",
  generator: 'Next.js',
  keywords: ['pet adoption', 'animal shelter', 'adopt a pet', 'rescue animals', 'pet finder'],
  authors: [{ name: 'AdoptMe Pet Adoption' }],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={`${inter.variable} ${montserrat.variable} font-sans antialiased`}>
        <AuthProvider>
          <QueryProvider>
            <StoreHydration />
            <Header />
            <main className="min-h-screen">{children}</main>
            <Footer />
          </QueryProvider>
        </AuthProvider>
      </body>
    </html>
  )
}



import './globals.css'