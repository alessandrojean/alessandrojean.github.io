<script setup lang="ts">
import { ConcreteComponent } from 'vue'
import { CommandLineIcon } from '@heroicons/vue/24/outline'

import {
  IconAndroid,
  IconJava,
  IconJavaScript,
  IconKotlin,
  IconNodeJs,
  IconReact,
  IconTailwindCss,
  IconTypeScript,
  IconVueJs,
  IconWooCommerce,
  IconWordPress,
} from '#components'

interface Knowledge {
  title: string;
  icon: string | ConcreteComponent;
  level: string;
}

interface KnowledgeArea {
  title: string;
  titleLang?: string;
  items: Knowledge[];
}

const knowledges: KnowledgeArea[] = [
  {
    title: 'Frameworks',
    titleLang: 'en-US',
    items: [
      { title: 'Vue.js', icon: IconVueJs, level: 'Avançado' },
      { title: 'Tailwind CSS', icon: IconTailwindCss, level: 'Avançado' },
      { title: 'React', icon: IconReact, level: 'Básico' }
    ]
  },
  {
    title: 'Linguagens',
    items: [
      { title: 'JavaScript', icon: IconJavaScript, level: 'Avançado' },
      { title: 'Kotlin', icon: IconKotlin, level: 'Avançado' },
      { title: 'Java', icon: IconJava, level: 'Avançado' },
      { title: 'TypeScript', icon: IconTypeScript, level: 'Intermediário' },
    ]
  },
  {
    title: 'Ecossistemas',
    items: [
      { title: 'Node.js', icon: IconNodeJs, level: 'Avançado' },
      { title: 'WooCommerce', icon: IconWooCommerce, level: 'Intermediário' },
      { title: 'WordPress', icon: IconWordPress, level: 'Intermediário' },
      { title: 'Android', icon: IconAndroid, level: 'Básico' },
    ]
  }
]
</script>

<template>
  <div class="p-6 rounded-xl border border-gray-100 dark:border-gray-700 dark:contrast-more:border-gray-600 motion-safe:transition">
    <h2 class="flex items-center text-lg font-semibold mb-4 dark:text-gray-200 dark:contrast-more:text-gray-100 motion-safe:transition">
      <CommandLineIcon aria-hidden="true" class="h-6 w-6 text-gray-400 dark:text-gray-500 dark:contrast-more:text-gray-400 motion-safe:transition" />
      <span class="ml-3">Conhecimentos</span>
    </h2>

    <ul
      v-for="area in knowledges"
      :key="area.title"
      class="w-full"
    >
      <li :lang="area.titleLang ?? undefined" class="text-sm font-medium mt-6 mb-4 flex items-center gap-4">
        <span class="shrink-0 dark:text-gray-300 dark:contrast-more:text-gray-200 motion-safe:transition">{{ area.title }}</span>
        <span class="grow h-px block bg-gray-200 dark:bg-gray-700 dark:contrast-more:bg-gray-600 motion-safe:transition"></span>
      </li>
      <li>
        <ul class="space-y-3">
          <li
            v-for="knowledge in area.items"
            :key="knowledge.title"
            class="flex gap-4 items-center w-full"
          >
            <div aria-hidden="true" class="shrink-0 bg-white dark:bg-gray-800 dark:border-gray-800 shadow-md shadow-gray-800/5 ring-1 dark:ring-0 ring-gray-900/5 dark:border dark:border-gray-700/50 rounded-full flex h-8 w-8 items-center justify-center motion-safe:transition">
              <component :is="knowledge.icon" class="w-4 h-4 dark:opacity-90" />
            </div>

            <span lang="en-US" class="motion-safe:transition font-medium text-gray-800 dark:text-gray-200 text-sm grow">
              {{ knowledge.title }}
            </span>
            <span class="sr-only"> com nível </span>
            <span class="motion-safe:transition text-xs text-gray-600 dark:text-gray-400 dark:contrast-more:text-gray-300 dark:contrast-more:font-medium shrink-0">
              {{ knowledge.level }}
            </span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
