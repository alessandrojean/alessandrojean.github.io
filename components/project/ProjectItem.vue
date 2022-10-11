<script setup lang="ts">
import { LinkIcon } from '@heroicons/vue/20/solid'
import { Project } from '@/pages/projects.vue'

const props = defineProps<{ project: Project }>()

const domain = computed(() => {
  return props.project.link ? new URL(props.project.link).host : null
})
</script>

<template>
  <div class="group relative">
    <div class="absolute -inset-4 md:-inset-6 scale-95 bg-gray-50 dark:bg-gray-800 md:rounded-2xl motion-safe:transition opacity-0 group-hover:scale-100 group-hover:opacity-100" />
    <component
      :is="project.link ? 'a' : 'h3'"
      :href="project.link"
      :target="project.link ? '_blank' : null"
      class="font-semibold dark:text-gray-200 dark:group-hover:text-gray-100 dark:contrast-more:text-gray-100 motion-safe:transition"
    >
      <span class="absolute -inset-4 md:-inset-6 z-20 md:rounded-2xl" />
      <span class="relative z-10">{{ project.title }}</span>
    </component>
    <p class="relative z-10 mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300 dark:contrast-more:text-gray-300 dark:contrast-more:font-medium motion-safe:transition">
      {{ project.description }}
    </p>

    <p v-if="domain" class="relative z-10 mt-6 text-gray-400 dark:text-gray-200 group-hover:text-primary-600 dark:group-hover:text-primary-500 flex items-center font-semibold text-sm motion-safe:transition">
      <LinkIcon class="w-4 h-4" aria-hidden="true" />
      <span class="ml-3">{{ domain }}</span>
    </p>
  </div>
</template>