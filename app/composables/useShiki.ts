import type { BuiltinLanguage, HighlighterCore, LanguageRegistration, SpecialLanguage } from 'shiki';
import { createHighlighterCore } from 'shiki/core';
import { createOnigurumaEngine } from 'shiki/engine/oniguruma'

import assGrammar from '@/composables/shiki/ass.tmLanguage.json';
import cabalGrammar from '@/composables/shiki/cabal.tmLanguage.json';

const highlighter = ref<HighlighterCore>();

export type ShikiLanguage = BuiltinLanguage | SpecialLanguage | 'cabal' | 'ass'

export async function useShiki(): Promise<HighlighterCore> {
  if (highlighter.value) {
    return highlighter.value;
  }

  highlighter.value = await createHighlighterCore({
    themes: [
      import('shiki/themes/github-dark-default.mjs'),
      import('shiki/themes/github-light-default.mjs'),
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
      cabalGrammar as unknown as LanguageRegistration,
      assGrammar as unknown as LanguageRegistration,
    ],
    langAlias: {
      'c++': 'cpp',
      h: 'c',
      cu: 'cpp',
    },
    engine: createOnigurumaEngine(() => import('shiki/wasm')),
  });

  return highlighter.value;
}
