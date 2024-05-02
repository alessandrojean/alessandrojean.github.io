<script setup lang="ts">
import { CommandLineIcon } from '@heroicons/vue/24/outline';
import type { Component } from 'vue';

import {
IconAndroid,
IconHaskell,
IconJava,
IconJavaScript,
IconKotlin,
IconNodeJs,
IconReact,
IconSpring,
IconTailwindCss,
IconTypeScript,
IconVueJs,
IconWooCommerce,
IconWordPress,
} from '#components';

interface Knowledge {
  title: string;
  icon: string | Component;
  level: string;
}

interface KnowledgeArea {
  title: string;
  items: Knowledge[];
}

const { t } = useI18n({ useScope: 'global' })

const knowledges = computed<KnowledgeArea[]>(() => [
  {
    title: t('home.frameworks'),
    items: [
      { title: 'Vue.js', icon: IconVueJs, level: 'advanced' },
      { title: 'Tailwind CSS', icon: IconTailwindCss, level: 'advanced' },
      { title: 'React', icon: IconReact, level: 'basic' }
    ]
  },
  {
    title: t('home.languages'),
    items: [
      { title: 'JavaScript', icon: IconJavaScript, level: 'advanced' },
      { title: 'Kotlin', icon: IconKotlin, level: 'advanced' },
      { title: 'Java', icon: IconJava, level: 'advanced' },
      { title: 'Haskell', icon: IconHaskell, level: 'intermediary' },
      { title: 'TypeScript', icon: IconTypeScript, level: 'intermediary' },
    ]
  },
  {
    title: t('home.ecosystems'),
    items: [
      { title: 'Node.js', icon: IconNodeJs, level: 'advanced' },
      { title: 'Android', icon: IconAndroid, level: 'intermediary' },
      { title: 'Spring', icon: IconSpring, level: 'intermediary' },
      { title: 'WooCommerce', icon: IconWooCommerce, level: 'intermediary' },
      { title: 'WordPress', icon: IconWordPress, level: 'intermediary' },
    ]
  }
])
</script>

<template>
  <div class="p-6 rounded-3xl border border-gray-100 dark:border-gray-700 dark:contrast-more:border-gray-600 motion-safe:transition">
    <h2 class="flex items-center text-lg font-display-safe font-semibold mb-4 dark:text-gray-200 dark:contrast-more:text-gray-100 motion-safe:transition">
      <CommandLineIcon aria-hidden="true" class="size-6 text-gray-400 dark:text-gray-500 dark:contrast-more:text-gray-400 motion-safe:transition" />
      <span class="ml-3">
        {{ $t('home.knowledges') }}
      </span>
    </h2>

    <ul
      v-for="area in knowledges"
      :key="area.title"
      class="w-full"
    >
      <li class="text-sm font-medium mt-6 mb-4 flex items-center gap-4">
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
            <div aria-hidden="true" class="shrink-0 bg-white dark:bg-gray-800 dark:border-gray-800 shadow-md shadow-gray-800/5 ring-1 dark:ring-0 ring-gray-900/5 dark:border dark:border-gray-700/50 rounded-full flex size-8 items-center justify-center motion-safe:transition">
              <component :is="knowledge.icon" class="size-4 dark:opacity-90" />
            </div>

            <span lang="en-US" class="motion-safe:transition font-medium text-gray-800 dark:text-gray-200 text-sm grow">
              {{ knowledge.title }}
            </span>
            <span class="sr-only">
              {{ $t('home.withLevel') }}
            </span>
            <span class="motion-safe:transition text-xs text-gray-600 dark:text-gray-400 dark:contrast-more:text-gray-300 dark:contrast-more:font-medium shrink-0">
              {{ $t(`home.${knowledge.level}`) }}
            </span>
          </li>
        </ul>
      </li>
    </ul>
  </div>
</template>
