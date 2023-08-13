<script setup lang="ts">
const { title, description, url, socialMedia, lang } = useAppConfig()
const route = useRoute()

function titleTemplate(titleChunk: string | unknown): string {
  return titleChunk ? `${titleChunk} - ${title}` : title
}

useHead({ titleTemplate })

const head = useLocaleHead({
  addDirAttribute: true,
  identifierAttribute: 'id',
  addSeoAttributes: true
})

const { finalizePendingLocaleChange, t } = useI18n({ useScope: 'global' })

const ogImageOptions = computed(() => ({
  component: 'Default',
  width: 800,
  height: 400,
  origin: url,
  alt: t('site.ogImageAlt'),
  title: route.meta.title ? t(route.meta.title as string) : title,
  description: route.meta.description ? t(route.meta.description as string) : description,
}))

async function onBeforeEnter() {
  await finalizePendingLocaleChange()
}
</script>

<template>
  <div class="container max-w-6xl mx-auto bg-white dark:bg-gray-900 dark:contrast-more:bg-black motion-safe:transition min-h-screen shadow-sm border-x border-transparent dark:border-gray-800 dark:contrast-more:border-gray-700">
    <OgImage v-if="!$route.meta.skipOgImage" v-bind="ogImageOptions" />

    <Head>
      <Html :lang="head.htmlAttrs?.lang" :dir="head.htmlAttrs?.dir" />
      <Body class="font-sans-safe bg-gray-50 dark:bg-gray-950 motion-safe:transition" />
      <Link rel="preconnect" href="https://rsms.me/" />
      <Link rel="preconnect" href="https://fonts.googleapis.com" />
      <Link rel="preconnect" href="https://fonts.gstatic.com" />
      <Title>{{ $route.meta.title ? $t($route.meta.title as string) : null }}</Title>
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta
        name="og-image:skip"
        :content="$route.meta.skipOgImage ? 'true' : 'false'"
      />
      <Meta
        name="description"
        :content="$route.meta.description ? $t($route.meta.description as string) : description"
      />
      <Meta
        name="og:title"
        :content="$route.meta.title ? $t($route.meta.title as string) : title"
      />
      <Meta name="og:url" :content="url + $route.fullPath" />
      <Meta name="og:type" content="website" />
      <Meta
        name="og:description"
        :content="$route.meta.description ? $t($route.meta.description as string) : description"
      />
      <Meta
        v-if="$route.meta.skipOgImage"
        name="og:image"
        :content="url + '/img/social-media-card.jpg'"
      />
      <Meta
        v-if="$route.meta.skipOgImage"
        name="og:image:type"
        content="image/jpeg"
      />
      <Meta
        v-if="$route.meta.skipOgImage"
        name="og:image:width"
        content="1920"
      />
      <Meta
        v-if="$route.meta.skipOgImage"
        name="og:image:height"
        content="1080"
      />
      <Meta
        v-if="$route.meta.skipOgImage"
        name="og:image:alt"
        :content="$t('site.ogImageAlt')"
      />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:site" :content="'@' + socialMedia.x" />
      <Meta name="twitter:creator" :content="'@' + socialMedia.x" />
      <Meta name="twitter:title" :content="$route.meta.title as string" />
      <Meta
        name="twitter:description"
        :content="$route.meta.description ? $t($route.meta.description as string) : description"
      />
      <Meta
        v-if="$route.meta.skipOgImage"
        name="twitter:image"
        :content="url + '/img/social-media-card.webp'"
      />
      <Meta v-if="$route.meta.skipOgImage" name="twitter:image:alt" :content="$t('site.ogImageAlt')" />

      <template v-for="meta in head.meta" :key="meta.id">
        <Meta :id="meta.id" :property="meta.property" :content="meta.content" />
      </template>
      
      <Link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <Link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:ital,wght@0,400;0,500;0,700;1,400;1,500;1,700&display=swap" />
      <Link rel="icon" href="/img/favicon.ico" sizes="any" />
      <Link rel="apple-touch-icon" href="/img/apple-touch-icon.png" />

      <template v-for="link in head.link" :key="link.id">
        <Link :id="link.id" :rel="link.rel" :href="link.href" :hreflang="link.hreflang" />
      </template>
    </Head>

    <a href="#main-content" class="sr-only focus-visible:not-sr-only focus-visible:fixed focus-visible:top-6 focus-visible:left-6 bg-primary-50 shadow-lg z-50 !px-5 !py-3 rounded-lg font-medium focus:outline-none focus-visible:outline-none ring-2 ring-primary-600 text-primary-700">
      {{ $t('actions.jumpToMain') }}
    </a>

    <Header />
    <main class="px-4 md:px-10 relative selection:bg-primary-200 selection:text-primary-900 dark:selection:bg-primary-800 dark:selection:text-primary-50" id="main-content">
      <NuxtLoadingIndicator color="#0ea5e9" :duration="3000" />
      <NuxtPage :transition="{ name: 'page', onBeforeEnter }" />
    </main>
    <Footer />
  </div>
</template>

<style lang="postcss">
.page-enter-active,
.page-leave-active {
  @apply motion-safe:transition-opacity motion-safe:duration-[400ms];
}

.page-enter-from,
.page-leave-to {
  opacity: 0;
}
</style>
