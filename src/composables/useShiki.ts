import { getHighlighter, Highlighter, LanguageRegistration } from 'shiki'

import assGrammar from '@/util/ass.tmLanguage.json'

const highlighter = ref<Highlighter>()

function createAssGrammar(): LanguageRegistration {
  return {
    ...assGrammar as any as LanguageRegistration,
    name: 'ass',
    scopeName: 'source.ass',
    aliases: ['aegisub', 'ssa'],
  }
}

export default async function useShiki(): Promise<Highlighter> {
  if (highlighter.value) {
    return highlighter.value
  }

  highlighter.value = await getHighlighter({
    themes: ['nord'],
    langs: [
      'json',
      'yaml',
      'js',
      'ts',
      'tsx',
      'css',
      'shell',
      'html',
      'md',
      'yaml',
      'vue-html',
      'bash',
      'c',
      'cpp',
      'latex',
      'java',
      'haskell',
      'markdown',
      createAssGrammar()
    ]
  })

  return highlighter.value
}
