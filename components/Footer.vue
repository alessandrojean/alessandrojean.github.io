<script setup lang="ts">
const { navLinks } = useAppConfig()
</script>

<template>
  <footer class="flex flex-col md:flex-row gap-6 items-center justify-between text-sm w-full px-4 md:px-10 border-t border-gray-200 dark:border-gray-700 dark:contrast-more:border-gray-600 pt-8 pb-10 motion-safe:transition">
    <nav>
      <ul class="flex gap-3 md:-ml-2">
        <li v-for="link in navLinks" :key="link.to">
          <NuxtLink
            aria-current-value="page"
            :to="link.to"
            class="px-2 py-1 focus:outline-none rounded dark:text-gray-300 dark:contrast-more:text-gray-200 motion-safe:transition hover:text-primary-600 focus-visible:text-primary-600 dark:hover:text-primary-400 dark:focus-visible:text-primary-400 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-offset-gray-900 dark:contrast-more:focus-visible:ring-offset-black"
          >
            {{ link.title }}
          </NuxtLink>
        </li>
      </ul>
    </nav>

    <p class="text-gray-500 dark:text-gray-400 dark:contrast-more:text-gray-300 motion-safe:transition">&copy; 2022-presente Alessandro Jean.</p>
  </footer>
</template>