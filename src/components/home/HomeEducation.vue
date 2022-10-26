<script setup lang="ts">
import { AcademicCapIcon } from '@heroicons/vue/24/outline'

interface Course {
  institution: string;
  period: string;
  name: string;
  description?: string;
  finished?: boolean;
}

const { t } = useI18n({ useScope: 'global' })

const courses = computed<Course[]>(() => [
  {
    institution: t('home.ufabc'),
    period: t('home.period', { start: 2016, finish: t('home.present') }),
    name: t('home.computerScienceBachelors'),
    description: t('home.bachelorDescription')
  },
  {
    institution: 'Etec Lauro Gomes',
    period: t('home.period', { start: 2013, finish: 2015 }),
    name: t('home.itTechnician'),
    description: t('home.itTechnicianDescription'),
    finished: true
  }
])
</script>

<template>
  <div class="px-4 md:px-0 py-6">
    <h2 class="flex items-center text-lg font-semibold mb-6 dark:text-gray-200 dark:contrast-more:text-gray-100 motion-safe:transition -translate-x-3">
      <AcademicCapIcon aria-hidden="true" class="h-6 w-6 text-gray-400 dark:text-gray-500 dark:contrast-more:text-gray-400 motion-safe:transition" />
      <span class="ml-5">Educação</span>
    </h2>

    <div class="relative">
      <div aria-hidden="true" class="absolute inset-y-1.5 w-px border-r-2 border-dotted dark:border-gray-700 dark:contrast-more:border-gray-600 motion-safe:transition"/>

      <div
        v-for="course in courses"
        :key="course.name"
        class="mb-12"
      >
        <div class="flex items-center relative">
          <span
            aria-hidden="true"
            :class="[
              'absolute left-0 translate-x-[-3px] w-2 h-2 rounded block ring-4 ring-white dark:ring-gray-900 motion-safe:transition',
              course.finished ? 'bg-green-500' : 'bg-blue-500 motion-safe:animate-pulse'
            ]"
          />

          <p class="text-xs text-gray-500 dark:text-gray-400 dark:contrast-more:text-gray-300 dark:contrast-more:font-medium 00 motion-safe:transition pl-8">
            {{ course.period }}, {{ course.institution }}
          </p>
        </div>

        <h3 class="pl-8 mt-3 font-semibold text-gray-800 dark:text-gray-300 dark:contrast-more:text-gray-100 motion-safe:transition">
          {{ course.name }}
        </h3>

        <p v-if="course.description" class="pl-8 mt-3 text-sm text-gray-600 dark:text-gray-300 dark:contrast-more:text-gray-200 motion-safe:transition">
          {{ course.description }}
        </p>
      </div>
    </div>
  </div>
</template>