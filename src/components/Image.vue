<script setup lang="ts">
import type { ImgHTMLAttributes } from 'vue'

interface Props extends ImgHTMLAttributes {
  originalSrc: string
}

const props = defineProps<Props>()

const { src, originalSrc, class: classes } = toRefs(props)

const loaded = ref(false)
const container = ref<HTMLDivElement>()
const intersected = ref(false)

const imageSrc = computed(() => !process.dev ? src.value : originalSrc.value)

function onImageLoaded() {
  loaded.value = true
}

const { data: imageInfo } = await useFetch('/api/blurhash', {
  query: { url: originalSrc.value },
  key: originalSrc.value
})

const cssVariables = computed(() => ({
  '--aspect-ratio': `${imageInfo.value.width} / ${imageInfo.value.height}`,
  '--width': `${imageInfo.value.width}px`
}))

const imgProps = computed<ImgHTMLAttributes>(() => ({
  ...props,
  originalSrc: undefined,
  contenteditable: undefined,
  draggable: undefined,
  spellcheck: undefined,
  src: intersected.value ? imageSrc.value : undefined,
  loading: undefined,
  class: undefined,
}))

function handleIntersect(entries: IntersectionObserverEntry[]) {
  const el = entries[0]

  if (el.isIntersecting) {
    intersected.value = true
    observer.value.disconnect()
  }
}

const observer = ref<IntersectionObserver>()

function createObserver() {
  observer.value = new IntersectionObserver(handleIntersect, {
    root: null,
    threshold: 0
  })

  observer.value.observe(container.value)
}

function destroyObserver() {
  observer.value?.disconnect()
}

onMounted(() => createObserver())
onUnmounted(() => destroyObserver())
</script>

<template>
  <div
    :class="[
      'w-[var(--width)] max-w-full aspect-[var(--aspect-ratio)] relative',
      classes
    ]"
    :style="cssVariables"
    ref="container"
  >
    <TransitionGroup
      enter-active-class="motion-safe:transition motion-safe:duration-500"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="motion-safe:transition motion-safe:duration-500"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <img
        v-show="loaded"
        v-bind="imgProps"
        class="absolute inset-0 w-full h-full m-0"
        key="image"
        @load="onImageLoaded"
      >
      <img
        v-show="!loaded"
        class="absolute inset-0 w-full h-full m-0"
        aria-hidden="true"
        :src="imageInfo.dataUrl"
        key="blur"
      >
    </TransitionGroup>
  </div>
</template>