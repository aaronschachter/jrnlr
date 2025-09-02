import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import Link from 'next/link'
import JournalEntries from './journals/JournalEntries'
import { Button } from '@/components/ui/button'

type PageProps = {
  searchParams: Promise<{
    journal?: string
  }>
}

export default async function HomePage({ searchParams }: PageProps) {
  const headers = await getHeaders()
  const sp = await searchParams
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  if (user) {
    return (
      <div className="p-8">
        <JournalEntries userId={user.id} journalIdFromSearch={sp?.journal} />
      </div>
    )
  }

  return (
    <div className="flex h-screen items-center justify-center">
      <Button variant="ghost" size="sm" asChild>
        <Link href="/admin/login?redirect=/">Login</Link>
      </Button>
    </div>
  )
}
