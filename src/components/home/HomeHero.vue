<script setup lang="ts">
const socialMediaLinks = useSocialMedia()
</script>

<template>
  <div class="flex flex-col-reverse md:grid md:grid-cols-5 gap-10 py-16">
    <div class="md:grow mt-8 md:mt-0 md:col-span-3 md:flex md:flex-col md:justify-center">
      <h1 class="text-2xl md:text-3xl font-display-safe font-semibold dark:text-gray-100 dark:contrast-more:text-white motion-safe:transition">
        <span class="underline underline-offset-4 decoration-primary-500/80 dark:decoration-primary-400/80 decoration-4">
          {{ $t('home.header') }}
        </span>
        <span class="select-none ml-3 font-emoji">👋🏻</span>
      </h1>

      <i18n-t
        keypath="home.introduction"
        tag="p"
        class="text-gray-700 dark:text-gray-300 dark:contrast-more:text-gray-200 mt-6 md:text-lg motion-safe:transition"
      >
        <template v-slot:name>
          <span class="highlight">Alessandro</span>
        </template>
        <template v-slot:computerScienceBachelors>
          <span class="highlight highlight-secondary">
            {{ $t('home.computerScienceBachelors') }}
          </span>
        </template>
        <template v-slot:openSource>
          <span class="highlight highlight-secondary">
            {{ $t('home.openSource') }}
          </span>
        </template>
      </i18n-t>

      <div class="mt-6 flex gap-6">
        <a
          v-for="socialMediaLink in socialMediaLinks"
          :key="socialMediaLink.url"
          class="group p-1 -m-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-600 dark:focus-visible:ring-offset-gray-900 dark:contrast-more:focus-visible:ring-offset-black rounded motion-safe:transition"
          :href="socialMediaLink.url"
          :title="$t('actions.followMeOn', { site: socialMediaLink.name })"
          target="_blank"
          rel="me"
        >
          <component
            :is="socialMediaLink.icon"
            aria-hidden="true"
            class="size-5 fill-gray-500 motion-safe:transition group-hover:fill-gray-600 group-focus-visible:fill-gray-600 dark:fill-gray-400 dark:contrast-more:fill-gray-300 dark:group-hover:fill-gray-300 dark:group-focus-visible:fill-gray-300 dark:contrast-more:group-hover:fill-gray-200 dark:contrast-more:group-focus-visible:fill-gray-200"
          />
          <span class="sr-only">
            {{ $t('actions.followMeOn', { site: socialMediaLink.name }) }}
          </span>
        </a>
      </div>
    </div>

    <div class="shrink-0 flex justify-center md:col-span-2">
      <NuxtPicture
        format="avif,webp,jpg"
        sizes="208px md:256px"
        class="size-52 md:size-64 shadow-lg shadow-gray-900/10 ring-1 ring-gray-900/5 rounded-3xl overflow-hidden rotate-12 dark:opacity-90 dark:hover:opacity-100 motion-safe:transition"
        src="/img/avatar-okabe-medium.webp"
        :alt="$t('site.avatarAlt')"
      />
    </div>
  </div>
</template>
