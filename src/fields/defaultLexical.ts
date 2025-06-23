import {
  BoldFeature,
  ItalicFeature,
  ParagraphFeature,
  lexicalEditor,
  UnderlineFeature,
  OrderedListFeature,
  UnorderedListFeature,
  IndentFeature,
} from '@payloadcms/richtext-lexical'

export const defaultLexical = lexicalEditor({
  features: [
    IndentFeature(),
    ParagraphFeature(),
    OrderedListFeature(),
    UnorderedListFeature(),
    UnderlineFeature(),
    BoldFeature(),
    ItalicFeature(),
  ],
})
