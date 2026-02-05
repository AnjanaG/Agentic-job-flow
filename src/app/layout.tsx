import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Job Search Agent',
  description: 'AI-powered job search assistant',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">{children}</body>
    </html>
  )
}
