<script setup lang="ts">
import type { Project } from '@/server/api/projects.get';
import { LinkIcon } from '@heroicons/vue/20/solid';

const props = defineProps<{ project: Project }>()
const { project } = toRefs(props)

const parsedUrl = computed(() => {
  if (!project.value.url) {
    return null
  }

  return new URL(project.value.url)
})

const domain = computed(() => {
  if (!parsedUrl.value) {
    return null
  }

  return parsedUrl.value.host === 'github.com'
    ? parsedUrl.value.pathname.substring(1)
    : parsedUrl.value.host
})

const { locale } = useI18n({ useScope: 'global' })

const logoSrc = computed(() => {
  if (process.dev || !project.value.logo) {
    return project.value.logo
  }

  return `/notion-img/projects/${project.value.slug}.${fileNameFromUrl(project.value.logo)}`
})
</script>

<template>
  <div class="group relative flex flex-col items-start">
    <div v-if="logoSrc" class="relative z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white shadow-md shadow-gray-800/5 ring-1 ring-gray-900/5 dark:border dark:border-gray-700/50 dark:bg-gray-800 dark:ring-0">
      <NuxtImg :src="logoSrc" width="32" height="32" class="size-8 rounded-full" loading="lazy" />
    </div>
    <component
      :is="project.url ? 'a' : 'h3'"
      :href="project.url"
      :target="project.url ? '_blank' : null"
      class="mt-6 peer font-semibold font-display-safe dark:text-gray-200 dark:group-hover:text-gray-100 dark:contrast-more:text-gray-100 motion-safe:transition focus:outline-none"
      >
      <span class="absolute -inset-4 md:-inset-6 z-20 md:rounded-2xl" />
      <span class="relative z-10">
        {{ project.name }}
      </span>
    </component>
    <div class="absolute -inset-4 md:-inset-6 scale-95 bg-gray-50 dark:bg-gray-800 md:rounded-2xl motion-safe:transition opacity-0 group-hover:scale-100 group-hover:opacity-100 peer-focus-visible:scale-100 peer-focus-visible:opacity-100 peer-focus-visible:ring-2 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-primary-600 dark:peer-focus-visible:ring-offset-gray-900 dark:contrast-more:peer-focus-visible:ring-offset-black" />
    <p class="relative z-10 mt-4 text-sm leading-relaxed text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-300 dark:peer-focus-visible:text-gray-300 dark:contrast-more:text-gray-300 dark:contrast-more:font-medium motion-safe:transition">
      {{ project.description[locale] ?? project.description.en }}
    </p>

    <p v-if="domain" class="relative z-10 mt-6 text-gray-400 dark:text-gray-200 group-hover:text-primary-600 peer-focus-visible:text-primary-600 dark:group-hover:text-primary-500 dark:peer-focus-visible:text-primary-500 flex items-center font-semibold text-sm motion-safe:transition">
      <IconGitHub v-if="parsedUrl?.host === 'github.com'" class="size-4 fill-current" aria-hidden="true" />
      <LinkIcon v-else class="size-4" aria-hidden="true" />
      <span class="ml-3 font-medium">{{ domain }}</span>
    </p>
  </div>
</template>
