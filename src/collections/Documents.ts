import { createdByField } from '@/fields/createdBy'
import type { CollectionConfig } from 'payload'

export const Documents: CollectionConfig = {
  slug: 'documents',
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
    },
    createdByField(),
    {
      name: 'url',
      type: 'text',
      label: 'External URL',
      admin: {
        description: 'Link to Dropbox/Google Drive/etc if not uploading directly',
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: false,
    },
    {
      name: 'notes',
      type: 'textarea',
    },
  ],
  upload: true,
}
