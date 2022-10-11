<script setup lang="ts">
// Originally from https://github.com/DannyFeliz/vue-tweet/blob/main/src/components/vue-tweet.vue
import { NotionBlockProps } from '@/composables/useNotionParser'

const props = withDefaults(defineProps<NotionBlockProps>(), {
  contentIndex: 0,
  hideList: () => [],
  level: 0,
  pageLinkTarget: '_self',
  textLinkTarget: '_blank'
})

const { properties } = useNotionParser(props)

const TWEET_URL_REGEX =
  /^(https?:\/\/)?(www\.)?twitter\.com\/.*\/status(?:es)?\/(?<tweetId>[^\/\?]\d+)$/i;

const tweetUrl = computed<string>(() => properties.value.source?.[0]?.[0])
const tweetId = computed<string>(() => {
  return tweetUrl.value.trim().match(TWEET_URL_REGEX)?.groups?.tweetId
})

const colorMode = useColorMode()
const theme = computed(() => colorMode.value)

const tweetContainerRef = ref<HTMLDivElement>()

const isLoading = ref(true)
const hasError = ref(false)

onMounted(async () => await renderTweet())
watch([tweetUrl, theme], async () => await renderTweet())

async function renderTweet() {
  if (!window['twttr']) {
    await addScript('https://platform.twitter.com/widgets.js')
  }

  const { widgets } = await window['twttr'].ready()

  isLoading.value = true
  hasError.value = false

  if (tweetContainerRef.value) {
    tweetContainerRef.value.innerHTML = ''
  }

  const tweetOptions = {
    align: 'center',
    theme: colorMode.value,
    lang: 'pt',
    dnt: true
  }

  const twitterWidgetElement: HTMLDivElement | undefined =
    await widgets.createTweet(tweetId.value, tweetContainerRef.value, tweetOptions)
  
  await nextTick()

  if (!twitterWidgetElement) {
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
    <div ref="tweetContainerRef" class="notion-tweet" />

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