import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Research Paper Finder',
  description: 'AI-powered academic paper discovery — find, summarize, and understand relevant papers for your research.',
  keywords: ['research', 'academic', 'papers', 'AI', 'summarizer', 'Google Scholar', 'arXiv'],
  openGraph: {
    title: 'Research Paper Finder',
    description: 'Find and summarize academic papers for your research using AI.',
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
