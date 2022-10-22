<script setup lang="ts">
// Originally from https://github.com/DannyFeliz/vue-tweet/blob/main/src/components/vue-tweet.vue
import type { NotionBlockProps } from '@/composables/useNotionParser'
import type { EmbedBlockObjectResponse } from '@/lib/notion'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { block } = useNotionParser<EmbedBlockObjectResponse>(toRefs(props))

const TWEET_URL_REGEX =
  /^(https?:\/\/)?(www\.)?twitter\.com\/.*\/status(?:es)?\/(?<tweetId>[^\/\?]\d+)$/i;

const tweetUrl = computed<string>(() => block.value.embed.url)
const tweetId = computed<string>(() => {
  return tweetUrl.value.trim().match(TWEET_URL_REGEX)?.groups?.tweetId
})

const colorMode = useColorMode()
const theme = computed(() => colorMode.value)

const tweetContainerLightRef = ref<HTMLDivElement>()
const tweetContainerDarkRef = ref<HTMLDivElement>()

const isLoading = ref(true)
const hasError = ref(false)

onMounted(async () => await renderTweet())
watch(tweetUrl, async () => await renderTweet())

async function renderTweet() {
  if (!window['twttr']) {
    await addScript('https://platform.twitter.com/widgets.js')
  }

  const { widgets } = await window['twttr'].ready()

  isLoading.value = true
  hasError.value = false

  const tweetOptions = {
    align: 'center',
    lang: 'pt',
    dnt: true
  }

  const twitterWidgetElementLight = await widgets.createTweet(
    tweetId.value,
    tweetContainerLightRef.value,
    { ...tweetOptions, theme: 'light' }
  ) as HTMLDivElement | undefined

  const twitterWidgetElementDark = await widgets.createTweet(
    tweetId.value,
    tweetContainerDarkRef.value,
    { ...tweetOptions, theme: 'dark' }
  ) as HTMLDivElement | undefined
  
  await nextTick()

  if (!twitterWidgetElementLight || !twitterWidgetElementDark) {
    hasError.value = true
  }

  isLoading.value = false
}

function addScript(src: string): Promise<void> {
  return new Promise((resolve) => {
    const script = document.createElement('script')
    script.setAttribute('src', src)
    script.addEventListener('load', () => resolve(), false)
    document.body.appendChild(script)
  })
}
</script>

<template>
  <ClientOnly>
    <div
      ref="tweetContainerLightRef"
      :class="['notion-tweet motion-safe:transition-opacity', isLoading ? 'opacity-0' : 'dark:hidden']"
    />
    <div
      ref="tweetContainerDarkRef"
      :class="['notion-tweet motion-safe:transition-opacity', isLoading ? 'opacity-0' : 'hidden dark:block']"
    />

    <template #placeholder>
      <blockquote>Carregando tweet...</blockquote>
    </template>
  </ClientOnly>
</template>

<style lang="postcss">
.notion-tweet > .twitter-tweet {
  @apply shadow-lg rounded-xl !my-5 lg:!my-14;
}
</style>