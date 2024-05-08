<script setup lang="ts">
import { RssIcon } from '@heroicons/vue/16/solid';

definePageMeta({
  title: 'posts.title',
  description: 'posts.description'
})

const { url } = useAppConfig()
const { t } = useI18n({ useScope: 'global' })
const { data: posts } = await useFetch('/api/posts')

defineOgImageComponent('Default', {
  pageTitle: t('posts.title'),
  pageDescription: t('posts.description'),
}, { alt: t('site.ogImageAlt') })
</script>

<template>
  <div>
    <Head>
      <Link rel="alternate" type="application/rss+xml" title="Feed" :href="`${url}/feed.xml`" hreflang="pt-BR" />
    </Head>

    <Hero
      :title="t('posts.title')"
      :description="t('posts.description')"
    />

    <div class="md:border-l md:border-gray-100 md:pl-6 md:dark:border-gray-700 motion-safe:transition">
      <div class="flex max-w-3xl flex-col space-y-16">
        <PostItem
          v-for="post in posts"
          :key="post.id"
          :post="post"
        />
      </div>
    </div>

    <a href="/feed.xml" target="_blank" class="mt-12 inline-flex items-center gap-1.5 font-normal text-sm text-gray-600 dark:text-gray-300 hover:underline hover:text-gray-900 dark:hover:text-gray-100">
      <RssIcon class="size-4 text-[#EB6222]" />
      <span>RSS</span>
    </a>
  </div>
</template>
