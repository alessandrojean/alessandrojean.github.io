<template>
  <figure
    data-slot="figure"
    data-type="image"
  >
    <slot mdc-unwrap="p" />

    <figcaption
      v-if="$slots.caption"
      data-slot="figure-caption"
    >
      <slot
        name="caption"
        mdc-unwrap="p"
      />
    </figcaption>
  </figure>
</template>

<script lang="ts" setup>
defineSlots<{
  default(): unknown;
  caption(): unknown;
}>();
</script>
