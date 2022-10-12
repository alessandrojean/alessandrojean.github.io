<script setup lang="ts">
definePageMeta({
  title: 'Projetos',
  description: 'Experiências que programei ao longo destes anos.'
})

const { data: projectCategories } = await useFetch('/api/projects')
</script>

<template>
  <div>
    <Hero
      title="Projetos"
      description="Pequenos projetos que desenvolvi ao longo destes anos desde que comecei a me aprofundar nos conhecimentos em programação."
      class="mb-10"
    />

    <div
      v-for="category of projectCategories"
      :key="category.name"
      class="mb-20"
    >
      <h2 class="text-xl md:text-2xl font-semibold dark:text-gray-200 dark:contrast-more:text-gray-100 motion-safe:transform">
        {{ category.name }}
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