import { populateUser } from '@/hooks/populateUser'
import type { CollectionConfig } from 'payload'

export const Journals: CollectionConfig = {
  slug: 'journals',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'description'],
  },
  defaultSort: 'title',
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      defaultValue: ({ user }) => user?.id,
      hooks: {
        beforeChange: [populateUser],
      },
      admin: {
        hidden: true,
      },
    },
    {
      name: 'description',
      type: 'richText',
      required: false,
      admin: {
        description:
          'Optional description of what this journal is for — e.g., a gratitude journal, work tracker, or personal project log.',
      },
    },
  ],
}
