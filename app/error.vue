<template>
  <NuxtLayout>
    <div class="pb-16">
      <SiteHeader />

      <PageHeader>
        <PageHeaderTitle>{{ error?.status }}</PageHeaderTitle>
        <PageHeaderDescription>
          {{ error?.message ?? error?.statusText }}
        </PageHeaderDescription>
      </PageHeader>

      <PageFooter>
        <PageFooterCdPreviousDirectory to="/" />
        <PageFooterCopyright />
      </PageFooter>
    </div>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { NuxtError } from '#app';

defineProps<{ error: NuxtError }>();
</script>
