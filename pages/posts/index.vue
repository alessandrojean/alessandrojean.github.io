<script setup lang="ts">
import formatISO from 'date-fns/formatISO'
import { ChevronRightIcon } from '@heroicons/vue/20/solid'

definePageMeta({
  title: 'Coleção de artigos',
  description: 'Alguns textos que escrevi desde a criação do site.'
})

const { notion: { postsTableId } } = useAppConfig()
const posts = await useNotionTable({
  tableId: postsTableId,
  sort: (a, b) => {
    return b.createdAt.getTime() - a.createdAt.getTime()
  }
})

const formatter = new Intl.DateTimeFormat('pt-BR', {
  dateStyle: 'short',
  timeZone: 'America/Sao_Paulo'
})

function formatDate(date: Date): string {
  return formatter.format(date)
}
</script>

<template>
  <div class="pb-16 lg:pb-32">
    <Hero
      title="Coleção de artigos"
      description="Alguns textos que escrevi desde a criação do site."
    />

    <div class="md:border-l md:border-gray-100 md:pl-6 md:dark:border-gray-700 motion-safe:transition">
      <div class="flex max-w-3xl flex-col space-y-16">
        <article
          v-for="post in posts"
          :key="post.id"
          class="md:grid md:grid-cols-4 md:items-baseline"
        >
          <div class="md:col-span-3 group relative flex flex-col items-start">
            <h2 class="text-base font-semibold tracking-tight text-gray-800 dark:text-gray-100 motion-safe:transition">
              <div class="absolute -inset-y-6 -inset-x-4 z-0 scale-95 bg-gray-50 opacity-0 motion-safe:transition group-hover:scale-100 group-hover:opacity-100 dark:bg-gray-800 sm:-inset-x-6 sm:rounded-2xl"></div>
              <NuxtLink :to="'/posts/' + post.slug">
                <span class="absolute -inset-y-6 -inset-x-4 z-20 sm:-inset-x-6 sm:rounded-2xl" />
                <span class="relative z-10">
                  {{ post.title }}
                </span>
              </NuxtLink>
            </h2>
            <time
              class="md:hidden relative z-10 order-first mb-3 flex items-center text-sm text-gray-400 dark:text-gray-400 dark:contrast-more:text-gray-300 pl-3.5 motion-safe:transition"
              :datetime="formatISO(post.createdAt)"
            >
              <span class="absolute inset-y-0 left-0 flex items-center" aria-hidden="true">
                <span class="h-4 w-0.5 rounded-full bg-gray-200 dark:bg-gray-500 motion-safe:transition" />
              </span>
              <span>{{ formatDate(post.createdAt) }}</span>
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
            :datetime="formatISO(post.createdAt)"
          >
            {{ formatDate(post.createdAt) }}
          </time>
        </article>
      </div>
    </div>
  </div>
</template>
