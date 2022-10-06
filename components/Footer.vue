<script setup lang="ts">
const { navLinks } = useAppConfig()
</script>

<template>
  <footer class="flex flex-col md:flex-row gap-6 items-center justify-between text-sm w-full px-4 md:px-10 border-t border-gray-200 dark:border-gray-700 dark:contrast-more:border-gray-600 pt-8 pb-10 motion-safe:transition">
    <div class="flex gap-6">
      <NuxtLink
        v-for="link in navLinks"
        :key="link.to"
        :to="link.to"
        class="dark:text-gray-300 dark:contrast-more:text-gray-200 motion-safe:transition hover:text-primary-600 dark:hover:text-primary-400"
      >
        {{ link.title }}
      </NuxtLink>
    </div>

    <p class="text-gray-400 dark:contrast-more:text-gray-300">&copy; 2022-presente Alessandro Jean.</p>
  </footer>
</template>