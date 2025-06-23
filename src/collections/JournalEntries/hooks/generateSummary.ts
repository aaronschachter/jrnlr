import type { CollectionBeforeChangeHook } from 'payload'
import OpenAI from 'openai'

const openAIClient = new OpenAI()

function extractTextFromRichText(richText: any): string {
  const blocks = richText?.root?.children ?? []

  function extractFromBlock(block: any): string {
    if (!block) return ''

    if (block.text) return block.text

    if (Array.isArray(block.children)) {
      return block.children.map(extractFromBlock).join(' ')
    }

    return ''
  }

  return blocks.map(extractFromBlock).join('\n').trim()
}

export const generateSummary: CollectionBeforeChangeHook = async ({ data, req }) => {
  if (!data?.content) return data

  const journal =
    typeof data.journal === 'string'
      ? await req.payload.findByID({
          collection: 'journals',
          id: data.journal,
        })
      : data.journal

  const user =
    typeof data.user === 'string'
      ? await req.payload.findByID({
          collection: 'users',
          id: data.user,
        })
      : data.user

  const contentText = extractTextFromRichText(data.content)

  if (!contentText) return ''

  const userBio = user?.bio ? extractTextFromRichText(user.bio) : ''
  const journalDescription = journal?.description
    ? extractTextFromRichText(journal.description)
    : ''
  const fullText = `About me (background):\n${userBio}\n\nJAbout this journal (background):\n${journalDescription}\n\nToday's journal entry (summarize this):\n${contentText}`

  try {
    const response = await openAIClient.chat.completions.create({
      model: 'gpt-4o',
      messages: [
        {
          role: 'system',
          content:
            'You are an assistant that summarizes personal journal entries in 1-2 concise sentences. Focus on the key themes, actions, and reflections expressed by the user. If the entry involves software development or technical work, highlight decisions, tools, and challenges. Do not ask follow-up questions or invite further input. Avoid using a subject like "you" or "the user", just specify main themes.',
        },
        {
          role: 'user',
          content: fullText,
        },
      ],
    })

    const summary = response.choices[0]?.message?.content
    if (summary) {
      data.summary = summary
    }
  } catch (err) {
    console.error('Failed to generate summary:', err)
  }

  return data
}
