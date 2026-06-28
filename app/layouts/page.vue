<template>
  <NuxtLayout name="default">
    <div class="pb-16">
      <SiteHeader />

      <PageHeader v-if="title">
        <PageHeaderTitle>{{ title }}</PageHeaderTitle>
        <PageHeaderDescription v-if="description">
          {{ description }}
        </PageHeaderDescription>
      </PageHeader>

      <slot />

      <PageFooter class="mt-12">
        <PageFooterDisclaimerNotByAi v-if="notByAi" />
        <PageFooterCdPreviousDirectory :to="cd" />
        <PageFooterCopyright />
      </PageFooter>
    </div>
  </NuxtLayout>
</template>

<script lang="ts" setup>
const { cd = '/', notByAi = false } = defineProps<{
  title?: string;
  description?: string;
  cd?: string;
  notByAi?: boolean;
}>();
</script>
