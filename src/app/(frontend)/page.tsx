import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import React from 'react'
import config from '@/payload.config'
import Link from 'next/link'
import Dashboard from './dashboard/Dashboard'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh] p-6">
        <Link
          className="px-4 py-2 rounded bg-gray-900 text-white hover:bg-gray-800"
          href="/admin/login?redirect=/"
        >
          Login
        </Link>
      </div>
    )
  }

  return <Dashboard />
}
