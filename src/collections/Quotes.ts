import { createdByField } from '@/fields/createdBy'
import type { CollectionConfig } from 'payload'

export const Quotes: CollectionConfig = {
  slug: 'quotes',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['project', 'submittedBy', 'estimatedCost'],
  },
  fields: [
    createdByField(),
    {
      name: 'title',
      type: 'text',
      admin: { hidden: true },
      hooks: {
        beforeChange: [
          async ({ data, req }) => {
            if (!data) {
              return data
            }

            const projectDoc = await req.payload.findByID({
              collection: 'projects',
              id: data.project,
            })
            const vendorDoc = await req.payload.findByID({
              collection: 'vendors',
              id: data.submittedBy,
            })

            return `${projectDoc.title}: ${vendorDoc.name}`
          },
        ],
      },
    },
    {
      name: 'project',
      type: 'relationship',
      relationTo: 'projects',
      required: true,
    },
    {
      name: 'submittedBy',
      type: 'relationship',
      label: 'Submitted By',
      relationTo: 'vendors',
      required: true,
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'submittedOn',
      type: 'date',
      label: 'Submitted On',
      required: true,
      defaultValue: () => new Date(),
      admin: {
        position: 'sidebar',
      },
    },
    {
      name: 'estimatedCost',
      type: 'number',
      required: true,
      label: 'Estimated Cost ($)',
    },
    {
      name: 'attachments',
      type: 'relationship',
      relationTo: 'media',
      hasMany: true,
    },
  ],
}
