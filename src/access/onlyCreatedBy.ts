import type { Access } from 'payload'

export const onlyCreatedBy: Access = ({ req: { user } }) => {
  if (!user) return false
  return {
    createdBy: {
      equals: user.id,
    },
  }
}

export const loggedInOnly: Access = ({ req: { user } }) => !!user
