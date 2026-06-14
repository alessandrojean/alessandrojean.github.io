<template>
  <!-- <a
    v-if="mentionLink"
    :href="mentionLink.href"
    target="_blank"
    data-slot="inline-mention"
  >
    <component :is="mentionLink.icon" />
    <span class="leading-none">{{ mentionLink.text }}</span>
  </a> -->
  <NuxtLink
    :href="href"
    :target="target"
    data-slot="inline-link"
  >
    <slot />
  </NuxtLink>
</template>

<script setup lang="ts">
import type { PropType } from 'vue';

import { Icon } from '#components';

const { href, target } = defineProps({
  href: {
    type: String,
    default: '',
  },
  target: {
    type: String as PropType<'_blank' | '_parent' | '_self' | '_top' | (string & object) | null | undefined>,
    default: undefined,
    required: false,
  },
});

const IconGitHub = h(Icon, { name: 'simple-icons:github' });
const { socialMedia: { gitHub } } = useAppConfig();

const mentionLink = computed(() => {
  const linkUrlParsed = new URL(href);

  if (linkUrlParsed.host === 'github.com') {
    const [user, repo] = linkUrlParsed.pathname.substring(1).split('/');

    return {
      icon: IconGitHub,
      text: user === gitHub ? repo : `${user}/${repo}`,
      href,
    };
  }

  return null;
});
</script>
