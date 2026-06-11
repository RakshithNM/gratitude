<script setup lang="ts">
import CategoryIcon from './CategoryIcon.vue'
import SiteHeader from './SiteHeader.vue'
import { categories } from '../data/assessment'

const emit = defineEmits<{
  start: []
  sources: []
}>()
</script>

<template>
  <main class="landing">
    <SiteHeader @home="() => undefined" @sources="emit('sources')" />

    <section class="landing__hero">
      <div class="landing__copy">
        <p class="eyebrow">A three-minute reflection</p>
        <h1>How wealthy is your <em>everyday life?</em></h1>
        <p class="landing__intro">
          Not your salary. Not your savings. The quiet forms of wealth that shape how safe, free,
          healthy, informed, and unhurried your life can be.
        </p>
        <button class="primary-button" type="button" @click="emit('start')">
          Discover your profile
          <svg viewBox="0 0 20 20" aria-hidden="true">
            <path d="M4 10h11M11 6l4 4-4 4" />
          </svg>
        </button>
        <p class="landing__note">15 questions. No account. Your answers never leave this device.</p>
      </div>

      <div class="landing__visual" aria-hidden="true">
        <div class="orbit orbit--outer"></div>
        <div class="orbit orbit--inner"></div>
        <div class="sun-disc">
          <span>wealth</span>
          <strong>is more</strong>
          <span>than money</span>
        </div>
        <span class="spark spark--one"></span>
        <span class="spark spark--two"></span>
        <span class="spark spark--three"></span>
      </div>
    </section>

    <section class="wealth-strip" aria-label="The five forms of everyday wealth">
      <article v-for="category in categories" :key="category.id" class="wealth-strip__item">
        <span class="icon-shell"><CategoryIcon :category="category.id" /></span>
        <span>
          <strong>{{ category.shortLabel }}</strong>
          <small>{{ category.description }}</small>
        </span>
      </article>
    </section>

    <footer class="landing__footer">
      <p>
        This is a perspective tool, not a financial ranking. Global statistics are shown as context,
        not used to claim a precise percentile.
      </p>
      <span>Made to notice what is already here.</span>
    </footer>
  </main>
</template>
