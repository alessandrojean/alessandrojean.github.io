import { computed, useRoute, useNuxtApp } from '#imports'
import { ogImageOptions } from '#build/og-image-options'
import type { Ref } from 'vue'
import type { UseOgImageProps } from '../types'

type MaybeRef<T> = T | Ref<T>

export function useOgImage(props: MaybeRef<UseOgImageProps>) {
  const route = useRoute()

  function createDevUrl(props: UseOgImageProps) {
    const url = new URL('http://localhost:3000/_og')
    url.searchParams.append('title', props.title)
    url.searchParams.append('description', props.description)
    
    if (props.publishedTime) {
      url.searchParams.append('publishedTime', props.publishedTime)
    }

    if (props.section) {
      url.searchParams.append('section', props.section)
    }

    return url.href
  }

  function createUrl(props: UseOgImageProps) {
    const routePath = route.path
    const name = routePath !== '/'
      ? routePath.replace(/\//g, '-').replace(/^-|-$/g, '')
      : 'index'
    const ogDir = ogImageOptions.dir

    return `${props.origin}/${ogDir}/${name}.png`
  }

  const ogImageUrl = computed(() => {
    const unrefProps = unref(props)

    return process.dev ? createDevUrl(unrefProps) : createUrl(unrefProps)
  })

  return {
    ogImageUrl,
    ogImageWidth: ogImageOptions.width,
    ogImageHeight: ogImageOptions.height
  }
}