<script setup lang="ts">
definePageMeta({
  title: 'posts.title',
  description: 'posts.description'
})

defineI18nRoute({
  locales: ['pt'],
  paths: { pt: '/posts' }
})

const { data: posts } = await useFetch('/api/posts')
</script>

<template>
  <div class="pb-16 lg:pb-32">
    <Hero
      :title="$t('posts.title')"
      :description="$t('posts.description')"
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
  </div>
</template>
