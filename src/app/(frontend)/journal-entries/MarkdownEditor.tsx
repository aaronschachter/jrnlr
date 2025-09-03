'use client'

import { useEffect, useId, useMemo, useState } from 'react'

function mdToHtml(md: string): string {
  const lines = md.replace(/\r\n?/g, '\n').split('\n')
  const out: string[] = []
  let i = 0
  const esc = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  while (i < lines.length) {
    const line = lines[i]

    // Blank line → paragraph break
    if (!line.trim()) {
      i++
      continue
    }

    // Bullet list: lines starting with - or *
    if (/^\s*[-*]\s+/.test(line)) {
      const items: string[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        items.push(lines[i].replace(/^\s*[-*]\s+/, ''))
        i++
      }
      out.push('<ul>' + items.map((t) => `<li>${esc(t)}</li>`).join('') + '</ul>')
      continue
    }

    // Paragraph: collect until blank line or list start
    const para: string[] = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() !== '' &&
      !/^\s*[-*]\s+/.test(lines[i])
    ) {
      para.push(lines[i])
      i++
    }
    const text = esc(para.join('\n'))
    out.push(`<p>${text}</p>`) // preserve single newlines inside paragraph
  }

  return out.join('\n')
}

export default function MarkdownEditor({
  name,
  defaultValue,
  placeholder,
}: {
  name: string
  defaultValue?: string
  placeholder?: string
}) {
  const [value, setValue] = useState(defaultValue || '')
  const [tab, setTab] = useState<'edit' | 'preview'>('edit')
  const html = useMemo(() => mdToHtml(value), [value])
  const hiddenId = useId()

  useEffect(() => {
    const el = document.getElementById(hiddenId) as HTMLTextAreaElement | null
    if (el) el.value = value
  }, [value, hiddenId])

  return (
    <div className="grid gap-2">
      {/* Tabs header */}
      <div className="flex items-center gap-1 border-b">
        <button
          type="button"
          onClick={() => setTab('edit')}
          aria-selected={tab === 'edit'}
          className={`px-3 py-2 text-sm transition-colors ${
            tab === 'edit'
              ? 'border-b-2 border-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => setTab('preview')}
          aria-selected={tab === 'preview'}
          className={`px-3 py-2 text-sm transition-colors ${
            tab === 'preview'
              ? 'border-b-2 border-foreground font-medium'
              : 'text-muted-foreground hover:text-foreground'
          }`}
        >
          Preview
        </button>
      </div>

      {tab === 'edit' ? (
        <>
          <textarea
            className="min-h-40 rounded-md border bg-background p-3 text-sm"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            placeholder={placeholder}
            aria-label="Content editor"
          />
          <p className="text-xs text-muted-foreground">
            Tip: Start lines with “- ” to make bullet lists.
          </p>
        </>
      ) : (
        <div className="rounded-md border p-3">
          <div className="mb-1 text-xs font-medium text-muted-foreground">Preview</div>
          <div
            className="prose-sm max-w-none [&_ul]:list-disc [&_ul]:ml-5 [&_ol]:list-decimal [&_ol]:ml-5"
            dangerouslySetInnerHTML={{ __html: html }}
          />
        </div>
      )}

      {/* Hidden field submitted with the form */}
      <textarea id={hiddenId} name={name} defaultValue={defaultValue} className="hidden" />
    </div>
  )
}
