<script setup lang="ts">
import parseISO from 'date-fns/parseISO'
import avatar from '@/assets/img/avatar.jpg'

defineOptions({
  inheritAttrs: false,
})

interface Props {
  title: string
  description: string
  section?: string
  publishedTime?: string
}

const props = withDefaults(defineProps<Props>(), {
  section: undefined,
  publishedTime: undefined,
})

const formatter = new Intl.DateTimeFormat('pt-BR', { dateStyle: 'short' })

const { publishedTime } = toRefs(props)

const published = computed(() => publishedTime.value ? parseISO(publishedTime.value) : null)
const date = computed(() => published.value ? formatter.format(published.value) : null)
</script>

<template>
  <div
    class="w-full h-full flex flex-col items-center justify-end bg-white text-black"
    style="font-feature-settings: 'cv02', 'cv03', 'cv04', 'cv11'"
  >
    <div class="flex flex-col justify-end w-full h-full">
      <div class="flex flex-col w-full py-6 px-14 border-b-4 border-sky-600">
        <div class="flex flex-col pr-1">
          <h1 class="font-bold text-4xl text-gray-900 text-left mb-0">
            {{ title }}
          </h1>
          <p class="text-lg text-gray-600 text-left mt-3 mb-0">
            {{ description }}
          </p>
        </div>
        <div class="flex flex-row items-center justify-between mt-10 w-full">
          <div class="flex flex-row items-center">
            <img class="rounded-full border border-gray-200 shadow-sm" :src="avatar" width="40" height="40" alt="">
            <div class="ml-4 flex flex-col">
              <span class="block font-medium text-sm text-gray-700">
                Alessandro Jean
              </span>
              <span class="block text-xs text-gray-600">
                alessandrojean.github.io
              </span>
            </div>
          </div>
          <div 
            :class="[
              'flex flex-row items-center',
              { 'hidden': !date && !section }
            ]"
          >
            <time
              :datetime="publishedTime"
              :class="[
                'block text-sm text-gray-600 mr-4',
                { 'hidden': !section }
              ]"
            >
              Publicado em {{ date ?? '' }}
            </time>

            <span
              :class="[
                'block bg-sky-100 rounded-full text-xs tracking-wide font-medium px-3 py-1 text-sky-800',
                { 'hidden': !section }
              ]"
            >
              {{ section ?? '' }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>