import type { FieldHook } from 'payload'

export const populateUser: FieldHook = ({ req, value }) => {
  if (value) return value

  if (req.user) return req.user.id

  return value
}
