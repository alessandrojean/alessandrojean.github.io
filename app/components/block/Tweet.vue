<template>
  <ClientOnly>
    <div ref="container">
      <div
        ref="tweetContainerLightRef"
        class="dark:hidden transition-opacity"
      />
      <div
        ref="tweetContainerDarkRef"
        class="hidden dark:block transition-opacity"
      />
    </div>

    <template #placeholder>
      <div class="text-center animate-pulse font-sans">
        Carregando tweet&hellip;
      </div>
    </template>
  </ClientOnly>
</template>

<script lang="ts" setup>
import type { EmbedBlockObjectResponse } from '@notionhq/client';

const { block } = defineProps<{ block: EmbedBlockObjectResponse }>();

interface TwitterWidgetOptions {
  align: string;
  lang: string;
  dnt: boolean;
  theme?: 'light' | 'dark';
}

interface TwitterWidgets {
  createTweet: (id: string, container: HTMLDivElement, options: TwitterWidgetOptions) => Promise<HTMLDivElement | undefined>;
}

interface TwitterWidgetsApi {
  twttr: {
    ready: () => Promise<{ widgets: TwitterWidgets }>;
  };
}

declare global {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface Window extends TwitterWidgetsApi {}
}

const container = ref<HTMLDivElement>();
const tweetContainerLightRef = ref<HTMLDivElement>();
const tweetContainerDarkRef = ref<HTMLDivElement>();

const { onLoaded } = useScript('https://platform.twitter.com/widgets.js', {
  trigger: useScriptTriggerElement({ trigger: 'visible', el: container }),
  use() {
    return { twttr: window.twttr };
  },
});

const TWEET_URL_REGEX = /^(https?:\/\/)?(www\.)?twitter\.com\/.*\/status(?:es)?\/(?<tweetId>[^/?]\d+)$/i;

const tweetUrl = computed(() => block.embed.url);
const tweetId = computed(() => {
  return tweetUrl.value.trim().match(TWEET_URL_REGEX)?.groups?.tweetId;
});

onMounted(async () => await renderTweet());
watch(tweetUrl, async () => await renderTweet());

const isLoading = ref(true);
const hasError = ref(false);

async function renderTweet() {
  onLoaded(async ({ twttr }) => {
    const { widgets } = await twttr.ready();

    isLoading.value = true;
    hasError.value = false;

    const tweetOptions: TwitterWidgetOptions = {
      align: 'center',
      lang: 'pt',
      dnt: true,
    };

    const twitterElementLight = await widgets.createTweet(
      tweetId.value!,
      tweetContainerLightRef.value!,
      { ...tweetOptions, theme: 'light' },
    );

    const twitterElementDark = await widgets.createTweet(
      tweetId.value!,
      tweetContainerDarkRef.value!,
      { ...tweetOptions, theme: 'dark' },
    );

    await nextTick();

    if (!twitterElementLight || !twitterElementDark) {
      hasError.value = true;
    }

    isLoading.value = false;
  });
}
</script>
