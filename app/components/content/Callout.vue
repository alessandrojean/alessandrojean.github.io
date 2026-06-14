<template>
  <div
    class="py-4 px-5 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex gap-4 data-[color=red-background]:bg-red-100 dark:data-[color=red-background]:bg-red-950/60 data-[color=red-background]:text-red-950 dark:data-[color=red-background]:text-red-100 data-[color=red-background]:border-red-200 dark:data-[color=red-background]:border-red-950 data-[color=yellow-background]:bg-amber-100 dark:data-[color=yellow-background]:bg-yellow-400/20 data-[color=yellow-background]:text-amber-950 dark:data-[color=yellow-background]:text-yellow-100 data-[color=yellow-background]:border-yellow-200 dark:data-[color=yellow-background]:border-yellow-500/10 data-[type=note]:bg-sky-100 dark:data-[type=note]:bg-sky-950/70 data-[type=note]:text-sky-900 dark:data-[type=note]:text-sky-100 data-[type=note]:border-sky-200 dark:data-[type=note]:border-sky-950 [&_[data-slot=inline-link]]:!text-current [&_[data-slot=inline-link]]:underline"
    data-slot="callout"
    :data-type="type"
  >
    <div class="shrink-0 mt-1.5">
      <Icon
        v-if="type === 'note'"
        class="size-4"
        name="lucide:info"
      />
    </div>
    <div class="typography gap-4 text-base/relaxed sm:text-lg/relaxed font-sans">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
const { type = 'note' } = defineProps<{
  type?: 'note' | 'tip' | 'important' | 'warning' | 'caution';
}>();
</script>
