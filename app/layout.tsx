import type React from "react"
import type { Metadata } from "next"
import { Poppins } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import { VoiceProvider } from "@/components/voice-provider"
import { Toaster } from "@/components/ui/toaster"

const poppins = Poppins({
  weight: ["400", "500", "600", "700", "800"],
  subsets: ["latin"],
})

export const metadata: Metadata = {
  title: "Cook Master AI - Your Voice-Controlled Kitchen Companion",
  description: "Navigate recipes, set timers, and manage your kitchen with voice commands",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={poppins.className}>
        <ThemeProvider attribute="class" defaultTheme="light" enableSystem disableTransitionOnChange>
          <VoiceProvider>
            {children}
            <Toaster />
          </VoiceProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
