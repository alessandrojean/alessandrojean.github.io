<script setup lang="ts">
definePageMeta({
  title: 'Projetos',
  description: 'Experiências que programei ao longo destes anos.'
})

interface ProjectArea {
  title: string;
  projects: Project[];
}

interface Project {
  title: string;
  description: string;
  link: string;
}

const projects: ProjectArea[] = [
  {
    title: 'Pessoais',
    projects: [
      {
        title: 'Toshokan',
        description: 'Utilitário online de gerenciamento de coleção de mangás, quadrinhos e livros.',
        link: 'https://github.com/alessandrojean/toshokan',
      },
      {
        title: 'Toshokan Android',
        description: 'Aplicativo de gerenciamento de coleção de mangás, quadrinhos e livros.',
        link: 'https://github.com/alessandrojean/toshokan-android',
      },
      {
        title: 'Tachi-local',
        description: 'Utilitário para a criação de arquivos JSON para a fonte local do Tachiyomi.',
        link: 'https://tachi-local.netlify.app',
      },
      {
        title: 'BrMDb',
        description: 'Banco de dados de mangás lançados no Brasil, precursor do Toshokan.',
        link: 'https://github.com/brmdb'
      }
    ]
  },
  {
    title: 'Contribuições',
    projects: [
      {
        title: 'Tachiyomi Extensions',
        description: 'Criação de algumas extensões de fontes para o aplicativo Tachiyomi.',
        link: 'https://github.com/tachiyomiorg/tachiyomi-extensions/pulls?q=is%3Apr+author%3Aalessandrojean+is%3Aclosed',
      },
      {
        title: 'Tachiyomi Website',
        description: 'Reescrita do site oficial do aplicativo Tachiyomi para a utilização do VuePress.',
        link: 'https://github.com/tachiyomiorg/website/pulls?q=is%3Apr+author%3Aalessandrojean+is%3Aclosed',
      }
    ]
  }
]
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
      class="mb-12"
    >
      <h2 class="text-xl md:text-2xl font-semibold dark:text-gray-200 dark:contrast-more:text-gray-100 motion-safe:transform">
        {{ projectArea.title }}
      </h2>

      <div class="-mx-4 md:-mx-6 grid mt-6 gap-1 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        <ProjectItem
          v-for="project in projectArea.projects"
          :key="project.title"
          :title="project.title"
          :description="project.description"
          :link="project.link"
        />
      </div>
    </div>
  </div>
</template>