<script setup lang="ts">
import { LinkIcon } from '@heroicons/vue/20/solid'
import type { Project } from '@/server/api/projects.get'

const props = defineProps<{ project: Project }>()

const domain = computed(() => {
  return props.project.url ? new URL(props.project.url).host : null
})
</script>

<template>
  <div class="group relative">
    <component
      :is="project.url ? 'a' : 'h3'"
      :href="project.url"
      :target="project.url ? '_blank' : null"
      class="peer font-semibold dark:text-gray-200 dark:group-hover:text-gray-100 dark:contrast-more:text-gray-100 motion-safe:transition focus:outline-none"
      >
      <span class="absolute -inset-4 md:-inset-6 z-20 md:rounded-2xl" />
      <span class="relative z-10">{{ project.name }}</span>
    </component>
    <div class="absolute -inset-4 md:-inset-6 scale-95 bg-gray-50 dark:bg-gray-800 md:rounded-2xl motion-safe:transition opacity-0 group-hover:scale-100 group-hover:opacity-100 peer-focus-visible:scale-100 peer-focus-visible:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-primary-600 dark:peer-focus-visible:ring-offset-gray-900 dark:contrast-more:peer-focus-visible:ring-offset-black" />
    <p class="relative z-10 mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300 dark:peer-focus-visible:text-gray-300 dark:contrast-more:text-gray-300 dark:contrast-more:font-medium motion-safe:transition">
      {{ project.description }}
    </p>

    <p v-if="domain" class="relative z-10 mt-6 text-gray-400 dark:text-gray-200 group-hover:text-primary-600 peer-focus-visible:text-primary-600 dark:group-hover:text-primary-500 dark:peer-focus-visible:text-primary-500 flex items-center font-semibold text-sm motion-safe:transition">
      <LinkIcon class="w-4 h-4" aria-hidden="true" />
      <span class="ml-3">{{ domain }}</span>
    </p>
  </div>
</template>