<script setup lang="ts">
const {
  colorMode = 'dark',
  title = 'Title',
  author = 'Author',
  role = 'Role',
} = defineProps<{
  colorMode?: 'dark' | 'light';
  title?: string;
  subtitle?: string;
  author?: string;
  date?: string;
  role?: string;
  avatar?: string;
  backgroundImage?: string;
}>();
</script>

<template>
  <div
    class="w-full h-full flex flex-col p-[60px] justify-between bg-neutral-50 text-neutral-900 dark:bg-neutral-900 dark:text-white font-sans"
    :style="backgroundImage ? { backgroundImage: `url(${backgroundImage})` } : void 0"
  >
    <div class="flex flex-1 justify-center flex-col gap-3">
      <h1 class="text-[80px]/[1.1] font-semibold m-0 text-balance">
        {{ title }}
      </h1>
      <p
        v-if="subtitle"
        class="text-[40px] text-neutral-500"
      >
        {{ subtitle }}
      </p>
    </div>

    <div class="flex shrink-0 items-center gap-6">
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
        <span class="text-[20px] text-neutral-400">{{ role }}</span>
      </div>
    </div>
  </div>
</template>
