<script setup lang="ts">
const {
  colorMode = 'dark',
  title = 'Title',
  author = 'Author',
  date = '2025-01-01',
  category = 'Category',
  language = 'pt-BR',
} = defineProps<{
  colorMode?: 'dark' | 'light';
  title?: string;
  author?: string;
  date?: string;
  category?: string;
  avatar?: string;
  backgroundImage?: string;
  language?: string;
}>();

const dateFormatted = computed(() => {
  const formatter = new Intl.DateTimeFormat(language, {
    timeZone: 'UTC',
    dateStyle: 'medium',
  });
  return formatter.format(new Date(date));
});
</script>

<template>
  <div
    class="w-full h-full flex flex-col p-[60px] justify-between bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-white"
    :style="backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : void 0"
  >
    <div class="flex flex-1 justify-center flex-col gap-6">
      <h1 class="text-[80px]/[1.1] font-semibold m-0 text-balance">
        {{ title }}
      </h1>
    </div>

    <div class="flex shrink-0 items-center gap-6 font-sans">
      <div
        v-if="avatar"
        class="overflow-hidden border-4 border-neutral-200 dark:border-neutral-800"
        style="width: 72px; height: 72px; border-radius: 50%;"
      >
        <img
          :src="avatar"
          alt="Avatar"
          class="w-full h-full"
          style="object-fit: cover; border-radius: 50%;"
        >
      </div>
      <div class="flex flex-col">
        <span class="text-[24px] font-medium">{{ author }}</span>
        <span class="text-[20px] text-neutral-400">{{ dateFormatted }}</span>
      </div>
      <div class="ml-auto text-[20px] font-medium px-5 py-1.5 text-sky-900 bg-sky-100 rounded-full">
        {{ category }}
      </div>
    </div>
  </div>
</template>
