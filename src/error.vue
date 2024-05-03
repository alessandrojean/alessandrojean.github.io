<script setup lang="ts">
import type { NuxtError } from '#app';

const props = defineProps({
  error: Object as () => NuxtError
})

const { error } = toRefs(props)
const { t } = useI18n({ useScope: 'global' })

const CUSTOM_MESSAGES: Record<number, { title: string, description: string }> = {
  404: { 
    title: 'errors.pageNotFound.title', 
    description: 'errors.pageNotFound.description' 
  },
  500: {
    title: 'errors.serverError.title', 
    description: 'errors.serverError.description' 
  }
}

const title = computed(() => {
  return error?.value?.statusCode 
    ? t(CUSTOM_MESSAGES[error?.value?.statusCode].title)
    : error?.value?.statusMessage
})

const description = computed(() => {
  return error?.value?.statusCode 
    ? t(CUSTOM_MESSAGES[error?.value?.statusCode].description)
    : null
})

const handleError = () => clearError({ redirect: localePath('/') })
const localePath = useLocalePath()
</script>

<template>
  <NuxtLayout>
    <div class="pt-16 lg:pt-32 mx-auto w-full max-w-2xl lg:max-w-5xl flex justify-center self-center ">
      <div class="flex flex-col items-center">
        <p class="text-base font-semibold text-gray-400 dark:text-gray-500 text-center">
          {{ error?.statusCode }}
        </p>

        <h1 class="text-center mt-4 text-4xl lg:text-5xl font-display-safe font-bold tracking-tight text-gray-800 dark:text-gray-100">
          {{ title }}
        </h1>

        <p v-if="description" class="text-center mt-4 text-base text-gray-600 dark:text-gray-400">
          {{ description }}
        </p>

        <button type="button" @click="handleError" class="inline-flex items-center gap-2 justify-center rounded-md py-2 px-3 text-sm outline-offset-2 transition active:transition-none bg-gray-50 font-medium text-gray-900 hover:bg-gray-100 active:bg-gray-100 active:text-gray-900/60 dark:bg-gray-800/50 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50 dark:active:bg-gray-800/50 dark:active:text-gray-50/70 mt-4 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-offset-gray-900 dark:contrast-more:focus-visible:ring-offset-black">
          {{ t('actions.goBackHome') }}
        </button>
      </div>
    </div>
  </NuxtLayout>
</template>
