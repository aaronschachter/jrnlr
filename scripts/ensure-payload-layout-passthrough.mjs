import { readFileSync, writeFileSync, existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, resolve } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const target = resolve(__dirname, '../src/app/(payload)/layout.tsx')

if (!existsSync(target)) {
  // Nothing to do if the file doesn't exist
  process.exit(0)
}

const src = readFileSync(target, 'utf8')

// If it already looks like a passthrough, bail early
if (/=>\s*<>\{children\}<\/>(\s*|);?\s*export default/i.test(src)) {
  process.exit(0)
}

// If the file contains the generated RootLayout usage, replace with passthrough
if (src.includes("from '@payloadcms/next/layouts'") || src.includes('<RootLayout')) {
  const header = `/* THIS FILE WAS GENERATED AUTOMATICALLY BY PAYLOAD. */\n/* DO NOT MODIFY IT BECAUSE IT COULD BE REWRITTEN AT ANY TIME. */\n`
  const next = `${header}import React from 'react'\n\n	type Args = {\n\t  children: React.ReactNode\n\t}\n\n\t// Use the app root layout to provide <html>/<body> and Payload providers.\n\t// This group layout must not render <html> or <body> to avoid nesting.\n\tconst Layout = ({ children }: Args) => <>${'{}'}{children}</>\n\n\texport default Layout\n`

  writeFileSync(target, next, 'utf8')
  console.log('Patched src/app/(payload)/layout.tsx to passthrough to avoid nested <html>.')
  process.exit(0)
}

// Otherwise leave untouched
process.exit(0)

