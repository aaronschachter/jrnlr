'use client'

import { useEffect, useState } from 'react'
import { useActionState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { EntryForm } from './EntryForm'
import { createJournalEntry } from './actions'

export default function QuickAddDialog({
  journals,
  selectedJournalId,
}: {
  journals: Array<{ id: string; title: string }>
  selectedJournalId?: string
}) {
  const [open, setOpen] = useState(false)
  const router = useRouter()

  type ActionState = { ok?: boolean; error?: string }
  const [state, formAction] = useActionState<ActionState, FormData>(
    async (_prev, formData) => {
      try {
        const res: any = await createJournalEntry(formData)
        return res || { ok: true }
      } catch (e) {
        return { ok: false, error: e instanceof Error ? e.message : 'Failed to save' }
      }
    },
    { ok: false },
  )

  useEffect(() => {
    if (state?.ok) {
      setOpen(false)
      router.refresh()
    }
  }, [state, router])

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Create Entry</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>New Journal Entry</DialogTitle>
        </DialogHeader>

        <EntryForm
          journals={journals}
          initial={{ journalId: selectedJournalId }}
          action={formAction}
          submitLabel="Create Entry"
          inDialog
        />
      </DialogContent>
    </Dialog>
  )
}
