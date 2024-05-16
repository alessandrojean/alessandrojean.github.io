import type { BuiltinLanguage, HighlighterCore, LanguageRegistration, SpecialLanguage } from 'shiki'
import { getHighlighterCore } from 'shiki'

import getWasm from 'shiki/wasm'

import assGrammar from '@/util/ass.tmLanguage.json'
import cabalGrammar from '@/util/cabal.tmLanguage.json'

const highlighter = ref<HighlighterCore>()

export type ShikiLanguage = BuiltinLanguage | SpecialLanguage | 'ass' | 'cabal'

export default async function useShiki(): Promise<HighlighterCore> {
  if (highlighter.value) {
    return highlighter.value
  }

  highlighter.value = await getHighlighterCore({
    themes: [
      import('shiki/themes/vitesse-dark.mjs'),
      import('shiki/themes/vitesse-light.mjs')
    ],
    langs: [
      import('shiki/langs/json.mjs'),
      import('shiki/langs/yaml.mjs'),
      import('shiki/langs/js.mjs'),
      import('shiki/langs/ts.mjs'),
      import('shiki/langs/tsx.mjs'),
      import('shiki/langs/css.mjs'),
      import('shiki/langs/shell.mjs'),
      import('shiki/langs/html.mjs'),
      import('shiki/langs/md.mjs'),
      import('shiki/langs/yaml.mjs'),
      import('shiki/langs/vue-html.mjs'),
      import('shiki/langs/bash.mjs'),
      import('shiki/langs/c.mjs'),
      import('shiki/langs/cpp.mjs'),
      import('shiki/langs/latex.mjs'),
      import('shiki/langs/java.mjs'),
      import('shiki/langs/haskell.mjs'),
      import('shiki/langs/markdown.mjs'),
      import('shiki/langs/console.mjs'),
      import('shiki/langs/ini.mjs'),
      assGrammar as any as LanguageRegistration,
      cabalGrammar as any as LanguageRegistration,
    ],
    langAlias: {
      'c++': 'cpp',
      h: 'c',
    },
    loadWasm: getWasm,
  })

  return highlighter.value
}
