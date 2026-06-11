<script setup lang="ts">
import { computed } from 'vue'
import CategoryIcon from './CategoryIcon.vue'
import SiteHeader from './SiteHeader.vue'
import {
  answerOptions,
  categories,
  type AnswerScore,
  type Question,
} from '../data/assessment'

const props = defineProps<{
  question: Question
  questionNumber: number
  totalQuestions: number
}>()

const emit = defineEmits<{
  answer: [score: AnswerScore]
  back: []
  home: []
  everyday: []
  financial: []
  sources: []
}>()

const category = computed(() => categories.find((item) => item.id === props.question.category)!)
const progress = computed(() => ((props.questionNumber - 1) / props.totalQuestions) * 100)
</script>

<template>
  <main class="quiz">
    <SiteHeader
      @home="emit('home')"
      @everyday="emit('everyday')"
      @financial="emit('financial')"
      @sources="emit('sources')"
    />

    <div class="quiz__progress" aria-hidden="true">
      <span :style="{ width: `${progress}%` }"></span>
    </div>

    <section class="quiz__content">
      <div class="question-meta">
        <span class="icon-shell"><CategoryIcon :category="question.category" /></span>
        <span>{{ category.label }}</span>
        <span class="question-meta__count">{{ questionNumber }} / {{ totalQuestions }}</span>
      </div>

      <Transition name="question" mode="out-in">
        <div :key="question.id" class="question-card">
          <h1>{{ question.prompt }}</h1>
          <p>{{ question.guidance }}</p>

          <div class="answer-list" role="group" :aria-label="`Answer question ${questionNumber}`">
            <button
              v-for="(option, index) in answerOptions"
              :key="option.score"
              class="answer-option"
              type="button"
              @click="emit('answer', option.score)"
            >
              <span class="answer-option__key">{{ index + 1 }}</span>
              <span class="answer-option__copy">
                <strong>{{ option.label }}</strong>
                <small>{{ option.detail }}</small>
              </span>
              <svg viewBox="0 0 20 20" aria-hidden="true">
                <path d="M4 10h11M11 6l4 4-4 4" />
              </svg>
            </button>
          </div>
        </div>
      </Transition>

      <div class="quiz__footer">
        <button class="back-button" type="button" :disabled="questionNumber === 1" @click="emit('back')">
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="m12 5-5 5 5 5" /></svg>
          Previous
        </button>
        <span>Use keys 1, 2, or 3 to answer</span>
      </div>
    </section>
  </main>
</template>
