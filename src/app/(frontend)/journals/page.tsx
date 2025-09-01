import Link from 'next/link'
import { getPayload } from 'payload'
import config from '@/payload.config'

type Journal = {
  id: string
  title?: string
  // add other fields if you have them
}

export const dynamic = 'force-dynamic' // or use revalidate if you prefer

export default async function JournalsPage() {
  const payload = await getPayload({ config })

  const { docs } = await payload.find({
    collection: 'journals',
    depth: 0,
    limit: 50,
    pagination: true,
    sort: '-updatedAt',
  })

  const journals = docs as Journal[]

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Journals</h1>
      <ul className="space-y-2">
        {journals.map((j) => (
          <li
            key={j.id}
            className="flex items-center justify-between rounded-md border bg-card px-4 py-3"
          >
            <Link href={`/journals/${j.id}`} className="font-medium hover:underline">
              {j.title ?? '(untitled)'}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  )
}
