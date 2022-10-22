<script setup lang="ts">
import { FunctionalComponent } from 'vue'
import { MoonIcon, SunIcon } from '@heroicons/vue/24/outline'

interface Theme {
  name: string;
  icon: FunctionalComponent
}

const colorMode = useColorMode()
const themes: Record<string, Theme> = {
  dark: { name: 'theme.dark', icon: MoonIcon },
  light: { name: 'theme.light', icon: SunIcon },
}

const theme = computed(() => themes[colorMode.value])
const { t } = useI18n({ useScope: 'global' })

const buttonAction = computed(() => {
  const nextTheme = colorMode.value === 'dark' ? 'theme.light' : 'theme.dark'

  return t('actions.changeTheme', { theme: t(nextTheme) })
})

function changeTheme() {
  colorMode.preference = colorMode.value === 'dark' ? 'light' : 'dark'
}
</script>

<template>
  <button
    type="button"
    class="group bg-white dark:bg-gray-800 p-2 rounded-full shadow-lg shadow-gray-800/5 ring-1 ring-gray-900/5 hover:ring-gray-900/10 dark:ring-gray-700 dark:contrast-more:ring-gray-600 dark:hover:ring-gray-600 dark:contrast-more:hover:ring-gray-500 motion-safe:transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-600 dark:focus-visible:ring-offset-gray-900 dark:contrast-more:focus-visible:ring-offset-black"
    :title="buttonAction"
    @click="changeTheme"
  >
    <SunIcon
      v-if="colorMode.value === 'light'"
      class="w-6 h-6 text-cyan-500 group-hover:text-cyan-600 group-focus-visible:text-cyan-600 motion-safe:transition"
    />
    <MoonIcon
      v-else
      class="w-6 h-6 text-gray-500 contrast-more:text-gray-300 group-hover:text-gray-400 group-focus-visible:text-gray-400 contrast-more:group-hover:text-gray-100 dark:contrast-more:group-focus-visible:text-gray-100 motion-safe:transition"
    />
    <span class="sr-only">
      {{ buttonAction }}
    </span>
  </button>
</template>