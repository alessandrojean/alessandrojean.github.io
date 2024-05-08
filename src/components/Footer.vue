<script setup lang="ts">
const { title, navLinks } = useAppConfig()
const localePath = useLocalePath()

const { t } = useI18n({ useScope: 'global' })
</script>

<template>
  <footer class="mt-16 lg:mt-32 select-none flex flex-col md:flex-row gap-6 items-center justify-between text-sm w-full px-4 md:px-10 border-t border-gray-200 dark:border-gray-700 dark:contrast-more:border-gray-600 pt-8 pb-10 motion-safe:transition">
    <nav>
      <ul class="flex gap-3 md:-ml-2">
        <template v-for="link in navLinks" :key="link.to">
          <li>
            <NuxtLink
              aria-current-value="page"
              :to="localePath(link.to)"
              class="px-2 py-1 focus:outline-none rounded dark:text-gray-300 dark:contrast-more:text-gray-200 motion-safe:transition hover:text-primary-600 focus-visible:text-primary-600 dark:hover:text-primary-400 dark:focus-visible:text-primary-400 focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-offset-gray-900 dark:contrast-more:focus-visible:ring-offset-black"
            >
              {{ t(link.title) }}
            </NuxtLink>
          </li>
        </template>
      </ul>
    </nav>

    <div class="text-center md:text-right text-gray-500 dark:text-gray-400 dark:contrast-more:text-gray-300 motion-safe:transition">
      <p>
        {{ t('footer.copyright', { year: 2022, name: title }) }}
      </p>
      <p class="text-xs mt-1">
        {{ t('footer.notes') }}
      </p>
    </div>
  </footer>
</template>
