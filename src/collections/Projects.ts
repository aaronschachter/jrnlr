import { createdByField } from '@/fields/createdBy'
import type { CollectionConfig } from 'payload'

export const Projects: CollectionConfig = {
  slug: 'projects',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'scope', 'completedOn'],
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    createdByField(),
    {
      name: 'scope',
      type: 'select',
      label: 'Scope',
      options: [
        { label: 'Major', value: 'major' },
        { label: 'Minor', value: 'minor' },
      ],
      required: true,
    },
    {
      name: 'description',
      type: 'textarea',
      label: 'Description',
      admin: {
        rows: 4,
      },
    },
    {
      name: 'warranty',
      type: 'textarea',
      label: 'Warranty',
      admin: {
        rows: 2,
      },
    },
    {
      name: 'completedOn',
      type: 'date',
      label: 'Date Completed',
      admin: {
        date: {
          displayFormat: 'MMM yyyy',
        },
        position: 'sidebar',
      },
    },
    {
      name: 'vendor',
      type: 'relationship',
      relationTo: 'vendors',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'cost',
      type: 'number',
      label: 'Cost ($)',
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'attachments',
      type: 'relationship',
      relationTo: 'media',
      required: false,
      admin: {
        position: 'sidebar',
      },
    },
  ],
}
