<template>
  <div
    data-slot="code"
    :data-lang="lang"
    class="md:-mx-4 md:has-[.diff]:-mx-6 [&_pre,&_code]:[font-feature-settings:'calt'] [&_pre,&_code]:font-mono text-sm [&_pre]:overflow-x-auto [&_pre]:ps-2 [&_pre]:pe-2 [&_pre]:rounded-xl rounded-xl [&_pre_span]:[font-style:var(--shiki-light-font-style)] [&_pre_span]:font-(--shiki-light-font-weight) normal-nums dark:[&_pre_span]:!text-(--shiki-dark) dark:[&_.shiki]:!bg-(--shiki-dark-bg)"
  >
    <div
      v-if="fileName && !fileName.startsWith('*')"
      class="font-sans bg-[#FAFAFA] dark:bg-[#121212] flex items-center gap-1.5 rounded-t-xl ps-4 pe-2.5 py-1.5 border border-[#CFCFCF] dark:border-[#333333]"
      data-slot="code-header"
    >
      <div class="w-fit flex items-center gap-2.5">
        <Icon
          v-if="fileIcon"
          :name="fileIcon"
          class="size-4 text-gray-600"
          stroke-width="1.5"
        />
        <span class="text-sm select-none">{{ specialFileNames[fileName] ?? fileName }}</span>
      </div>
      <button
        type="button"
        class="ms-auto sm:me-2 size-7 inline-flex items-center justify-center rounded-lg hover:bg-gray-200 dark:hover:bg-gray-800"
        @click="copy()"
      >
        <template v-if="copied">
          <Icon
            name="lucide:copy-check"
            class="size-4"
          />
          <span class="sr-only">Copied!</span>
        </template>
        <template v-else>
          <Icon
            name="lucide:copy"
            class="size-4"
          />
          <span class="sr-only">Copy</span>
        </template>
      </button>
      <div
        class="hidden sm:flex gap-1.5 pe-1"
        aria-hidden="true"
      >
        <span class="motion-safe:transition-colors size-3.5 bg-[#EFEFEF] dark:bg-[#292929] rounded-full" />
        <span class="motion-safe:transition-colors size-3.5 bg-[#EFEFEF] dark:bg-[#292929] rounded-full" />
        <span class="motion-safe:transition-colors size-3.5 bg-[#EFEFEF] dark:bg-[#292929] rounded-full" />
      </div>
    </div>
    <div
      v-if="supported"
      v-html="shikiHtml"
    />
    <pre
      v-else
      class="font-mono"
    ><code>{{ code }}</code></pre>
  </div>
</template>

<script lang="ts" setup>
import type { CodeBlockObjectResponse } from '@notionhq/client';
import {
  transformerNotationDiff,
  transformerNotationErrorLevel,
  transformerNotationHighlight,
} from '@shikijs/transformers';
import { useClipboard } from '@vueuse/core';
import type { HighlighterCore } from 'shiki';

const { block } = defineProps<{ block: CodeBlockObjectResponse }>();

const text = computed(() => getTextContent(block.code.rich_text).replace(/\t/g, '  '));

const FILE_COMMAND_REGEX = /^(?:\/\/|--|#|<!--|;) file: (.*?)(?: -->)?$/;
const specialFileNames: Record<string, string> = {
  '*.console': 'Terminal',
  '*.shellsession': 'Terminal',
};

const fileName = computed(() => {
  const firstLine = text.value.substring(0, text.value.indexOf('\n'));
  const match = firstLine.match(FILE_COMMAND_REGEX);

  return match ? match[1] : null;
});

const fileExtension = computed(() => {
  const dot = fileName.value?.lastIndexOf('.');
  return fileName.value?.substring(dot! + 1);
});

const lang = computed<ShikiLanguage>(() => {
  if (fileExtension.value) {
    return fileExtension.value as ShikiLanguage;
  }

  return block.code.language as ShikiLanguage;
});

const highlighter = inject<HighlighterCore>('highlighter');
const supported = computed(() => {
  return highlighter?.getLoadedLanguages()?.includes(lang.value);
});

const code = computed(() => {
  const firstLine = text.value.substring(0, text.value.indexOf('\n'));
  const match = firstLine.match(FILE_COMMAND_REGEX);

  return match ? text.value.substring(firstLine.length + 1) : text.value;
});

const shikiHtml = computed(() => {
  if (!highlighter || !supported.value) {
    return '';
  }

  return highlighter.codeToHtml(code.value, {
    lang: lang.value,
    themes: {
      light: 'github-light-default',
      dark: 'github-dark-default',
    },
    transformers: [
      {
        pre(node) {
          this.addClassToHast(node, [
            'border', 'border-[#CFCFCF] dark:border-[#333333]',
            '!px-0', '!py-4', 'relative',
          ]);

          if (fileName.value && !fileName.value.startsWith('*')) {
            this.addClassToHast(node, [
              '!mt-0', '!rounded-t-none', '!border-t-0',
            ]);
          }
        },

        code(node) {
          this.addClassToHast(node, [
            '!px-4', 'block', 'w-fit', 'min-w-full',
            'has-[.diff]:!px-6',
          ]);
        },
      },
      transformerNotationDiff({ matchAlgorithm: 'v1' }),
      transformerNotationHighlight(),
      transformerNotationErrorLevel(),
    ],
  });
});

const languageIcon: Record<string, string> = {
  h: 'catppuccin:c-header',
  c: 'catppuccin:c',
  cpp: 'catppuccin:cpp',
  hpp: 'catppuccin:cpp-header',
  hs: 'catppuccin:haskell',
  md: 'catppuccin:markdown',
  vue: 'catppuccin:vue',
  js: 'catppuccin:javascript',
  ts: 'catppuccin:typescript',
  jsx: 'catppuccin:javascript-react',
  tsx: 'catppuccin:typescript-react',
  cabal: 'catppuccin:cabal',
  sh: 'catppuccin:bash',
  diff: 'catppuccin:diff',
  docker: 'catppuccin:docker',
  html: 'catppuccin:html',
  css: 'catppuccin:css',
  java: 'catppuccin:java',
  kotlin: 'catppuccin:kotlin',
  json: 'catppuccin:json',
  tex: 'catppuccin:latex',
  typ: 'catppuccin:typst',
  php: 'catppuccin:php',
  py: 'catppuccin:python',
  rs: 'catppuccin:rust',
  yml: 'catppuccin:yaml',
  cu: 'catppuccin:cuda',
  console: 'lucide:terminal',
  shellsession: 'lucide:terminal',
};

const fileIcon = computed(() => {
  if (!fileName.value) {
    return null;
  }

  const extension = fileExtension.value!;
  return languageIcon[extension] ?? 'lucide:file-code';
});

const { copy, copied } = useClipboard({ source: code });
</script>

<style>
.shiki code .diff {
  --m: calc(-6 * var(--spacing));

  margin-left: var(--m);
  margin-right: var(--m);
  padding-left: calc(-1 * var(--m));
  padding-right: calc(-1 * var(--m));
  padding-top: 0px;
  padding-bottom: 0px;
  display: inline-block;
  width: calc(100% + 3rem);
}

.shiki code .diff::before {
  position: absolute;
  left: calc(2.5 * var(--spacing));
}

.shiki code .diff.add {
  background-color: color-mix(in oklab, #10b981 14%, transparent);
}

.shiki code .diff.add::before {
  content: '+';
  color: #18794e;
}

.shiki code .diff.remove {
  opacity: .7;
  background-color: color-mix(in oklab, #f43f5e 14%, transparent);
}

.shiki code .diff.remove::before {
  content: '-';
  color: #b34e52;
}

@media (prefers-color-scheme: dark) {
  .shiki code .diff.add {
    background-color: color-mix(in oklab, #10b981 16%, transparent);
  }

  .shiki code .diff.add::before {
    color: #3dd68c;
  }

  .shiki code .diff.remove {
    background-color: color-mix(in oklab, #f43f5e 16%, transparent);
  }

  .shiki code .diff.remove::before {
    color: #cb7676;
  }
}
</style>
