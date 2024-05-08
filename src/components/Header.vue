<script setup lang="ts">
import {
Popover,
PopoverButton,
PopoverOverlay,
PopoverPanel
} from '@headlessui/vue';
import { XMarkIcon } from '@heroicons/vue/20/solid';
import { Bars3Icon } from '@heroicons/vue/24/outline';

const { navLinks } = useAppConfig()
const route = useRoute()
const localePath = useLocalePath()
const switchLocalePath = useSwitchLocalePath()
const { locale, t } = useI18n({ useScope: 'global' })

function isCurrentPage(link: typeof navLinks[0]) {
  return link.exact ? route.path === localePath(link.to) : route.path.includes(localePath(link.to))
}

const nextLocale = computed(() => ({
  code: locale.value === 'pt' ? 'en' : 'pt',
  emoji: locale.value === 'pt' ? '🇺🇸' : '🇧🇷',
  name: locale.value === 'pt' ? 'English' : 'Portuguese'
}))
</script>

<template>
  <header class="select-none sticky top-0 w-full flex gap-4 md:gap-10 items-center z-20 px-4 md:px-10 py-6 bg-white dark:bg-gray-900 dark:contrast-more:bg-black supports-backdrop-blur:bg-white/80 dark:supports-backdrop-blur:bg-gray-900/90 dark:contrast-more:supports-backdrop-blur:bg-black/90 backdrop-blur motion-safe:transition">
    <NuxtLink :to="localePath('/')" class="shrink-0 motion-safe:transition focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-offset-gray-900 dark:contrast-more:focus-visible:ring-offset-black rounded-full">
      <NuxtImg
        aria-hidden="true"
        src="/img/avatar-okabe-small.webp"
        width="40"
        height="40"
        class="size-[40px] rounded-full overflow-hidden border border-gray-200 dark:border-transparent shadow-sm"
        alt="Meu avatar pessoal"
      />
      <span class="sr-only">
        {{ t('routes.home') }}
      </span>
    </NuxtLink>

    <nav class="hidden md:block text-sm px-3 motion-safe:transition bg-white dark:bg-gray-800 rounded-full shadow-lg shadow-gray-800/5 ring-1 ring-gray-900/5 dark:ring-gray-700 dark:contrast-more:ring-gray-600" aria-label="Menu principal">
      <ul class="flex">
        <template v-for="link in navLinks" :key="link.to">
          <li>
            <NuxtLink
              :to="localePath(link.to)"
              class="relative px-3 py-2 block font-medium dark:text-gray-50 hover:text-primary-600 focus-visible:text-primary-600 dark:hover:text-primary-400 dark:focus-visible:text-primary-400 motion-safe:transition rounded focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-offset-gray-900 dark:contrast-more:focus-visible:ring-offset-black"
              aria-current-value="page"
            >
              <span :class="isCurrentPage(link) ? 'text-primary-600 dark:text-primary-400' : ''">
                {{ t(link.title) }}
              </span>
              <div
                v-if="isCurrentPage(link)"
                class="absolute -bottom-px inset-x-0 h-px bg-gradient-to-r from-primary-500/0 via-primary-500/40 to-primary-500/0"
              />
            </NuxtLink>
          </li>
        </template>
      </ul>
    </nav>

    <div class="flex gap-4 ml-auto">
      <NuxtLink
        :to="switchLocalePath(nextLocale.code)"
        :lang="nextLocale.code"
        :title="nextLocale.name"
        class="hidden md:flex items-center justify-center bg-white dark:bg-gray-800 p-2 size-10 rounded-full shadow-lg shadow-gray-800/5 ring-1 ring-gray-900/5 hover:ring-gray-900/10 dark:ring-gray-700 dark:contrast-more:ring-gray-600 dark:hover:ring-gray-600 dark:contrast-more:hover:ring-gray-500 motion-safe:transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-600 dark:focus-visible:ring-offset-gray-900 dark:contrast-more:focus-visible:ring-offset-black"
      >
        <img
          class="size-5"
          :alt="nextLocale.emoji"
          :aria-label="nextLocale.emoji"
          :src="`/img/emoji/flag-${nextLocale.code}.svg`"
        >
        <span class="sr-only">
          Change to {{ nextLocale.name }}
        </span>
      </NuxtLink>

      <ClientOnly>
        <ThemeToggle class="mr-14 md:mr-0" />
      </ClientOnly>
    </div>
  </header>

  <ClientOnly>
    <Popover class="md:hidden">
      <PopoverButton class="fixed top-6 right-4 z-30 bg-white dark:bg-gray-800 p-2 rounded-full flex items-center shadow-lg shadow-gray-800/5 ring-1 ring-gray-900/5 hover:ring-gray-900/10 dark:ring-gray-700 dark:contrast-more:ring-gray-600 dark:hover:ring-gray-600 dark:contrast-more:hover:ring-gray-500 motion-safe:transition focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-primary-600 dark:focus-visible:ring-offset-gray-900 dark:contrast-more:focus-visible:ring-offset-black">
        <span class="sr-only">
          {{ t('header.menu') }}
        </span>
        <Bars3Icon class="size-6 text-gray-500 dark:text-gray-400 motion-safe:transition" aria-hidden="true" />
      </PopoverButton>

      <div>
        <transition
          enter-active-class="motion-safe:transition duration-200 ease-out"
          enter-from-class="opacity-0"
          enter-to-class="opacity-100"
          leave-active-class="transition duration-150 ease-in"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0"
        >
          <PopoverOverlay class="fixed inset-0 z-30 bg-black/80 dark:contrast-more:bg-black/90" />
        </transition>

        <transition
          enter-active-class="motion-safe:transition duration-200 ease-out origin-top"
          enter-from-class="scale-90 opacity-0"
          enter-to-class="scale-100 opacity-100"
          leave-active-class="transition duration-150 ease-in origin-top"
          leave-from-class="scale-100 opacity-100"
          leave-to-class="scale-90 opacity-0"
        >
          <PopoverPanel
            class="fixed inset-x-4 z-30 top-8 p-8 rounded-3xl bg-white dark:bg-gray-800 dark:contrast-more:bg-gray-900 motion-safe:transition ring-1 ring-gray-900/5 dark:ring-gray-800 dark:contrast-more:ring-gray-600"
            v-slot="{ close }"
          >
            <div class="flex items-center justify-between -mt-2">
              <h2 class="font-medium text-sm text-gray-700 dark:text-gray-400 dark:contrast-more:text-gray-300 motion-safe:transition">
                {{ t('header.navigation') }}
              </h2>
              <button type="button" @click="close" class="p-2 -mr-3 flex items-center justify-center">
                <XMarkIcon class="size-6 dark:text-gray-300" aria-hidden="true" />
                <span class="sr-only">
                  {{ t('actions.closeMenu') }}
                </span>
              </button>
            </div>

            <nav class="mt-4" aria-label="Menu principal">
              <ul class="divide-y dark:divide-gray-600">
                <template v-for="link in navLinks" :key="link.to">
                  <li>
                    <NuxtLink
                      :to="localePath(link.to)"
                      aria-current-value="page"
                      class="py-2.5 block font-normal dark:text-gray-50 motion-safe:transition"
                      @click="close"
                    >
                      {{ t(link.title) }}
                    </NuxtLink>
                  </li>
                </template>
              </ul>
            </nav>
          </PopoverPanel>
        </transition>
      </div>
    </Popover>
  </ClientOnly>
</template>
