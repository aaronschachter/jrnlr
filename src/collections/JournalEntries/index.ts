import type { CollectionConfig } from 'payload'
import { generateSummary } from './hooks/generateSummary'
import { createdByField } from '@/fields/createdBy'

export const JournalEntries: CollectionConfig = {
  slug: 'journal-entries',
  admin: {
    useAsTitle: 'date',
    defaultColumns: ['date', 'journal', 'summary'],
  },
  fields: [
    createdByField(),
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
      name: 'journal',
      type: 'relationship',
      relationTo: 'journals',
      required: true,
    },
    {
      name: 'content',
      type: 'richText',
      required: true,
    },
    {
      name: 'summary',
      type: 'textarea',
      admin: {
        position: 'sidebar',
        condition: (_, siblingData) => Boolean(siblingData?.summary),
        readOnly: true,
        rows: 6,
      },
    },
  ],
  hooks: {
    beforeChange: [generateSummary],
  },
}
