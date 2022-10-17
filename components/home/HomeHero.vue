<script setup lang="ts">
const { avatarAlt } = useAppConfig()
const socialMediaLinks = useSocialMedia()
</script>

<template>
  <div class="flex flex-col-reverse md:grid md:grid-cols-5 gap-10 py-16">
    <div class="md:grow mt-8 md:mt-0 md:col-span-3 md:flex md:flex-col md:justify-center">
      <h1 class="text-2xl md:text-3xl font-semibold dark:text-gray-100 dark:contrast-more:text-white motion-safe:transition">
        <span class="underline underline-offset-4 decoration-primary-500/80 dark:decoration-primary-400/80 decoration-4">Oi, muito prazer!</span>
        <img
          class="w-8 h-8 ml-3 inline-block"
          src="https://notion-emojis.s3-us-west-2.amazonaws.com/prod/svg-twitter/1f44b-1f3fb.svg"
          alt="👋🏻"
          aria-label="👋🏻"
        />
      </h1>

      <p class="text-gray-700 dark:text-gray-300 dark:contrast-more:text-gray-200 mt-6 md:text-lg motion-safe:transition">
        Sou o <span class="highlight">Alessandro</span>, uma pessoa atenta e 
        curiosa aos mínimos detalhes.
        Atualmente estou cursando o Bacharelado em <span class="highlight highlight-secondary">Ciência da Computação</span>,
        e no meu tempo livre gosto de ler e contribuir em alguns projetos de
        <span class="highlight highlight-secondary">código aberto</span>.
      </p>

      <div class="mt-6 flex gap-6">
        <a
          v-for="socialMediaLink in socialMediaLinks"
          :key="socialMediaLink.url"
          class="group p-1 -m-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-offset-gray-900 dark:contrast-more:focus-visible:ring-offset-black rounded motion-safe:transition"
          :href="socialMediaLink.url"
          :title="`Siga-me no ${socialMediaLink.name}`"
          target="_blank"
        >
          <component
            :is="socialMediaLink.icon"
            aria-hidden="true"
            class="h-6 w-6 fill-gray-500 motion-safe:transition group-hover:fill-gray-600 group-focus-visible:fill-gray-600 dark:fill-gray-400 dark:contrast-more:fill-gray-300 dark:group-hover:fill-gray-300 dark:group-focus-visible:fill-gray-300 dark:contrast-more:group-hover:fill-gray-200 dark:contrast-more:group-focus-visible:fill-gray-200"
          />
          <span class="sr-only">
            Siga-me no <span lang="en-US">{{ socialMediaLink.name }}</span>
          </span>
        </a>
      </div>
    </div>

    <div class="shrink-0 flex justify-center md:col-span-2">
      <img
        class="w-52 h-52 md:w-64 md:h-64 shadow-lg shadow-gray-900/10 ring-1 ring-gray-900/5 rounded-3xl rotate-12 dark:opacity-90 dark:hover:opacity-100 motion-safe:transition"
        src="/img/avatar-okabe-medium.webp"
        :alt="avatarAlt"
      >
    </div>
  </div>
</template>
