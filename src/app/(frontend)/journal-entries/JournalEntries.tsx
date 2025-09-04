import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import JournalFilter from './JournalFilter'
import JournalEntryItem from './JournalEntryItem'
import QuickAddDialog from './QuickAddDialog'

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
      <div className="mb-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
        <h2 className="text-lg font-semibold">Journals</h2>

        <div className="flex w-full flex-col items-stretch gap-2 sm:w-auto sm:flex-row sm:items-center">
          <JournalFilter
            journals={journalsRes.docs.map((j) => ({
              id: typeof j.id === 'string' ? j.id : String(j.id),
              title: j.title,
            }))}
            selectedId={journalIdFromSearch}
          />

          <QuickAddDialog
            journals={journalsRes.docs.map((j) => ({
              id: typeof j.id === 'string' ? j.id : String(j.id),
              title: j.title,
            }))}
            selectedJournalId={journalIdFromSearch}
          />
        </div>
      </div>

      {recentEntries.docs.map((entry, idx) => (
        <JournalEntryItem key={idx} entry={entry} />
      ))}
    </div>
  )
}
