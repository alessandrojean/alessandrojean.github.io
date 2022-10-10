<script setup lang="ts">
const props = withDefaults(defineProps<{ format: object }>(), {
  format: () => ({})
})
</script>

<template>
  <div class="notion-column">
    <slot />
  </div>
</template>