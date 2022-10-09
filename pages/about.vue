<script setup lang="ts">
import { ConcreteComponent } from 'vue'

const IconGitHub = resolveComponent('IconGitHub')
const IconInstagram = resolveComponent('IconInstagram')
const IconLinkedIn = resolveComponent('IconLinkedIn')
const IconMyAnimeList = resolveComponent('IconMyAnimeList')
const IconTrakt = resolveComponent('IconTrakt')
const IconTwitter = resolveComponent('IconTwitter')

const { socialMedia } = useAppConfig()

definePageMeta({
  title: 'Sobre',
  description: 'Um pouco mais sobre a minha pessoa.'
})

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
  }
]
</script>

<template>
  <div>    
    <div class="py-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
      <div class="lg:pl-20">
        <div class="max-w-xs px-2 5 lg:max-w-none">
          <img
            src="/img/avatar-okabe.png"
            alt="Meu avatar pessoal, com o personagem Okabe da franquia Steins;Gate."
            class="aspect-square rotate-3 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg shadow-gray-900/10 ring-1 ring-gray-900/5 dark:opacity-90 dark:hover:opacity-100 motion-safe:transition"
          >
        </div>
      </div>

      <div class="lg:order-first lg:row-span-2">
        <h1 class="text-2xl md:text-4xl font-bold dark:text-gray-100 dark:contrast-more:text-white motion-safe:transition">
          Muito prazer, me chamo Alessandro Jean
        </h1>

        <article class="prose dark:prose-invert max-w-full mt-10 prose-a:text-primary-600 dark:prose-a:text-primary-500 hover:prose-a:text-primary-700 dark:hover:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:underline hover:prose-a:underline-offset-2 hover:prose-a:decoration-2 hover:prose-a:decoration-primary-500/80 dark:hover:prose-a:decoration-primary-400/80">
          <p>
            Comecei a ter meus encantos pela área da computação por incentivo
            de familiares e conhecidos desde criança, quando tínhamos um PC antigo
            com <a href="https://pt.wikipedia.org/wiki/Windows_98" target="_blank">Windows 98</a>
            em casa. Desde lá, nunca mais parei.
          </p>

          <p>
            Concluí um curso técnico de Informática
            interligado ao meu ensino médio, onde conheci
            essa coisa maravilhosa chamada <em>programação</em>.
          </p>

          <p>
            Atualmente estou cursando o Bacharelado em Ciência da 
            Computação na <abbr title="Universidade Federal do ABC" class="decoration-gray-500 dark:decoration-gray-300 decoration-1 underline-offset-2">UFABC</abbr>,
            e posso dizer enfaticamente que não me arrependo da escolha 
            desta área.
          </p>

          <p>
            Em meu tempo livre, costumo sempre exercitar meus
            conhecimentos programando e criando coisas que são
            úteis para meu dia-a-dia, além de ler algum mangá
            ou livro e assistir filmes e séries.
          </p>

          <p>
            Gosto bastante de compartilhar conhecimento, me sinto
            bem ajudando as pessoas ensinando sobre a área.
          </p>

          <p>
            <small><em>El Psy Kongroo</em></small>.
          </p>
        </article>
      </div>

      <div class="lg:pl-20">
        <ul role="list" class="space-y-4">
          <li
            v-for="socialMedia in socialMediaLinks"
            :key="socialMedia.name"
            class="flex"
          >
            <a
              class="group flex items-center lg:text-sm font-medium text-gray-800 motion-safe:transition hover:text-primary-600 dark:text-gray-200 dark:hover:text-primary-500"
              :href="socialMedia.url"
              target="_blank"
            >
              <component :is="socialMedia.icon" aria-hidden="true" class="h-6 w-6 flex-none fill-gray-500 transition group-hover:fill-primary-600 dark:group-hover:fill-primary-500 motion-safe:transition" />
              <span class="ml-4">
                Siga-me no {{ socialMedia.name }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>