import { getHighlighter, Highlighter, ILanguageRegistration } from 'shiki-es'

import assGrammar from '@/util/ass.tmLanguage.json'

const highlighter = ref<Highlighter>()

function createAssGrammar(): ILanguageRegistration {
  return {
    id: 'ass',
    scopeName: 'source.ass',
    grammar: assGrammar,
    aliases: ['aegisub', 'ssa']
  }
}

export default async function useShiki(): Promise<Highlighter> {
  if (highlighter.value) {
    return highlighter.value
  }

  highlighter.value = await getHighlighter({
    theme: 'nord',
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
      'java'
    ]
  })

  await highlighter.value.loadLanguage(createAssGrammar())

  return highlighter.value
}
