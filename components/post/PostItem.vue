<script lang="ts" setup>
import parseISO from 'date-fns/parseISO'
import type { Post } from '@/server/api/posts/index.get'

import { ChevronRightIcon } from '@heroicons/vue/20/solid'

const props = defineProps<{ post: Post }>()
const { post } = toRefs(props)

const formatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeZone: 'America/Sao_Paulo'
})

const dateFormatted = computed(() => {
  return formatter.format(parseISO(post.value.createdAt))
})
</script>

<template>
  <article class="md:grid md:grid-cols-4 md:items-baseline">
    <div class="md:col-span-3 group relative flex flex-col items-start">
      <h2 class="text-lg font-semibold tracking-tight text-gray-800 dark:text-gray-100 motion-safe:transition">
        <NuxtLink :to="'/posts/' + post.slug" class="peer focus:outline-none">
          <span class="absolute -inset-y-6 -inset-x-4 z-20 sm:-inset-x-6 sm:rounded-2xl" />
          <span class="relative z-10">
            {{ post.title }}
          </span>
        </NuxtLink>
        <div class="absolute -inset-y-6 -inset-x-4 z-0 scale-95 bg-gray-50 opacity-0 motion-safe:transition group-hover:scale-100 group-hover:opacity-100 dark:bg-gray-800 sm:-inset-x-6 sm:rounded-2xl peer-focus-visible:scale-100 peer-focus-visible:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-primary-600 dark:peer-focus-visible:ring-offset-gray-900 dark:contrast-more:peer-focus-visible:ring-offset-black" />
      </h2>
      <time
        class="md:hidden relative z-10 order-first mb-3 flex items-center text-sm text-gray-400 dark:text-gray-400 dark:contrast-more:text-gray-300 pl-3.5 motion-safe:transition"
        :datetime="post.createdAt"
      >
        <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
          <span class="h-4 w-0.5 rounded-full bg-gray-200 dark:bg-gray-500 motion-safe:transition" />
        </span>
        <span>{{ dateFormatted }}</span>
      </time>
      <p class="relative z-10 mt-2 text-sm text-gray-600 dark:text-gray-300 motion-safe:transition">
        {{ post.description }}
      </p>
      <div aria-hidden="true" class="relative z-10 mt-4 flex items-center text-sm font-medium text-primary-600 dark:text-primary-500 motion-safe:transition">
        <span>Ler artigo</span>
        <ChevronRightIcon aria-hidden="true" class="ml-1 h-4 w-4 stroke-current" />
      </div>
    </div>
    <time
      class="mt-1 hidden md:flex relative z-10 order-first mb-3 items-center text-sm text-gray-400 dark:text-gray-400 dark:contrast-more:text-gray-300 motion-safe:transition"
      :datetime="post.createdAt"
    >
      {{ dateFormatted }}
    </time>
  </article>
</template>
