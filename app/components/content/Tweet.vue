<template>
  <blockquote
    data-slot="tweet"
    class="py-4"
  >
    <div class="relative text-2xl/normal font-sans bg-(--bg) border border-(--border) rounded-lg px-4 py-3 [--bg:var(--color-gray-100)] dark:[--bg:var(--color-gray-800)] [--border:var(--color-gray-300)] dark:[--border:var(--color-gray-700)] after:size-5 after:bg-(--bg) after:block after:absolute after:-bottom-2.5 after:start-8 after:border-b after:border-e after:border-b-(--border) after:border-e-(--border) after:rotate-45">
      <slot />
    </div>

    <div class="mt-6 pl-4 flex items-center gap-4">
      <NuxtImg
        :src="picture"
        class="rounded-full"
        width="56"
        height="56"
        quality="95"
        format="webp"
        :alt="`Foto de perfil de ${author}.`"
      />

      <div class="flex flex-col">
        <cite class="text-2xl/tight font-medium">{{ author }}</cite>
        <div
          v-if="subtitle?.length"
          class="text-lg/tight italic"
        >
          {{ subtitle }}
        </div>
      </div>
    </div>
  </blockquote>
</template>

<script lang="ts" setup>
defineProps<{
  author: string;
  subtitle?: string;
  picture: string;
}>();
</script>
