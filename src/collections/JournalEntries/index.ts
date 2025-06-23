import { populateUser } from '@/hooks/populateUser'
import type { CollectionConfig } from 'payload'
import { generateSummary } from './hooks/generateSummary'

export const JournalEntries: CollectionConfig = {
  slug: 'journal-entries',
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date', 'journal', 'summary'],
  },
  fields: [
    {
      name: 'user',
      type: 'relationship',
      relationTo: 'users',
      required: true,
      admin: {
        hidden: true,
      },
      defaultValue: ({ user }) => user?.id,
      hooks: {
        beforeChange: [populateUser],
      },
    },
    {
      name: 'journal',
      type: 'relationship',
      relationTo: 'journals',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'date',
      type: 'date',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        date: {
          pickerAppearance: 'dayAndTime',
        },
      },
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
      admin: {
        description:
          'Your journal entry for the day. Feel free to reflect freely, or just jot down some quick notes or highlights.',
      },
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => Boolean(siblingData?.summary),
        readOnly: true,
      },
    },
  ],
  hooks: {
    beforeChange: [generateSummary],
  },
}
