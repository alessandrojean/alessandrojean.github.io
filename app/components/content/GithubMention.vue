<template>
  <ContentMention
    :href="href"
    icon="simple-icons:github"
  >
    {{ text }}
  </ContentMention>
</template>

<script lang="ts" setup>
import ContentMention from './Mention.vue';

const { repo } = defineProps<{
  repo: string;
}>();

const href = computed(() => `https://github.com/${repo}`);
const { socialMedia: { gitHub } } = useAppConfig();

const text = computed(() => {
  const [user, repository] = repo.split('/');
  return user === gitHub ? repository : `${user}/${repository}`;
});
</script>
