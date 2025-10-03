<template>
  <p class="text-base">
    <NuxtLink to="/" class="font-medium">Alessandro Jean</NuxtLink>
    &copy; 2022&ndash;{{ year }}
  </p>
</template>

<script lang="ts" setup>
const year = new Date().getFullYear();
</script>
