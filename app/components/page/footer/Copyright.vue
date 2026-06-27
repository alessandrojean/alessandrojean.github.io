<template>
  <p class="text-sm text-gray-500 mt-12">
    Copyright &copy; 2018&ndash;{{ year }}
    <NuxtLink to="/">Alessandro Jean</NuxtLink>.
  </p>
</template>

<script lang="ts" setup>
const year = new Date().getFullYear();
</script>
