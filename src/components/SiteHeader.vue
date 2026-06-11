<script setup lang="ts">
withDefaults(
  defineProps<{
    light?: boolean
    active?: 'everyday' | 'financial'
  }>(),
  {
    light: false,
    active: 'everyday',
  },
)

const emit = defineEmits<{
  home: []
  everyday: []
  financial: []
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

    <nav class="site-nav" aria-label="Wealth profiles">
      <button :class="{ active: active === 'everyday' }" type="button" @click="emit('everyday')">
        Everyday wealth
      </button>
      <button :class="{ active: active === 'financial' }" type="button" @click="emit('financial')">
        Financial position
      </button>
    </nav>

    <button class="text-link site-header__sources" type="button" @click="emit('sources')">Method &amp; sources</button>
  </header>
</template>
