import { createdByField } from '@/fields/createdBy'
import type { CollectionConfig } from 'payload'

export const Vendors: CollectionConfig = {
  slug: 'vendors',
  admin: {
    useAsTitle: 'name',
    defaultColumns: ['name', 'phone', 'email'],
  },
  fields: [
    {
      name: 'name',
      type: 'text',
      required: true,
      label: 'Name',
    },
    createdByField(),
    {
      name: 'phone',
      type: 'text',
      label: 'Phone',
    },
    {
      name: 'email',
      type: 'email',
      label: 'Email',
    },
    {
      name: 'url',
      type: 'text',
      label: 'URL',
    },
  ],
}
