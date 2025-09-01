import Link from 'next/link'

type Journal = { id: string; title: string; count?: number }

// TODO: replace with Payload fetch:
// const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/journals?limit=50`, { cache: 'no-store' })
async function getJournals(): Promise<Journal[]> {
  return [
    { id: 'gratitude', title: 'Gratitude', count: 124 },
    { id: 'work-log', title: 'Work Log', count: 57 },
  ]
}

export default async function JournalsPage() {
  const journals = await getJournals()
  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Journals</h1>
      <ul className="space-y-2">
        {journals.map((j) => (
          <li
            key={j.id}
            className="flex items-center justify-between rounded-md border bg-card px-4 py-3"
          >
            <Link className="font-medium hover:underline" href={`/journals/${j.id}`}>
              {j.title}
            </Link>
            {j.count != null && (
              <span className="text-sm text-muted-foreground">{j.count} entries</span>
            )}
          </li>
        ))}
      </ul>
    </div>
  )
}
