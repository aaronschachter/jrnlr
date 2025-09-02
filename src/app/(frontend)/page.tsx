import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import JournalEntries from './journals/JournalEntries'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  const recentEntries = null

  if (user) {
    return (
      <div className="p-8">
        <JournalEntries userId={user.id} />
      </div>
    )
  }

  return (
    <div className="home">
      <div className="content">
        {!user && (
          <div className="p-4">
            <Link href="/admin/login?redirect=/">Login</Link>
          </div>
        )}

        {user && (
          <div className="p-4">
            <div className="actions mb-6">
              <Button asChild>
                <Link href="/admin/collections/journal-entries/create">New entry</Link>
              </Button>
            </div>

            <div className="recent-entries">
              <h2 className="text-lg font-semibold mb-3">Recent Journal Entries</h2>
              {recentEntries &&
                recentEntries.docs.map((entry, idx) => (
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
                          <Link href={`/admin/collections/journal-entries/${(entry as any).id}`}>
                            Open
                          </Link>
                        </Button>
                      )}
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground">
                        {entry.summary || 'No summary'}
                      </p>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
