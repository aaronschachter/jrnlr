'use client'

import * as React from 'react'
import { UploadHandlersProvider } from '@payloadcms/ui/providers/UploadHandlers'

// Empty handlers are fine; you can wire real ones later.
export default function Template({ children }: { children: React.ReactNode }) {
  return <UploadHandlersProvider>{children}</UploadHandlersProvider>
}
