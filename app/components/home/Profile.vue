<template>
  <div class="flex gap-4 items-center">
    <img
      src="/img/avatar-okabe-small.webp"
      alt="Avatar"
      class="shrink-0 size-20 rounded-3xl border border-black/10 shadow-xs"
    >
    <div>
      <h1 class="text-lg font-medium">
        Alessandro Jean
      </h1>
      <ul>
        <li class="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm font-medium">
          <Icon
            name="lucide:map-pin-house"
            class="size-4 me-1"
          />
          <span class="sr-only">Based on </span>
          São Paulo
          <span class="text-gray-400 dark:text-gray-500">/</span>
          Brazil
        </li>
        <li class="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm font-medium">
          <Icon
            name="lucide:graduation-cap"
            class="size-4 me-1"
          />
          <NuxtLink
            external
            to="https://bcc.ufabc.edu.br"
            target="_blank"
            class="hidden sm:block hover:underline"
          >
            B.Sc. in Computer Science
          </NuxtLink>
          <Icon
            name="lucide:at-sign"
            class="hidden sm:block text-gray-500 size-3.5"
            aria-hidden="true"
          />
          <span class="sr-only"> at </span>
          <NuxtLink
            external
            to="https://ufabc.edu.br"
            target="_blank"
            class="hidden sm:block hover:underline"
          >
            UFABC
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>

