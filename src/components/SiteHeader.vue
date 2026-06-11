<script setup lang="ts">
withDefaults(
  defineProps<{
    light?: boolean
  }>(),
  {
    light: false,
  },
)

const emit = defineEmits<{
  home: []
  sources: []
}>()
</script>

<template>
  <header class="site-header" :class="{ 'site-header--light': light }">
    <button class="wordmark" type="button" aria-label="Go to the Gratitude home screen" @click="emit('home')">
      <span class="wordmark__mark" aria-hidden="true">
        <span></span>
        <span></span>
        <span></span>
      </span>
      <span>Gratitude</span>
    </button>

    <button class="text-link" type="button" @click="emit('sources')">Method &amp; sources</button>
  </header>
</template>
