import { headers as getHeaders } from 'next/headers'
import { getPayload } from 'payload'
import Link from 'next/link'

import config from '@/payload.config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EntryForm } from '../EntryForm'
import { createJournalEntry } from '../actions'

type PageProps = {
  searchParams: Promise<{ journal?: string }>
}

export default async function NewJournalEntryPage({ searchParams }: PageProps) {
  const sp = await searchParams
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/admin/login?redirect=/journals/new">Login</Link>
        </Button>
      </div>
    )
  }

  const journalsRes = await payload.find({
    collection: 'journals',
    where: { createdBy: { equals: user.id } },
    sort: 'title',
    limit: 100,
    depth: 0,
  })

  const journals = journalsRes.docs.map((j) => ({
    id: typeof j.id === 'string' ? j.id : String(j.id),
    title: j.title,
  }))

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">← Back</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>New Journal Entry</CardTitle>
        </CardHeader>

        <CardContent>
          <EntryForm
            journals={journals}
            initial={{ journalId: sp?.journal }}
            action={createJournalEntry}
            submitLabel="Create Entry"
          />
        </CardContent>
      </Card>
    </div>
  )
}
