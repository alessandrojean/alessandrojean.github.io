<script setup lang="ts">
definePageMeta({
  title: 'about.title',
  description: 'about.description'
})

defineI18nRoute({
  paths: {
    en: '/about',
    pt: '/sobre'
  }
})

const socialMediaLinks = useSocialMedia()
const { locale, t } = useI18n({ useScope: 'global' })

const { data: page } = await useFetch('/api/about')

defineOgImageComponent('Default', {
  pageTitle: t('about.title'),
  pageDescription: t('about.description'),
}, { alt: t('site.ogImageAlt') })
</script>

<template>
  <div>    
    <div class="pt-16 grid grid-cols-1 gap-y-16 lg:grid-cols-2 lg:grid-rows-[auto_1fr] lg:gap-y-12">
      <div class="lg:pl-20">
        <div class="max-w-xs px-2.5 lg:max-w-none">
          <NuxtImg
            src="/img/avatar-okabe-medium.webp"
            :alt="t('site.avatarAlt')"
            class="size-full overflow-hidden rotate-3 rounded-2xl bg-gray-100 dark:bg-gray-800 shadow-lg shadow-gray-900/10 ring-1 ring-gray-900/5 dark:opacity-90 dark:hover:opacity-100 motion-safe:transition"
          />
        </div>
      </div>

      <div class="lg:order-first lg:row-span-2" v-if="page">
        <NotionRenderer
          v-if="locale === 'pt'"
          class="max-w-full"
          :block-map="page.pt"
        />
        <NotionRenderer
          v-else
          class="max-w-full"
          :block-map="page.en"
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
              rel="me"
            >
              <component :is="socialMedia.icon" aria-hidden="true" class="size-5 flex-none fill-gray-500 transition group-hover:fill-primary-600 group-focus-visible:fill-primary-600 dark:group-hover:fill-primary-500 dark:group-focus-visible:fill-primary-500 motion-safe:transition" />
              <span class="ml-4">
                {{ t('about.followMeOn', { site: socialMedia.name }) }}
              </span>
            </a>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
