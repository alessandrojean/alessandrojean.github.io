<script setup lang="ts">
definePageMeta({
  title: 'projects.title',
  description: 'projects.description'
})

defineI18nRoute({
  paths: {
    en: '/projects',
    pt: '/projetos'
  }
})

const { locale } = useI18n({ useScope: 'global' })
const { data: projectCategories } = await useFetch('/api/projects')
</script>

<template>
  <div>
    <Hero
      :title="$t('projects.title')"
      :description="$t('projects.description')"
      class="mb-10"
    />

    <div
      v-for="category of projectCategories"
      :key="category.name.en"
      class="mb-20"
    >
      <h2 class="text-xl md:text-2xl font-display-safe font-semibold dark:text-gray-200 dark:contrast-more:text-gray-100 motion-safe:transform">
        {{ category.name[locale] ?? category.name.en }}
      </h2>

      <div class="grid mt-10 gap-x-12 gap-y-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <ProjectItem
          v-for="project in category.projects"
          :key="project.id"
          :project="project"
        />
      </div>
    </div>
  </div>
</template>