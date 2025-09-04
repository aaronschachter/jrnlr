'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

export default function JournalFilter({
  journals,
  selectedId,
}: {
  journals: Array<{ id: string; title: string }>
  selectedId?: string
}) {
  const ALL_VALUE = '__all__'
  const router = useRouter()
  const searchParams = useSearchParams()

  function onValueChange(id: string) {
    const params = new URLSearchParams(searchParams?.toString())

    if (!id) {
      params.delete('journal')
    } else {
      params.set('journal', id)
    }
    const query = params.toString()
    router.push(query ? `/?${query}` : '/')
  }

  return (
    <Select
      value={selectedId ?? ALL_VALUE}
      onValueChange={(val) => onValueChange(val === ALL_VALUE ? '' : val)}
    >
      <SelectTrigger size="sm" className="w-full sm:w-48 max-w-full">
        <SelectValue placeholder="All journals" className="truncate" />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value={ALL_VALUE}>All journals</SelectItem>

        {journals.map((j) => (
          <SelectItem key={j.id} value={j.id}>
            {j.title ?? '(No title)'}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}
