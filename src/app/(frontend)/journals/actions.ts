"use server"

import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'
import { getPayload } from 'payload'

import config from '@/payload.config'

function toISO(dateLocal: string | null): string | undefined {
  if (!dateLocal) return undefined
  // dateLocal is like "2025-09-01T12:34"
  try {
    const d = new Date(dateLocal)
    if (isNaN(d.getTime())) return undefined
    return d.toISOString()
  } catch {
    return undefined
  }
}

function lexFromMarkdown(md: string): any {
  const lines = (md || '').replace(/\r\n?/g, '\n').split('\n')
  const children: any[] = []
  let i = 0

  const makeText = (text: string) => ({
    type: 'text',
    text,
    detail: 0,
    format: 0,
    mode: 'normal',
    style: '',
    version: 1,
  })

  const makeParagraph = (text: string) => ({
    type: 'paragraph',
    format: '',
    indent: 0,
    direction: null,
    version: 1,
    children: [makeText(text)],
  })

  while (i < lines.length) {
    // skip blank lines
    if (!lines[i].trim()) {
      i++
      continue
    }

    // bullet list
    if (/^\s*[-*]\s+/.test(lines[i])) {
      const items: any[] = []
      while (i < lines.length && /^\s*[-*]\s+/.test(lines[i])) {
        const text = lines[i].replace(/^\s*[-*]\s+/, '')
        items.push({
          type: 'listitem',
          value: 1,
          format: '',
          indent: 0,
          direction: null,
          version: 1,
          children: [makeParagraph(text)],
        })
        i++
      }
      children.push({ type: 'list', listType: 'bullet', format: '', indent: 0, direction: null, version: 1, children: items })
      continue
    }

    // paragraph: collect until blank or list start, preserving single newlines by joining with \n
    const para: string[] = [lines[i]]
    i++
    while (i < lines.length && lines[i].trim() && !/^\s*[-*]\s+/.test(lines[i])) {
      para.push(lines[i])
      i++
    }
    children.push(makeParagraph(para.join('\n')))
  }

  return {
    root: {
      type: 'root',
      format: '',
      indent: 0,
      direction: 'ltr',
      version: 1,
      children,
    },
  }
}

export async function createJournalEntry(formData: FormData) {
  const headersList = await headers()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) redirect('/admin/login?redirect=/journals/new')

  const journalId = String(formData.get('journal') || '')
  const dateLocal = (formData.get('date') as string) || ''
  const contentText = (formData.get('contentText') as string) || ''
  const clientModal = String(formData.get('clientModal') || '') === '1'

  if (!journalId) throw new Error('Journal is required')

  await payload.create({
    collection: 'journal-entries',
    data: {
      date: toISO(dateLocal) || new Date().toISOString(),
      journal: journalId,
      content: lexFromMarkdown(contentText),
      createdBy: user.id,
    },
  })

  revalidatePath('/')
  if (journalId) revalidatePath(`/?journal=${encodeURIComponent(journalId)}`)
  if (clientModal) {
    return { ok: true }
  }
  redirect(journalId ? `/?journal=${encodeURIComponent(journalId)}` : '/')
}

export async function updateJournalEntry(formData: FormData) {
  const headersList = await headers()
  const payloadConfig = await config
  const payload = await getPayload({ config: payloadConfig })
  const { user } = await payload.auth({ headers: headersList })

  if (!user) redirect('/admin/login?redirect=/')

  const id = String(formData.get('id') || '')
  const journalId = String(formData.get('journal') || '')
  const dateLocal = (formData.get('date') as string) || ''
  const contentText = (formData.get('contentText') as string) || ''

  if (!id) throw new Error('Missing entry id')
  if (!journalId) throw new Error('Journal is required')

  await payload.update({
    collection: 'journal-entries',
    id,
    data: {
      date: toISO(dateLocal) || new Date().toISOString(),
      journal: journalId,
      content: lexFromMarkdown(contentText),
      createdBy: user.id,
    },
  })

  revalidatePath('/')
  if (journalId) revalidatePath(`/?journal=${encodeURIComponent(journalId)}`)
  redirect(journalId ? `/?journal=${encodeURIComponent(journalId)}` : '/')
}
