import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

type Props = {
  userId: string
}

export default async function JournalEntries({ userId }: Props) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  const recentEntries = await payload.find({
    collection: 'journal-entries',
    where: {
      createdBy: {
        equals: userId,
      },
    },
    sort: '-date',
    limit: 5,
    depth: 1,
  })

  return (
    <div className="recent-entries">
      <h2 className="text-lg font-semibold mb-3">Recent Journal Entries</h2>
      {recentEntries.docs.map((entry, idx) => (
        <Card key={idx} className="mb-3">
          <CardHeader className="flex flex-row items-start justify-between gap-2">
            <div>
              <CardTitle>
                {new Date(entry.date).toLocaleDateString(undefined, {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </CardTitle>
              <CardDescription>
                {typeof entry.journal === 'object' && 'title' in entry.journal
                  ? entry.journal.title
                  : ''}
              </CardDescription>
            </div>
            {'id' in entry && (
              <Button variant="ghost" size="sm" asChild>
                <Link href={`/admin/collections/journal-entries/${(entry as any).id}`}>Open</Link>
              </Button>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">{entry.summary || 'No summary'}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
