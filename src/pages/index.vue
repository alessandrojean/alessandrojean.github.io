<script lang="ts" setup>
definePageMeta({
  skipOgImage: true
})
</script>

<template>
  <div>
    <HomeHero />

    <div class="md:grid md:grid-cols-5 pb-10 gap-10">
      <HomeEducation class="col-span-3" />      
      <HomeKnowledge class="col-span-2" />
    </div>
  </div>
</template>
