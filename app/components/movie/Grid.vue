<template>
  <figure
    v-if="poster && grid.length === 4"
    data-type="image"
    class="hidden md:block"
  >
    <div class="grid grid-cols-[13rem_1fr_2rem_1fr] grid-rows-[1fr_1fr] gap-1">
      <NuxtImg
        class="row-span-2 size-full object-cover rounded-e-none"
        :src="poster"
      />
      <NuxtImg
        class="col-span-2 size-full object-cover rounded-none"
        :src="grid[0]"
      />
      <NuxtImg
        class="size-full object-cover rounded-s-none rounded-br-none"
        :src="grid[1]"
      />
      <NuxtImg
        class="size-full object-cover rounded-none"
        :src="grid[2]"
      />
      <NuxtImg
        class="col-span-2 size-full object-cover rounded-s-none rounded-tr-none"
        :src="grid[3]"
      />
    </div>

    <figcaption>Copyright {{ copyright }}.</figcaption>
  </figure>
</template>

<script lang="ts" setup>
defineProps<{
  poster?: string;
  grid: string[];
  copyright: string;
}>();
</script>
