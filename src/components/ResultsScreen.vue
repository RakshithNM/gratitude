<script setup lang="ts">
import { computed, ref } from 'vue'
import CategoryIcon from './CategoryIcon.vue'
import SiteHeader from './SiteHeader.vue'
import type { CategoryDefinition, GlobalFact, WealthCategory } from '../data/assessment'

export interface CategoryResult {
  category: CategoryDefinition
  score: number
  maximum: number
  percent: number
}

const props = defineProps<{
  percent: number
  reliableCount: number
  partialCount: number
  categoryResults: CategoryResult[]
  matchedFacts: GlobalFact[]
}>()

const emit = defineEmits<{
  restart: []
  home: []
  sources: []
}>()

const copied = ref(false)

const title = computed(() => {
  if (props.percent >= 82) return 'Your life holds many forms of quiet wealth.'
  if (props.percent >= 62) return 'You have meaningful everyday wealth.'
  if (props.percent >= 42) return 'Your wealth is real, even if it is uneven.'
  return 'Some essentials are present. Others deserve more room.'
})

const reflection = computed(() => {
  if (props.percent >= 82) {
    return 'A great deal of your daily life rests on conditions that are easy to overlook precisely because they are dependable.'
  }
  if (props.percent >= 62) {
    return 'Several strong foundations are present in your life, alongside a few areas where access or choice may still feel uncertain.'
  }
  if (props.percent >= 42) {
    return 'Your answers show both support and constraint. Gratitude can notice what is present without pretending the gaps do not matter.'
  }
  return 'This profile is not a judgment. Limited access is a condition, not a personal failure, and every form of security here should be universal.'
})

const categoryTone: Record<WealthCategory, string> = {
  survival: 'clay',
  health: 'rose',
  information: 'blue',
  freedom: 'gold',
  time: 'green',
}

async function copyReflection() {
  const strongest = [...props.categoryResults].sort((a, b) => b.percent - a.percent)[0]
  const summary = `My everyday wealth profile: ${props.reliableCount} of 15 conditions are reliably present. My strongest area is ${strongest?.category.label.toLowerCase() ?? 'still taking shape'}. A reminder to notice the quiet forms of wealth that make daily life possible.`

  try {
    await navigator.clipboard.writeText(summary)
    copied.value = true
    window.setTimeout(() => {
      copied.value = false
    }, 1800)
  } catch {
    copied.value = false
  }
}
</script>

<template>
  <main class="results">
    <SiteHeader light @home="emit('home')" @sources="emit('sources')" />

    <section class="results__hero">
      <div class="results__score" :style="{ '--result-score': `${percent * 3.6}deg` }">
        <div>
          <strong>{{ reliableCount }}</strong>
          <span>of 15</span>
        </div>
      </div>

      <div class="results__headline">
        <p class="eyebrow">Your everyday wealth profile</p>
        <h1>{{ title }}</h1>
        <p>{{ reflection }}</p>
        <div class="results__actions">
          <button class="primary-button primary-button--cream" type="button" @click="copyReflection">
            {{ copied ? 'Reflection copied' : 'Copy your reflection' }}
          </button>
          <button class="text-link text-link--light" type="button" @click="emit('restart')">Take it again</button>
        </div>
      </div>

      <div class="results__summary">
        <span><strong>{{ reliableCount }}</strong> reliable</span>
        <span><strong>{{ partialCount }}</strong> uncertain</span>
        <span><strong>{{ 15 - reliableCount - partialCount }}</strong> out of reach</span>
      </div>
    </section>

    <section class="results__body">
      <div class="section-heading">
        <p class="eyebrow">Your five dimensions</p>
        <h2>Where your wealth lives</h2>
        <p>Each bar reflects your answers, not a comparison with another person.</p>
      </div>

      <div class="category-results">
        <article
          v-for="result in categoryResults"
          :key="result.category.id"
          class="category-result"
          :class="`category-result--${categoryTone[result.category.id]}`"
        >
          <div class="category-result__top">
            <span class="icon-shell"><CategoryIcon :category="result.category.id" /></span>
            <span class="category-result__value">{{ result.percent }}%</span>
          </div>
          <h3>{{ result.category.label }}</h3>
          <p>{{ result.category.reflection }}</p>
          <div class="category-result__track" aria-hidden="true">
            <span :style="{ width: `${result.percent}%` }"></span>
          </div>
        </article>
      </div>

      <section class="perspective">
        <div class="section-heading section-heading--left">
          <p class="eyebrow">A little perspective</p>
          <h2>The ordinary can be extraordinary.</h2>
          <p>
            These are global gaps connected to conditions you said are reliably present in your life.
            The figures are not added together and do not create a percentile.
          </p>
        </div>

        <div v-if="matchedFacts.length" class="fact-grid">
          <article v-for="fact in matchedFacts" :key="fact.id" class="fact-card">
            <span class="fact-card__year">{{ fact.year }}</span>
            <strong>{{ fact.value }}</strong>
            <h3>{{ fact.label }}</h3>
            <p>{{ fact.context }}</p>
            <a :href="fact.sourceUrl" target="_blank" rel="noreferrer">
              {{ fact.sourceName }}
              <svg viewBox="0 0 16 16" aria-hidden="true"><path d="M5 11 11 5M6 5h5v5" /></svg>
            </a>
          </article>
        </div>

        <div v-else class="perspective__empty">
          <p>
            Your answers did not match the reliably-present conditions used for these global
            comparisons. That is important context too. Access should never be treated as a measure
            of personal worth.
          </p>
        </div>
      </section>

      <section class="closing-note">
        <span class="closing-note__line"></span>
        <blockquote>
          “Gratitude is not ignoring what is missing. It is learning to see what is holding you.”
        </blockquote>
        <p>Carry one unnoticed form of wealth with you today.</p>
      </section>
    </section>
  </main>
</template>
