<script setup lang="ts">
import type { WealthCategory } from '../data/assessment'

defineProps<{
  category: WealthCategory
}>()
</script>

<template>
  <svg v-if="category === 'survival'" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M12 3.2S6.8 9.1 6.8 13.4a5.2 5.2 0 0 0 10.4 0C17.2 9.1 12 3.2 12 3.2Z" />
    <path d="M9.4 14.1a2.8 2.8 0 0 0 2.7 2.5" />
  </svg>
  <svg v-else-if="category === 'health'" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M20 8.8c0 5.2-8 10-8 10s-8-4.8-8-10A4.3 4.3 0 0 1 12 6.6 4.3 4.3 0 0 1 20 8.8Z" />
    <path d="M9.1 11.7h5.8M12 8.8v5.8" />
  </svg>
  <svg v-else-if="category === 'information'" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M4.5 5.5h5A2.5 2.5 0 0 1 12 8v10.5a2.5 2.5 0 0 0-2.5-2.5h-5V5.5Z" />
    <path d="M19.5 5.5h-5A2.5 2.5 0 0 0 12 8v10.5a2.5 2.5 0 0 1 2.5-2.5h5V5.5Z" />
  </svg>
  <svg v-else-if="category === 'freedom'" viewBox="0 0 24 24" aria-hidden="true">
    <path d="M7.4 16.6 17 7M9.1 7H17v7.9" />
    <path d="M17 17H7V7" />
  </svg>
  <svg v-else viewBox="0 0 24 24" aria-hidden="true">
    <circle cx="12" cy="12" r="8.5" />
    <path d="M12 7.5V12l3.2 2" />
  </svg>
</template>
