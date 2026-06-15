<template>
  <a
    :href="href"
    target="_blank"
    data-slot="inline-mention"
  >
    <Icon name="simple-icons:github" />
    <span class="leading-none">{{ text }}</span>
  </a>
</template>

<script lang="ts" setup>
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
