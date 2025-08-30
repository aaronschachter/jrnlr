import { createdByField } from '@/fields/createdBy'
import type { CollectionConfig } from 'payload'

export const Todos: CollectionConfig = {
  slug: 'todos',
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
      name: 'journal',
      type: 'relationship',
      relationTo: 'journals',
      required: false,
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: false,
    },
    {
      name: 'description',
      type: 'richText',
      required: false,
    },
  ],
}
