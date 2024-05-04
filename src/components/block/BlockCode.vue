<script setup lang="ts">
import type { NotionBlockProps } from '@/composables/useNotionParser';
import type { ShikiLanguage } from '@/composables/useShiki';
import type { Language, NotionApi } from '@/lib/notion';
import { Square2StackIcon } from '@heroicons/vue/24/outline';
import {
transformerNotationDiff,
transformerNotationErrorLevel,
transformerNotationHighlight,
} from '@shikijs/transformers';
import type { HighlighterCore } from 'shiki';

type CodeBlock = NotionApi.CodeBlockObjectResponse | NotionApi.EquationBlockObjectResponse

interface Props extends NotionBlockProps {
  overrideLang?: Language | string;
  overrideLangClass?: string;
}

const props = withDefaults(defineProps<Props>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block, getTextContent } = useNotionParser<CodeBlock>(toRefs(props))

const lang = computed<ShikiLanguage>(() => {
  if (fileExtension.value) {
    return fileExtension.value as ShikiLanguage
  }

  return props.overrideLang ?? 
    block.value.type === 'equation' ? 'latex' : block.value.code.language as ShikiLanguage
})

const langClass = computed(() => props.overrideLangClass ?? `language-${lang.value}`)

const highlighter = inject<HighlighterCore>('highlighter')
const supported = computed(() => {
  return highlighter?.getLoadedLanguages()?.includes(lang.value)
})

const FILE_COMMAND_REGEX = /^(?:\/\/|--|#|<!--|;) file: (.*?)(?: -->)?$/

const text = computed(() => {
  return block.value.type === 'equation'
    ? block.value.equation.expression
    : getTextContent(block.value.code.rich_text).replace(/\t/g, '  ')
})

const code = computed(() => {
  const firstLine = text.value.substring(0, text.value.indexOf('\n'))
  const match = firstLine.match(FILE_COMMAND_REGEX)

  return match ? text.value.substring(firstLine.length + 1) : text.value
})

const specialFileNames: Record<string, string> = {
  '*.console': 'Terminal',
  '*.shellsession': 'Terminal',
}

const fileName = computed(() => {
  const firstLine = text.value.substring(0, text.value.indexOf('\n'))
  const match = firstLine.match(FILE_COMMAND_REGEX)

  return match ? match[1] : null
})

const fileExtension = computed(() => {
  const dot = fileName.value?.lastIndexOf('.')
  return fileName.value?.substring(dot!! + 1)
})

const VSCODE_MATERIAL_ICON_THEME_URL = 'https://raw.githubusercontent.com/PKief/vscode-material-icon-theme/main/icons/'
const iconExceptions: Record<string, string> = {
  hs: 'haskell',
  md: 'markdown',
  ini: 'settings',
}

const fileIcon = computed(() => {
  if (!fileName.value) {
    return null
  }

  const extension = fileExtension.value!!
  const image = iconExceptions[extension] ?? extension

  return `${VSCODE_MATERIAL_ICON_THEME_URL}/${image}.svg`
})

const shikiHtml = computed(() => {
  if (!props.shiki || !supported.value) {
    return ''
  }

  return highlighter!!.codeToHtml(code.value, { 
    lang: lang.value, 
    themes: {
      light: 'vitesse-light',
      dark: 'vitesse-dark',
    },
    transformers: [
      {
        pre(node) {
          this.addClassToHast(node, [
            'notion-code', langClass.value,
            'motion-safe:transition-colors',
            'border', 'border-[#CFCFCF]', 'dark:border-[#333333]',
            '!px-0', '!py-4', 'relative'
          ])

          if (fileName.value) {
            this.addClassToHast(node, [
              '!mt-0', '!rounded-t-none', '!border-t-0',
            ])
          }
        },
        code(node) {
          this.addClassToHast(node, [
            langClass.value, '!px-6', 'block', 'w-fit', 'min-w-full'
          ])
        }
      },
      transformerNotationDiff(),
      transformerNotationHighlight(),
      transformerNotationErrorLevel(),
    ]
  })
})

function copyToClipboard() {
  navigator.clipboard.writeText(code.value).then(() => {})
}
</script>

<template>
  <div>
    <div v-if="fileName" class="motion-safe:transition-colors bg-[#FAFAFA] dark:bg-[#121212] flex items-center rounded-t-md p-1.5 border border-[#CFCFCF] dark:border-[#333333] gap-1.5">
      <button @click="copyToClipboard" type="button" class="px-1.5 py-1.5 rounded-md flex items-center text-xs gap-1 hover:bg-[#EFEFEF] dark:hover:bg-[#292929] active:opacity-80" :title="$t('actions.copyToClipboard')">
        <Square2StackIcon class="size-4 [stroke-width:2]" />
        <span class="sr-only">{{ $t('actions.copyToClipboard') }}</span>
      </button>
      <div class="motion-safe:transition-colors not-prose bg-[#EFEFEF] dark:bg-[#292929] w-fit rounded-md px-2 py-1.5 flex items-center gap-2">
        <NuxtImg v-if="fileIcon" :src="fileIcon" alt="" aria-hidden="true" class="size-4" />
        <span class="sr-only">{{ $t('posts.fileName') }}</span>
        <span class="text-xs select-none file-name">{{ specialFileNames[fileName] ?? fileName }}</span>
      </div>
      <div class="ml-auto flex gap-1.5 pe-1" aria-hidden="true">
        <span class="motion-safe:transition-colors size-3.5 bg-[#EFEFEF] dark:bg-[#292929] rounded-full"></span>
        <span class="motion-safe:transition-colors size-3.5 bg-[#EFEFEF] dark:bg-[#292929] rounded-full"></span>
        <span class="motion-safe:transition-colors size-3.5 bg-[#EFEFEF] dark:bg-[#292929] rounded-full"></span>
      </div>
    </div>
    <div v-if="shiki && supported" v-html="shikiHtml"/>
    <pre v-else :class="['notion-code', langClass]"><code :class="langClass">{{ code }}</code></pre>
  </div>
</template>

<style lang="postcss">
html.dark .shiki,
html.dark .shiki span {
  @apply !text-[--shiki-dark] !bg-[--shiki-dark-bg]
    ![font-style:--shiki-dark-font-style]
    ![text-decoration:--shiki-dark-text-decoration]
    !font-[--shiki-dark-font-weight]
    motion-safe:transition-colors;
}

.shiki code .diff {
  @apply motion-safe:transition-colors 
    -mx-6 px-6 py-0 inline-block w-[calc(100%+3rem)];

  &::before {
    @apply absolute left-2.5;
  }
}

.shiki code .highlighted {
  @apply motion-safe:transition-colors bg-[#8E96AA]/[.14]
    -mx-6 px-6 py-0 inline-block w-[calc(100%+3rem)];
}

html.dark .shiki code .highlighted {
  @apply !bg-[#657585]/[.16];

  span {
    @apply !bg-transparent;
  }
}

.shiki code .diff.add {
  @apply bg-[#10b981]/[.14];

  &::before {
    @apply content-["+"] text-[#18794e] dark:text-[#3dd68c];
  }
}

html.dark .shiki code .diff.add {
  @apply !bg-[#10b981]/[.16];

  span {
    @apply !bg-transparent;
  }
}

.shiki code .diff.remove {
  @apply opacity-[.7] bg-[#f43f5e]/[.14];
  
  &::before {
    @apply content-["-"] text-[#b34e52] dark:text-[#cb7676];
  }
}

html.dark .shiki code .diff.remove {
  @apply !bg-[#f43f5e]/[.16];

  span {
    @apply !bg-transparent;
  }
}

.file-name {
  font-feature-settings: "zero" 1, "ss02" 1
}
</style>
