import { mongooseAdapter } from '@payloadcms/db-mongodb'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'
import { Media } from './collections/Media'
import { Users } from './collections/Users'
import { Quotes } from './collections/Quotes'
import { Vendors } from './collections/Vendors'
import { Journals } from './collections/Journals'
import { Projects } from './collections/Projects'
import { Documents } from './collections/Documents'
import { JournalEntries } from './collections/JournalEntries'
import { defaultLexical } from './fields/defaultLexical'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    dateFormat: 'MMM d, yyyy',
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
    meta: {
      titleSuffix: '| jrnlr',
    },
  },
  collections: [Documents, Journals, JournalEntries, Media, Projects, Quotes, Users, Vendors],
  editor: defaultLexical,
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: mongooseAdapter({
    url: process.env.DATABASE_URI || '',
  }),
  sharp,
  plugins: [
    vercelBlobStorage({
      enabled: true,
      collections: {
        documents: true,
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
