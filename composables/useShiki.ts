import { getHighlighter, Highlighter } from 'shiki-es'

const highlighter = ref<Highlighter>()

export default async function useShiki(): Promise<Highlighter> {
  if (highlighter.value) {
    return highlighter.value
  }

  highlighter.value = await getHighlighter({
    theme: 'nord',
    langs: [
      'json',
      'js',
      'ts',
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

  return highlighter.value
}
