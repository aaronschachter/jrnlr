import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import JournalFilter from './JournalFilter'
import JournalEntryItem from './JournalEntryItem'

type Props = {
  userId: string
  journalIdFromSearch?: string
}

export default async function JournalEntries({ userId, journalIdFromSearch }: Props) {
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })

  // Fetch journals for filter UI
  const journalsRes = await payload.find({
    collection: 'journals',
    where: {
      createdBy: { equals: userId },
    },
    sort: 'title',
    limit: 100,
    depth: 0,
  })

  const where: any = {
    createdBy: { equals: userId },
  }

  if (journalIdFromSearch) {
    where.journal = { equals: journalIdFromSearch }
  }

  const recentEntries = await payload.find({
    collection: 'journal-entries',
    where,
    sort: '-date',
    limit: 100,
    depth: 1,
  })

  return (
    <div>
      <div className="flex items-center justify-between gap-2 mb-3">
        <h2 className="text-lg font-semibold">Journals</h2>

        <div className="flex items-center gap-2">
          <JournalFilter
            journals={journalsRes.docs.map((j) => ({
              id: typeof j.id === 'string' ? j.id : String(j.id),
              title: j.title,
            }))}
            selectedId={journalIdFromSearch}
          />

          <Button asChild>
            <Link
              href={`/admin/collections/journal-entries/create?redirect=%2F${journalIdFromSearch ? `&journal=${encodeURIComponent(journalIdFromSearch)}` : ''}`}
            >
              Create Entry
            </Link>
          </Button>
        </div>
      </div>

      {recentEntries.docs.map((entry, idx) => (
        <JournalEntryItem key={idx} entry={entry} />
      ))}
    </div>
  )
}
