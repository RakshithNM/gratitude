<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import FinancialCalculator from './components/FinancialCalculator.vue'
import LandingScreen from './components/LandingScreen.vue'
import QuizScreen from './components/QuizScreen.vue'
import ResultsScreen, { type CategoryResult } from './components/ResultsScreen.vue'
import {
  answerOptions,
  categories,
  globalFacts,
  questions,
  sources,
  type AnswerScore,
} from './data/assessment'
import { financialSource } from './data/financial'

type AppPhase = 'landing' | 'quiz' | 'results' | 'financial'
type SourceContext = 'everyday' | 'financial'

const phase = ref<AppPhase>('landing')
const currentQuestionIndex = ref(0)
const answers = ref<Record<string, AnswerScore>>({})
const sourceDialog = ref<HTMLDialogElement | null>(null)
const sourceContext = ref<SourceContext>('everyday')

const currentQuestion = computed(() => questions[currentQuestionIndex.value]!)

const reliableCount = computed(
  () => Object.values(answers.value).filter((answer) => answer === 2).length,
)

const partialCount = computed(
  () => Object.values(answers.value).filter((answer) => answer === 1).length,
)

const totalScore = computed(() =>
  Object.values(answers.value).reduce<number>((total, answer) => total + answer, 0),
)

const overallPercent = computed(() =>
  Math.round((totalScore.value / (questions.length * 2)) * 100),
)

const categoryResults = computed<CategoryResult[]>(() =>
  categories.map((category) => {
    const categoryQuestions = questions.filter((question) => question.category === category.id)
    const score = categoryQuestions.reduce(
      (total, question) => total + (answers.value[question.id] ?? 0),
      0,
    )
    const maximum = categoryQuestions.length * 2

    return {
      category,
      score,
      maximum,
      percent: Math.round((score / maximum) * 100),
    }
  }),
)

const matchedFacts = computed(() =>
  globalFacts.filter((fact) =>
    fact.triggerQuestionIds.some((questionId) => answers.value[questionId] === 2),
  ),
)

watch(
  phase,
  (currentPhase) => {
    document.title =
      currentPhase === 'financial'
        ? 'India Financial Position Calculator — Gratitude'
        : 'Gratitude — Your Everyday Wealth Profile'
  },
  { immediate: true },
)

function startAssessment() {
  clearRoute()
  answers.value = {}
  currentQuestionIndex.value = 0
  phase.value = 'quiz'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function answerQuestion(score: AnswerScore) {
  answers.value[currentQuestion.value.id] = score

  if (currentQuestionIndex.value === questions.length - 1) {
    phase.value = 'results'
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  currentQuestionIndex.value += 1
}

function previousQuestion() {
  if (currentQuestionIndex.value > 0) currentQuestionIndex.value -= 1
}

function goHome() {
  clearRoute()
  phase.value = 'landing'
  currentQuestionIndex.value = 0
  answers.value = {}
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function goFinancial() {
  window.location.hash = '/financial'
  phase.value = 'financial'
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function clearRoute() {
  if (window.location.hash) {
    window.history.pushState(null, '', `${window.location.pathname}${window.location.search}`)
  }
}

function syncRoute() {
  if (window.location.hash === '#/financial') {
    phase.value = 'financial'
    return
  }

  if (phase.value === 'financial') phase.value = 'landing'
}

function openSources(context: SourceContext = 'everyday') {
  sourceContext.value = context
  sourceDialog.value?.showModal()
}

function closeSources() {
  sourceDialog.value?.close()
}

function handleKeydown(event: KeyboardEvent) {
  if (phase.value !== 'quiz' || event.metaKey || event.ctrlKey || event.altKey) return

  const optionIndex = Number(event.key) - 1
  const option = answerOptions[optionIndex]

  if (option) {
    event.preventDefault()
    answerQuestion(option.score)
  }
}

onMounted(() => {
  syncRoute()
  window.addEventListener('keydown', handleKeydown)
  window.addEventListener('hashchange', syncRoute)
})

onUnmounted(() => {
  window.removeEventListener('keydown', handleKeydown)
  window.removeEventListener('hashchange', syncRoute)
})
</script>

<template>
  <Transition name="screen" mode="out-in">
    <LandingScreen
      v-if="phase === 'landing'"
      key="landing"
      @start="startAssessment"
      @financial="goFinancial"
      @sources="openSources('everyday')"
    />
    <QuizScreen
      v-else-if="phase === 'quiz'"
      :key="`question-${currentQuestionIndex}`"
      :question="currentQuestion"
      :question-number="currentQuestionIndex + 1"
      :total-questions="questions.length"
      @answer="answerQuestion"
      @back="previousQuestion"
      @home="goHome"
      @everyday="goHome"
      @financial="goFinancial"
      @sources="openSources('everyday')"
    />
    <ResultsScreen
      v-else-if="phase === 'results'"
      key="results"
      :percent="overallPercent"
      :reliable-count="reliableCount"
      :partial-count="partialCount"
      :category-results="categoryResults"
      :matched-facts="matchedFacts"
      @restart="startAssessment"
      @home="goHome"
      @everyday="goHome"
      @financial="goFinancial"
      @sources="openSources('everyday')"
    />
    <FinancialCalculator
      v-else
      key="financial"
      @home="goHome"
      @everyday="goHome"
      @sources="openSources('financial')"
    />
  </Transition>

  <dialog ref="sourceDialog" class="source-dialog" @click.self="closeSources">
    <div class="source-dialog__top">
      <div>
        <p class="eyebrow">Method &amp; sources</p>
        <h2 v-if="sourceContext === 'everyday'">What this profile can — and cannot — tell you</h2>
        <h2 v-else>How the India financial estimate works</h2>
      </div>
      <button type="button" aria-label="Close sources" @click="closeSources">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg>
      </button>
    </div>

    <div v-if="sourceContext === 'everyday'" class="source-dialog__method">
      <p>
        Answers receive 2 points for “reliably,” 1 for “sometimes,” and 0 for “not right now.”
        Category bars show the share of possible points in that category.
      </p>
      <p>
        This is not a scientific wealth index or a global percentile. The referenced datasets use
        different populations, years, and definitions, so adding them together would be misleading.
      </p>
    </div>

    <div v-else class="source-dialog__method source-dialog__method--financial">
      <p>
        Annual individual income is compared with published per-adult income thresholds. Net worth is
        calculated as the entered value of your assets minus outstanding loans and compared separately
        with per-adult wealth thresholds.
      </p>
      <p>
        Values between published thresholds are estimated using interpolation. The source benchmark is
        2022–23 and is not adjusted for inflation, region, age, or household size, so results are
        directional rather than definitive.
      </p>
    </div>

    <div v-if="sourceContext === 'everyday'" class="source-list">
      <a v-for="source in sources" :key="source.url" :href="source.url" target="_blank" rel="noreferrer">
        <span>
          <strong>{{ source.name }}</strong>
          <small>{{ source.detail }}</small>
        </span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 14 14 6M8 6h6v6" /></svg>
      </a>
    </div>
    <div v-else class="source-list">
      <a :href="financialSource.url" target="_blank" rel="noreferrer">
        <span>
          <strong>{{ financialSource.name }}</strong>
          <small>{{ financialSource.detail }}</small>
        </span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 14 14 6M8 6h6v6" /></svg>
      </a>
    </div>
  </dialog>
</template>
