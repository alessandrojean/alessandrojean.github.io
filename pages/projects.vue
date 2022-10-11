<script setup lang="ts">
export interface ProjectArea {
  title: string;
  projects: Project[];
}

export interface Project {
  title: string;
  description: string;
  link?: string;
}

definePageMeta({
  title: 'Projetos',
  description: 'Experiências que programei ao longo destes anos.'
})

const { notion: { projectsTableId } } = useAppConfig()
const projectPages = await useNotionTable({ tableId: projectsTableId })

const projects = computed<ProjectArea[]>(() => {
  const categories = [...new Set(projectPages.value.map((p) => p.area))]

  return categories.map((title) => ({
    title,
    projects: projectPages.value
      .filter((p) => p.area === title)
      .map((p) => ({
        title: p.title,
        description: p.description,
        link: p.original.URL
      }))
  }))
})
</script>

<template>
  <div>
    <Hero
      title="Projetos"
      description="Pequenos projetos que desenvolvi ao longo destes anos desde que comecei a me aprofundar nos conhecimentos em programação."
      class="mb-10"
    />

    <div
      v-for="projectArea of projects"
      :key="projectArea.title"
      class="mb-20"
    >
      <h2 class="text-xl md:text-2xl font-semibold dark:text-gray-200 dark:contrast-more:text-gray-100 motion-safe:transform">
        {{ projectArea.title }}
      </h2>

      <div class="grid mt-10 gap-x-12 gap-y-16 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <ProjectItem
          v-for="project in projectArea.projects"
          :key="project.title"
          :project="project"
        />
      </div>
    </div>
  </div>
</template>