<template>
  <div
    class="py-2 px-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex gap-4 data-[type=caution]:bg-red-100 dark:data-[type=caution]:bg-red-950/60 data-[type=caution]:text-red-800 dark:data-[type=caution]:text-red-300 data-[type=caution]:border-red-200 dark:data-[type=caution]:border-red-950 data-[type=warning]:bg-amber-100 dark:data-[type=warning]:bg-yellow-400/20 data-[type=warning]:text-amber-900 dark:data-[type=warning]:text-yellow-200 data-[type=warning]:border-yellow-300 dark:data-[type=warning]:border-yellow-500/10 data-[type=note]:bg-sky-100 dark:data-[type=note]:bg-sky-950/70 data-[type=note]:text-sky-900 dark:data-[type=note]:text-sky-300 data-[type=note]:border-sky-200 dark:data-[type=note]:border-sky-950 data-[type=tip]:bg-emerald-100 dark:data-[type=tip]:bg-emerald-950 data-[type=tip]:text-emerald-900 dark:data-[type=tip]:text-emerald-300 data-[type=tip]:border-emerald-200 dark:data-[type=tip]:border-emerald-900/60 [&_a,&_p]:text-current! [&_a]:underline"
    data-slot="callout"
    :data-type="type"
  >
    <div class="shrink-0 mt-1.5">
      <Icon
        class="size-4"
        :name="icons[type]"
      />
    </div>
    <div class="flex flex-col gap-4 text-base/relaxed sm:text-lg/relaxed font-sans">
      <slot />
    </div>
  </div>
</template>

<script lang="ts" setup>
type Type = 'note' | 'tip' | 'warning' | 'caution';

const { type = 'note' } = defineProps<{ type?: Type }>();

const icons: Record<Type, string> = {
  note: 'lucide:info',
  tip: 'lucide:lightbulb',
  warning: 'lucide:triangle-alert',
  caution: 'lucide:circle-alert',
};
</script>
