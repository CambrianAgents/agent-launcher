import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Cambrian Agent',
  description: 'Cambrian Agent',
  generator: 'cambrian.wtf',
  icons: {
    icon: '/logo-lime.png',
    shortcut: '/logo-lime.png',
    apple: '/logo-lime.png',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
