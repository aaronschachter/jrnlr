'use client'

import Link from 'next/link'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { ChevronDown, SquarePen } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import type { Journal, JournalEntry } from '@/payload-types'

type Props = {
  entry: JournalEntry & { journal: string | Journal }
}

// Minimal renderer for Payload Lexical JSON or raw HTML strings.
// - If `content` is a string, render it as HTML.
// - If `content` is Lexical JSON, render paragraphs and lists so bullets/numbers appear.
function renderContent(content: any): React.ReactNode {
  // If content is already HTML string, render it as-is
  if (typeof content === 'string') {
    return (
      <div
        className="prose-sm max-w-none [&_ol]:list-decimal [&_ul]:list-disc [&_li]:ml-5"
        dangerouslySetInnerHTML={{ __html: content }}
      />
    )
  }

  const nodes = content?.root?.children ?? []

  function renderNodes(children: any[], keyPrefix = 'n'): React.ReactNode[] {
    return children.map((node, i) => renderNode(node, `${keyPrefix}-${i}`))
  }

  function renderNode(node: any, key: string): React.ReactNode {
    if (!node) return null

    // Text leaf
    if (typeof node.text === 'string') return <span key={key}>{node.text}</span>

    const kids = Array.isArray(node.children) ? renderNodes(node.children, key) : null

    // Lexical list representation
    if (node.type === 'list' || node.tag === 'ul' || node.tag === 'ol') {
      const ordered = node.listType === 'number' || node.tag === 'ol'
      const Tag: any = ordered ? 'ol' : 'ul'
      return (
        <Tag key={key} className={ordered ? 'list-decimal ml-5' : 'list-disc ml-5'}>
          {kids}
        </Tag>
      )
    }

    if (node.type === 'listitem' || node.tag === 'li') {
      return <li key={key}>{kids}</li>
    }

    // Paragraphs
    if (node.type === 'paragraph' || node.tag === 'p') {
      return (
        <p key={key} className="mb-2 whitespace-pre-wrap">
          {kids}
        </p>
      )
    }

    // Headings
    if (node.type === 'heading' && typeof node.tag === 'string') {
      const HTag: any = node.tag
      return <HTag key={key}>{kids}</HTag>
    }

    // Quotes
    if (node.type === 'quote' || node.tag === 'blockquote') {
      return (
        <blockquote key={key} className="border-l-2 pl-3 text-muted-foreground">
          {kids}
        </blockquote>
      )
    }

    // Fallback: just render children
    return <span key={key}>{kids}</span>
  }

  return <div className="prose-sm max-w-none">{renderNodes(nodes)}</div>
}

export default function JournalEntryItem({ entry }: Props) {
  const [open, setOpen] = useState(false)
  const searchParams = useSearchParams()

  const journalTitle =
    typeof entry.journal === 'object' && entry.journal && 'title' in entry.journal
      ? entry.journal.title
      : ''

  const journalId =
    typeof entry.journal === 'object' && entry.journal && 'id' in entry.journal
      ? String(entry.journal.id)
      : typeof entry.journal === 'string'
        ? entry.journal
        : ''

  const isJournalFiltered = Boolean(searchParams?.get('journal'))
  const editItemHref = `/admin/collections/journal-entries/${entry.id}?redirect=/`

  return (
    <Card className="mb-3 group">
      <CardHeader className="flex flex-row flex-wrap items-start justify-between gap-2">
        <div className="flex items-start gap-2">
          <button
            type="button"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="mt-1 inline-flex h-7 w-7 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/50"
            title={open ? 'Hide content' : 'Show content'}
          >
            <ChevronDown
              className={`h-4 w-4 transition-transform ${open ? 'rotate-180' : 'rotate-0'}`}
            />
          </button>

          <div>
            <CardTitle>
              {new Date(entry.date).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </CardTitle>

            <CardDescription>
              {!isJournalFiltered && journalId ? (
                <Link
                  href={`/?journal=${encodeURIComponent(journalId)}`}
                  className="hover:underline underline-offset-2"
                >
                  {journalTitle}
                </Link>
              ) : (
                journalTitle
              )}
            </CardDescription>
          </div>
        </div>

        {'id' in entry && (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-muted-foreground hover:text-foreground"
            asChild
          >
            <Link href={editItemHref} aria-label="Edit entry">
              <SquarePen className="h-4 w-4" />
            </Link>
          </Button>
        )}
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">{entry.summary || 'No summary'}</p>

        {open && (
          <div className="mt-3 border-t pt-3 text-sm">
            {renderContent(entry.content) || 'No content'}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
