import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  admin: {
    useAsTitle: 'email',
  },
  auth: true,
  fields: [
    {
      name: 'bio',
      type: 'richText',
      required: false,
      admin: {
        description: 'Optional description of the journal author.',
      },
    },
  ],
}
