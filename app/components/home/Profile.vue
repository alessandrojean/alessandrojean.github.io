<template>
  <div class="flex gap-4 items-center">
    <img
      src="/img/avatar-okabe-small.webp"
      alt="Avatar"
      class="shrink-0 size-20 rounded-3xl border border-black/10 shadow-xs"
    >
    <div>
      <h1 class="text-lg lg:text-xl font-medium">
        Alessandro Jean
      </h1>
      <ul>
        <li class="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm lg:text-base font-medium">
          <Icon
            name="lucide:map-pin-house"
            class="size-4 me-1"
          />
          <span class="sr-only">Based on </span>
          São Paulo
          <span class="text-gray-400 dark:text-gray-500">/</span>
          Brazil
        </li>
        <li class="flex items-center gap-1 text-gray-600 dark:text-gray-400 text-sm lg:text-base font-medium">
          <Icon
            name="lucide:graduation-cap"
            class="size-4 me-1"
          />
          <NuxtLink
            external
            to="https://bcc.ufabc.edu.br"
            target="_blank"
            class="hover:underline"
          >
            B. in Computer Science
          </NuxtLink>
          <span class="sr-only sm:not-sr-only text-gray-400 dark:text-gray-500">@</span>
          <NuxtLink
            external
            to="https://ufabc.edu.br"
            target="_blank"
            class="sr-only sm:not-sr-only hover:underline"
          >
            UFABC
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
