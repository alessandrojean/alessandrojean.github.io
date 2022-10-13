<script setup lang="ts">
definePageMeta({
  title: 'Sobre',
  description: 'Um pouco mais sobre a minha pessoa.'
})

const socialMediaLinks = useSocialMedia()

const { data: page } = await useFetch('/api/about')
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
        <NotionRenderer
          class="max-w-full"
          :block-map="page"
        />
      </div>

      <div class="lg:pl-20">
        <ul role="list" class="space-y-4">
          <li
            v-for="socialMedia in socialMediaLinks"
            :key="socialMedia.name"
            class="flex"
          >
            <a
              class="group flex items-center lg:text-sm font-medium text-gray-800 motion-safe:transition hover:text-primary-600 focus-visible:text-primary-600 dark:text-gray-200 dark:hover:text-primary-500 dark:focus-visible:text-primary-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-offset-gray-900 dark:contrast-more:focus-visible:ring-offset-black rounded"
              :href="socialMedia.url"
              target="_blank"
            >
              <component :is="socialMedia.icon" aria-hidden="true" class="h-6 w-6 flex-none fill-gray-500 transition group-hover:fill-primary-600 group-focus-visible:fill-primary-600 dark:group-hover:fill-primary-500 dark:group-focus-visible:fill-primary-500 motion-safe:transition" />
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