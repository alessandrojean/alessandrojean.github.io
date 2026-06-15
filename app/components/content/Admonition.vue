<template>
  <callout
    class="py-2 px-4 bg-gray-100 dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl flex gap-4 [[type=caution]]:bg-red-100 dark:[[type=caution]]:bg-red-950/60 [[type=caution]]:text-red-800 dark:[[type=caution]]:text-red-300 [[type=caution]]:border-red-200 dark:[[type=caution]]:border-red-950 [[type=warning]]:bg-amber-100 dark:[[type=warning]]:bg-yellow-400/20 [[type=warning]]:text-amber-900 dark:[[type=warning]]:text-yellow-200 [[type=warning]]:border-yellow-300 dark:[[type=warning]]:border-yellow-500/10 [[type=note]]:bg-sky-100 dark:[[type=note]]:bg-sky-950/70 [[type=note]]:text-sky-900 dark:[[type=note]]:text-sky-300 [[type=note]]:border-sky-200 dark:[[type=note]]:border-sky-950 [[type=tip]]:bg-emerald-100 dark:[[type=tip]]:bg-emerald-950 [[type=tip]]:text-emerald-900 dark:[[type=tip]]:text-emerald-300 [[type=tip]]:border-emerald-200 dark:[[type=tip]]:border-emerald-900/60 [&_a,&_p]:text-current! [&_a]:underline"
    data-slot="callout"
    :type="type"
    role="note"
    :aria-labelledby="`cot-${cotId}`"
  >
    <cot
      :id="`cot-${cotId}`"
      class="sr-only"
    >
      {{ title[type] }}
    </cot>
    <div class="shrink-0 mt-1.5">
      <Icon
        class="size-4"
        :name="icons[type]"
      />
    </div>
    <div class="flex flex-col gap-4 text-base/relaxed sm:text-lg/relaxed font-sans">
      <slot />
    </div>
  </callout>
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

const title: Record<Type, string> = {
  note: 'Nota',
  tip: 'Dica',
  warning: 'Atenção',
  caution: 'Cuidado',
};

const cotId = useId();
</script>
