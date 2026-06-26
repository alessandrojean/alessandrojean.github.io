<template>
  <blockquote
    data-slot="social-media-post"
    class="py-4"
    :cite="url"
  >
    <div class="relative text-lg/normal md:text-2xl/normal font-sans bg-(--bg) border border-(--border) rounded-lg px-4 py-3 [--bg:var(--color-gray-100)] dark:[--bg:var(--color-gray-800)] [--border:var(--color-gray-300)] dark:[--border:var(--color-gray-700)] after:size-5 after:bg-(--bg) after:block after:absolute after:-bottom-2.5 after:inset-s-6 after:border-b after:border-e after:border-b-(--border) after:border-e-(--border) after:rotate-45">
      <slot />
    </div>

    <div class="mt-6 pl-4 flex items-center gap-4">
      <NuxtImg
        :src="picture"
        class="rounded-full size-10 shrink-0 ring ring-black/10"
        width="40"
        height="40"
        quality="95"
        format="avif"
        :alt="`Foto de perfil de ${author}.`"
      />

      <div class="flex flex-col gap-0.5">
        <cite class="text-lg/[1] font-medium">{{ author }}</cite>
        <div
          v-if="subtitle?.length"
          class="text-base/[1] italic text-gray-500 dark:text-gray-400"
        >
          {{ subtitle }}
        </div>
      </div>

      <NuxtLink
        v-if="site"
        class="hidden sm:block ms-auto text-gray-400 dark:text-gray-600 hover:text-gray-500 transition-colors"
        external
        target="_blank"
        :href="url"
        :aria-label="site.name"
      >
        <Icon
          :name="site.icon"
          class="size-6"
        />
      </NuxtLink>
    </div>
  </blockquote>
</template>

<script lang="ts" setup>
const { url } = defineProps<{
  author: string;
  subtitle?: string;
  picture: string;
  url?: string;
}>();

const site = computed(() => {
  if (!url) {
    return undefined;
  }

  const parsed = new URL(url);
  const domain = parsed.hostname.replace('www.', '');

  return Object
    .values(socialMedias)
    .find(s => s.domains.includes(domain));
});
</script>
