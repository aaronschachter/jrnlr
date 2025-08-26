import type { Field } from 'payload'
import { populateUser } from '@/hooks/populateUser'

export const createdByField = (options: Partial<Field> = {}): Field =>
  ({
    name: 'createdBy',
    type: 'relationship',
    relationTo: 'users',
    required: true,
    admin: { hidden: true },
    defaultValue: ({ user }) => user?.id,
    hooks: {
      beforeChange: [populateUser],
    },
    ...options,
  }) as Field
