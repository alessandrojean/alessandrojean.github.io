<template>
  <div class="flex flex-wrap gap-2">
    <UiLinkButton
      v-if="socialMedia.mastodon?.length"
      :to="mastodon"
      target="_blank"
      external
    >
      <Icon
        name="simple-icons:mastodon"
        class="size-4"
      />
      Mastodon
    </UiLinkButton>
    <UiLinkButton
      v-if="socialMedia.threads?.length"
      :to="`https://threads.net/@${socialMedia.threads}`"
      target="_blank"
      external
    >
      <Icon
        name="simple-icons:threads"
        class="size-4"
      />
      Threads
    </UiLinkButton>
    <UiLinkButton
      v-if="socialMedia.instagram?.length"
      :to="`https://instagram.com/${socialMedia.instagram}`"
      target="_blank"
      external
    >
      <Icon
        name="simple-icons:instagram"
        class="size-4"
      />
      Instagram
    </UiLinkButton>
    <UiLinkButton
      v-if="socialMedia.gitHub?.length"
      :to="`https://github.com/${socialMedia.gitHub}`"
      target="_blank"
      external
    >
      <Icon
        name="simple-icons:github"
        class="size-4"
      />
      GitHub
    </UiLinkButton>
    <UiLinkButton
      v-if="socialMedia.linkedin?.length"
      :to="`https://www.linkedin.com/in/${socialMedia.linkedin}`"
      target="_blank"
      external
    >
      <Icon
        name="simple-icons:linkedin"
        class="size-4"
      />
      LinkedIn
    </UiLinkButton>
    <UiLinkButton to="/blog">
      <Icon
        name="lucide:notebook-text"
        class="size-4"
      />
      Blog
    </UiLinkButton>
    <UiLinkButton to="/movies">
      <Icon
        name="lucide:clapperboard"
        class="size-4"
      />
      Movies
    </UiLinkButton>
  </div>
</template>

<script lang="ts" setup>
const { socialMedia } = useAppConfig();

const mastodon = computed(() => {
  const [user, instance] = socialMedia.mastodon.split('@');
  return `https://${instance}/@${user}`;
});
</script>
