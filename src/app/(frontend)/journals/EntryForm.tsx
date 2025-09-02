'use client'

import { Button } from '@/components/ui/button'
import { useFormStatus } from 'react-dom'
import MarkdownEditor from './MarkdownEditor'

type JournalOption = { id: string; title: string }

export function EntryForm({
  journals,
  initial,
  action,
  submitLabel = 'Save',
  inDialog = false,
}: {
  journals: JournalOption[]
  initial?: { id?: string; date?: string; journalId?: string; contentText?: string }
  action: (formData: FormData) => Promise<void>
  submitLabel?: string
  inDialog?: boolean
}) {
  function SubmitBtn({ label }: { label: string }) {
    const { pending } = useFormStatus()
    return (
      <Button type="submit" disabled={pending}>
        {pending ? 'Saving…' : label}
      </Button>
    )
  }

  // Format date string for datetime-local input
  const toLocalInput = (iso?: string) => {
    if (!iso) return ''
    try {
      const d = new Date(iso)
      const pad = (n: number) => String(n).padStart(2, '0')
      const yyyy = d.getFullYear()
      const mm = pad(d.getMonth() + 1)
      const dd = pad(d.getDate())
      const hh = pad(d.getHours())
      const mi = pad(d.getMinutes())
      return `${yyyy}-${mm}-${dd}T${hh}:${mi}`
    } catch {
      return ''
    }
  }

  return (
    <form action={action} className="space-y-4">
      {inDialog ? <input type="hidden" name="clientModal" value="1" /> : null}
      {initial?.id ? <input type="hidden" name="id" defaultValue={initial.id} /> : null}

      <div className="grid gap-1">
        <label htmlFor="journal" className="text-sm font-medium">
          Journal
        </label>
        <select
          id="journal"
          name="journal"
          className="h-9 rounded-md border bg-background px-3 text-sm"
          defaultValue={initial?.journalId || ''}
          required
        >
          <option value="" disabled>
            Select a journal
          </option>
          {journals.map((j) => (
            <option key={j.id} value={j.id}>
              {j.title || '(No title)'}
            </option>
          ))}
        </select>
      </div>

      <div className="grid gap-1">
        <label htmlFor="date" className="text-sm font-medium">
          Date
        </label>
        <input
          id="date"
          name="date"
          type="datetime-local"
          className="h-9 rounded-md border bg-background px-3 text-sm"
          defaultValue={toLocalInput(initial?.date) || toLocalInput(new Date().toISOString())}
          required
        />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium">Content</label>
        <MarkdownEditor
          name="contentText"
          defaultValue={initial?.contentText || ''}
          placeholder="Write your entry... Use '- ' for bullets."
        />
      </div>

      <div className="pt-2">
        <SubmitBtn label={submitLabel} />
      </div>
    </form>
  )
}
