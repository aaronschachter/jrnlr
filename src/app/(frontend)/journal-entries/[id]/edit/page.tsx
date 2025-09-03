import { headers as getHeaders } from 'next/headers'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import Link from 'next/link'

import config from '@/payload.config'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { EntryForm } from '../../EntryForm'
import { updateJournalEntry } from '../../actions'

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function EditJournalEntryPage({ params }: PageProps) {
  const { id } = await params
  const headers = await getHeaders()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers })

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Button variant="ghost" size="sm" asChild>
          <Link href={`/admin/login?redirect=/journals/${encodeURIComponent(id)}/edit`}>Login</Link>
        </Button>
      </div>
    )
  }

  const entry = await payload.findByID({ collection: 'journal-entries', id, depth: 0 })
  if (!entry || (entry as any)?.createdBy !== user.id) notFound()

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

  // Extract plain text from richtext for simple editing
  function extractMarkdown(rich: any): string {
    const nodes = rich?.root?.children ?? []
    const lines: string[] = []

    for (const node of nodes) {
      if (!node) continue
      // list
      if (node.type === 'list' || node.tag === 'ul' || node.tag === 'ol') {
        const ordered = node.listType === 'number' || node.tag === 'ol'
        const kids = Array.isArray(node.children) ? node.children : []
        kids.forEach((li: any) => {
          // extract text inside listitem
          const text = (function walk(n: any): string {
            if (!n) return ''
            if (typeof n.text === 'string') return n.text
            if (Array.isArray(n.children)) return n.children.map(walk).join('')
            return ''
          })(li)
          lines.push(ordered ? `- ${text}` : `- ${text}`)
        })
        lines.push('')
        continue
      }

      // paragraph/other
      const text = (function walk(n: any): string {
        if (!n) return ''
        if (typeof n.text === 'string') return n.text
        if (Array.isArray(n.children)) return n.children.map(walk).join('')
        return ''
      })(node)
      lines.push(text)
      lines.push('')
    }

    // Trim trailing blank lines
    while (lines.length && !lines[lines.length - 1]) lines.pop()
    return lines.join('\n')
  }

  const initial = {
    id: String(entry.id),
    date: entry.date,
    journalId:
      typeof entry.journal === 'string' ? entry.journal : String((entry.journal as any)?.id ?? ''),
    contentText: extractMarkdown(entry.content),
  }

  return (
    <div className="p-8">
      <div className="mb-4 flex items-center justify-between">
        <Button variant="ghost" size="sm" asChild>
          <Link href="/">← Back</Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Edit Journal Entry</CardTitle>
        </CardHeader>

        <CardContent>
          <EntryForm
            journals={journals}
            initial={initial}
            action={updateJournalEntry}
            submitLabel="Save Changes"
          />
        </CardContent>
      </Card>
    </div>
  )
}
