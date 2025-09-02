"use client"

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'

export default function JournalFilter({
  journals,
  selectedId,
}: {
  journals: Array<{ id: string; title: string }>
  selectedId?: string
}) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function onChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const id = e.target.value
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
    <select
      className="border rounded px-2 py-1 text-sm"
      value={selectedId || ''}
      onChange={onChange}
    >
      <option value="">All journals</option>
      {journals.map(j => (
        <option key={j.id} value={j.id}>
          {j.title}
        </option>
      ))}
    </select>
  )
}

