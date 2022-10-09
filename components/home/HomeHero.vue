<script setup lang="ts">
import { ConcreteComponent } from 'vue'

const IconGitHub = resolveComponent('IconGitHub')
const IconInstagram = resolveComponent('IconInstagram')
const IconLinkedIn = resolveComponent('IconLinkedIn')
const IconMyAnimeList = resolveComponent('IconMyAnimeList')
const IconTrakt = resolveComponent('IconTrakt')
const IconTwitter = resolveComponent('IconTwitter')
  
const { socialMedia } = useAppConfig()

interface SocialMediaLink {
  name: string;
  url: string;
  icon: string | ConcreteComponent;
}

const socialMediaLinks: SocialMediaLink[] = [
  {
    name: 'Twitter',
    url: `https://twitter.com/${socialMedia.twitter}`,
    icon: IconTwitter
  },
  {
    name: 'Instagram',
    url: `https://instagram.com/${socialMedia.instagram}`,
    icon: IconInstagram
  },
  {
    name: 'GitHub',
    url: `https://github.com/${socialMedia.instagram}`,
    icon: IconGitHub
  },
  {
    name: 'LinkedIn',
    url: `https://www.linkedin.com/in/${socialMedia.linkedIn}`,
    icon: IconLinkedIn
  },
  {
  name: 'MyAnimeList',
    url: `https://myanimelist.com/profile/${socialMedia.myAnimeList}`,
    icon: IconMyAnimeList
  },
  {
    name: 'Trakt',
    url: `https://trakt.tv/users/${socialMedia.trakt}`,
    icon: IconTrakt
  },
]
</script>

<template>
  <div class="flex flex-col-reverse md:grid md:grid-cols-5 gap-10 py-16">
    <div class="md:grow mt-8 md:mt-0 md:col-span-3 md:flex md:flex-col md:justify-center">
      <h1 class="text-2xl md:text-3xl font-semibold dark:text-gray-100 dark:contrast-more:text-white motion-safe:transition">
        <span class="underline underline-offset-4 decoration-primary-500/80 dark:decoration-primary-400/80 decoration-4">Oi, muito prazer!</span>
        <img
          class="w-8 h-8 ml-3 inline-block motion-safe:animate-wiggle origin-bottom-right"
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
          class="group p-1 -m-1"
          :href="socialMediaLink.url"
          :title="`Siga-me no ${socialMediaLink.name}`"
          target="_blank"
        >
          <component
            :is="socialMediaLink.icon"
            class="h-6 w-6 fill-gray-500 motion-safe:transition group-hover:fill-gray-600 dark:fill-gray-400 dark:contrast-more:fill-gray-300 dark:group-hover:fill-gray-300 dark:contrast-more:group-hover:fill-gray-200"
          />
        </a>
      </div>
    </div>

    <div class="shrink-0 flex justify-center md:col-span-2">
      <img
        class="w-52 h-52 md:w-64 md:h-64 shadow-lg shadow-gray-900/10 ring-1 ring-gray-900/5 rounded-3xl rotate-12 dark:opacity-90 dark:hover:opacity-100 motion-safe:transition"
        src="/img/avatar-okabe.png"
        alt="Imagem de perfil com o personagem Okabe, da franquia Steins;Gate."
      >
    </div>
  </div>
</template>
