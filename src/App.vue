<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
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

type AppPhase = 'landing' | 'quiz' | 'results'

const phase = ref<AppPhase>('landing')
const currentQuestionIndex = ref(0)
const answers = ref<Record<string, AnswerScore>>({})
const sourceDialog = ref<HTMLDialogElement | null>(null)

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

function startAssessment() {
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
  phase.value = 'landing'
  currentQuestionIndex.value = 0
  answers.value = {}
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openSources() {
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

onMounted(() => window.addEventListener('keydown', handleKeydown))
onUnmounted(() => window.removeEventListener('keydown', handleKeydown))
</script>

<template>
  <Transition name="screen" mode="out-in">
    <LandingScreen
      v-if="phase === 'landing'"
      key="landing"
      @start="startAssessment"
      @sources="openSources"
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
      @sources="openSources"
    />
    <ResultsScreen
      v-else
      key="results"
      :percent="overallPercent"
      :reliable-count="reliableCount"
      :partial-count="partialCount"
      :category-results="categoryResults"
      :matched-facts="matchedFacts"
      @restart="startAssessment"
      @home="goHome"
      @sources="openSources"
    />
  </Transition>

  <dialog ref="sourceDialog" class="source-dialog" @click.self="closeSources">
    <div class="source-dialog__top">
      <div>
        <p class="eyebrow">Method &amp; sources</p>
        <h2>What this profile can — and cannot — tell you</h2>
      </div>
      <button type="button" aria-label="Close sources" @click="closeSources">
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m5 5 10 10M15 5 5 15" /></svg>
      </button>
    </div>

    <div class="source-dialog__method">
      <p>
        Answers receive 2 points for “reliably,” 1 for “sometimes,” and 0 for “not right now.”
        Category bars show the share of possible points in that category.
      </p>
      <p>
        This is not a scientific wealth index or a global percentile. The referenced datasets use
        different populations, years, and definitions, so adding them together would be misleading.
      </p>
    </div>

    <div class="source-list">
      <a v-for="source in sources" :key="source.url" :href="source.url" target="_blank" rel="noreferrer">
        <span>
          <strong>{{ source.name }}</strong>
          <small>{{ source.detail }}</small>
        </span>
        <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M6 14 14 6M8 6h6v6" /></svg>
      </a>
    </div>
  </dialog>
</template>
