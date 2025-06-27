import { headers as getHeaders } from 'next/headers.js'
import { getPayload } from 'payload'
import React from 'react'

import config from '@/payload.config'
import './styles.css'
import Link from 'next/link'

export default async function HomePage() {
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  let recentEntries = null

  if (user) {
    recentEntries = await payload.find({
      collection: 'journal-entries',
      where: {
        user: {
          equals: user.id,
        },
      },
      sort: '-date',
      limit: 5,
      depth: 1,
    })
  }

  return (
    <div className="home">
      <div className="content">
        {!user && (
          <div className="actions">
            <Link className="new-entry" href="/admin/collections/journal-entries/create">
              ➕ New Journal Entry
            </Link>
          </div>
        )}

        {user && (
          <>
            <div className="actions">
              <Link className="new-entry" href="/admin/collections/journal-entries/create">
                ➕ New Journal Entry
              </Link>
            </div>

            <div className="recent-entries">
              <h2>Recent Journal Entries</h2>
              {recentEntries &&
                recentEntries.docs.map((entry, idx) => (
                  <div key={idx} className="entry-card">
                    <div className="entry-date">
                      {new Date(entry.date).toLocaleDateString(undefined, {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </div>

                    <div className="entry-journal">
                      {typeof entry.journal === 'object' && 'title' in entry.journal
                        ? entry.journal.title
                        : ''}
                    </div>

                    <div className="entry-summary">{entry.summary || 'No summary'}</div>
                  </div>
                ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
