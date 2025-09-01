import React from 'react'
import Link from 'next/link'
import './styles.css'

export const metadata = {
  title: 'jrnlr',
}

export default function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <div className="flex min-h-screen">
      {/* Sidebar (desktop only) */}
      <aside className="hidden md:flex w-64 flex-col border-r bg-gray-50 p-4">
        <h1 className="text-2xl font-bold mb-6">jrnlr</h1>
        <nav className="flex flex-col gap-2">
          <Link href="/" className="px-3 py-2 rounded hover:bg-gray-200">
            Dashboard
          </Link>
          <Link href="/journals" className="px-3 py-2 rounded hover:bg-gray-200">
            Journals
          </Link>
          <Link href="/projects" className="px-3 py-2 rounded hover:bg-gray-200">
            Projects
          </Link>
          <Link href="/todos" className="px-3 py-2 rounded hover:bg-gray-200">
            Todos
          </Link>
          <Link href="/documents" className="px-3 py-2 rounded hover:bg-gray-200">
            Documents
          </Link>
        </nav>
      </aside>

      {/* Main content area */}
      <div className="flex-1 min-w-0">
        {/* Add bottom padding so content isn't hidden behind mobile nav */}
        <main className="pb-16 md:pb-0">{children}</main>
      </div>

      {/* Bottom nav (mobile only) */}
      <nav className="fixed bottom-0 left-0 right-0 flex justify-around border-t bg-white p-2 md:hidden">
        <Link href="/" className="flex flex-col items-center text-sm">
          Dashboard
        </Link>
        <Link href="/journals" className="flex flex-col items-center text-sm">
          Journals
        </Link>
        <Link href="/projects" className="flex flex-col items-center text-sm">
          Projects
        </Link>
        <Link href="/documents" className="flex flex-col items-center text-sm">
          Documents
        </Link>
      </nav>
    </div>
  )
}
