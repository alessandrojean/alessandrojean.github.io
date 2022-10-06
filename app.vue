<script setup lang="ts">
const { title, description, url, socialMedia } = useAppConfig()

function titleTemplate(titleChunk: string | unknown): string {
  return titleChunk ? `${titleChunk} - ${title}` : title
}

useHead({ titleTemplate })
</script>

<template>
  <div class="container max-w-6xl mx-auto bg-white dark:bg-gray-900 dark:contrast-more:bg-black motion-safe:transition min-h-screen shadow-sm border-x border-transparent dark:border-gray-800 dark:contrast-more:border-gray-700">
    <Head>
      <Html lang="pt-BR" />
      <Body class="font-sans supports-var-font:font-sans-var bg-gray-50 dark:bg-black motion-safe:transition" />
      <Title>{{ $route.meta.title }}</Title>
      <Meta name="viewport" content="width=device-width, initial-scale=1" />
      <Meta
        name="description"
        :content="$route.meta.description as string | undefined ?? description"
      />
      <Meta name="og:title" :content="titleTemplate($route.meta.title)" />
      <Meta name="og:url" :content="url + $route.fullPath" />
      <Meta name="og:type" content="website" />
      <Meta
        name="og:description"
        :content="$route.meta.description as string | undefined ?? description"
      />
      <Meta name="og:locale" content="pt_BR" />
      <Meta name="og:image" :content="url + '/img/social-media-card.jpg'" />
      <Meta name="og:image:type" content="image/jpeg" />
      <Meta name="og:image:width" content="1920" />
      <Meta name="og:image:height" content="1080" />
      <Meta name="og:image:alt" content="Uma imagem ilustrativa do site." />
      <Meta name="twitter:card" content="summary_large_image" />
      <Meta name="twitter:site" :content="'@' + socialMedia.twitter" />
      <Meta name="twitter:creator" :content="'@' + socialMedia.twitter" />
      <Meta name="twitter:title" :content="titleTemplate($route.meta.title)" />
      <Meta
        name="twitter:description"
        :content="$route.meta.description as string | undefined ?? description"
      />
      <Meta name="twitter:image" :content="url + '/img/social-media-card.jpg'" />
      <Link rel="preconnect" href="https://rsms.me/" />
      <Link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
      <Link rel="icon" href="/img/favicon.ico" sizes="any" />
      <Link rel="apple-touch-icon" href="/img/apple-touch-icon.png" />
    </Head>

    <Header />
    <main class="px-4 md:px-10">
      <NuxtPage />
    </main>
    <Footer />
  </div>
</template>
