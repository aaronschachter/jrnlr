import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getPayload } from 'payload'
import config from '@/payload.config'

export const dynamic = 'force-dynamic'

export default async function JournalDetail({ params }: { params: { id: string } }) {
  const payload = await getPayload({ config })

  const doc = await payload
    .findByID({
      collection: 'journals',
      id: params.id,
      depth: 1,
    })
    .catch(() => null)

  if (!doc) return notFound()

  // If you have an "entries" collection that references this journal,
  // you can also fetch its entries:
  // const entries = await payload.find({
  //   collection: "entries",
  //   where: { journal: { equals: params.id } },
  //   sort: "-date",
  //   limit: 50,
  // })

  return (
    <div className="p-6 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">{doc.title ?? '(untitled journal)'}</h1>
        <Link href="/journals" className="text-sm text-muted-foreground hover:underline">
          Back to journals
        </Link>
      </div>

      <div className="rounded-md border bg-card p-4">
        <div className="text-sm text-muted-foreground mb-2">ID: {doc.id}</div>
        {/* render any fields you have on the journal */}
        {/* <pre className="text-xs whitespace-pre-wrap">{JSON.stringify(doc, null, 2)}</pre> */}
      </div>
    </div>
  )
}
