<template>
  <div class="flex flex-col items-start justify-center h-screen w-full max-w-sm mx-auto gap-4">
    <HomeProfile />
    <HomeSocialMedia />
  </div>
</template>

<script lang="ts" setup>
import type { Person, WithContext } from 'schema-dts'

const jsonLd = useJsonLdPerson();

useHead({
  script: [{
    type: 'application/ld+json',
    innerHTML: JSON.stringify({
      '@context': 'https://schema.org',
      ...jsonLd,
    } satisfies WithContext<Person>),
  }]
});
</script>
