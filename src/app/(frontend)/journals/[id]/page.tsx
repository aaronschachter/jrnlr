import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'
import { RichText } from '@payloadcms/richtext-lexical/react'
import { ChevronDown } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function JournalDetail({ params }: { params: { id: string } }) {
  const payload = await getPayload({ config })

  const doc = await payload
    .findByID({
      collection: 'journals',
      id: params.id,
      depth: 1,
    })
    .catch(() => null)

  if (!doc) return notFound()

  // If you have an "entries" collection that references this journal,
  // you can also fetch its entries:
  const entries = await payload.find({
    collection: 'journal-entries',
    where: { journal: { equals: params.id } },
    sort: '-date',
    limit: 50,
  })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-semibold">{doc.title ?? '(untitled journal)'}</h1>

        <Link href="/journals" className="text-sm text-muted-foreground hover:underline">
          Back to journals
        </Link>
      </div>

      <div className="rounded-md border bg-card p-4">
        {doc?.description && (
          <div className="mb-4 prose prose-base md:prose-lg max-w-none text-muted-foreground dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:mt-2 prose-headings:mb-1 prose-hr:my-2 prose-blockquote:my-2 prose-table:my-2">
            <RichText data={doc.description as any} />
          </div>
        )}

        <section>
          <h2 className="text-2xl font-semibold mb-3">Entries</h2>
          {entries?.docs?.length ? (
            <ul className="space-y-2">
              {entries.docs.map((entry: any) => {
                const dateLabel = entry?.date ? new Date(entry.date).toLocaleString() : '(no date)'

                return (
                  <li key={entry.id} className="rounded-md border bg-card p-4">
                    <div className="flex items-center justify-between">
                      <div className="font-medium">{dateLabel}</div>
                    </div>

                    {entry?.summary && (
                      <p className="text-base md:text-lg text-muted-foreground mt-2 whitespace-pre-wrap leading-relaxed">
                        {entry.summary}
                      </p>
                    )}

                    {entry?.content && (
                      <details className="mt-3 group">
                        <summary
                          aria-label="Toggle details"
                          className="flex w-full items-center justify-end cursor-pointer select-none marker:hidden"
                        >
                          <span className="sr-only">Toggle details</span>
                          <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 ease-out group-open:rotate-180" />
                        </summary>
                        {/* Smooth expand/collapse using CSS grid rows trick */}
                        <div className="grid transition-all duration-300 ease-out grid-rows-[0fr] group-open:grid-rows-[1fr]">
                          <div className="overflow-hidden">
                            <div className="opacity-0 translate-y-1 transition-all duration-300 ease-out group-open:opacity-100 group-open:translate-y-0">
                              <div className="mt-2 rounded-md border bg-popover p-3">
                                <div className="text-xs uppercase tracking-wide text-muted-foreground mb-2">
                                  Full entry
                                </div>
                                <div className="prose prose-base md:prose-lg max-w-none dark:prose-invert prose-p:my-1 prose-ul:my-1 prose-ol:my-1 prose-li:my-0.5 prose-headings:mt-2 prose-headings:mb-1 prose-hr:my-2 prose-blockquote:my-2 prose-table:my-2">
                                  <RichText data={entry.content as any} />
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </details>
                    )}
                  </li>
                )
              })}
            </ul>
          ) : (
            <p className="text-sm text-muted-foreground">No entries yet.</p>
          )}
        </section>
      </div>
    </div>
  )
}
