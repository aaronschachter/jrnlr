import { createdByField } from '@/fields/createdBy'
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
    createdByField(),
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
