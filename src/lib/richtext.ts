// Minimal renderer for Payload Lexical rich text JSON to plain text.
// This avoids adding client-side Lexical dependencies for simple display cases.

type UnknownNode = {
  type?: string
  text?: unknown
  children?: UnknownNode[]
  [k: string]: unknown
}

type LexicalJSON = {
  root?: UnknownNode & { children?: UnknownNode[] }
  [k: string]: unknown
}

function walk(node: UnknownNode, parts: string[]) {
  if (!node || typeof node !== 'object') return

  // Text node
  if (typeof node.text === 'string') {
    parts.push(node.text)
  }

  // Recurse children
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, parts)
  }

  // Add line breaks after block-like nodes for readability
  if (node.type === 'paragraph' || node.type === 'linebreak') {
    parts.push('\n')
  }
}

export function lexicalToText(value: LexicalJSON | null | undefined): string {
  if (!value || typeof value !== 'object') return ''
  const parts: string[] = []
  const root = (value as LexicalJSON).root
  if (root) walk(root, parts)
  // Collapse extra whitespace/newlines
  return parts.join('').replace(/\n{3,}/g, '\n\n').trim()
}

