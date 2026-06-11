<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import MoneyInput from './MoneyInput.vue'
import SiteHeader from './SiteHeader.vue'
import {
  estimatePercentile,
  financialSource,
  formatInr,
  incomeAnchors,
  wealthAnchors,
} from '../data/financial'

type IncomePeriod = 'monthly' | 'annual'

const emit = defineEmits<{
  home: []
  everyday: []
  sources: []
}>()

const period = ref<IncomePeriod>('monthly')
const submitted = ref(false)
const resultsSection = ref<HTMLElement | null>(null)

const values = reactive({
  income: 0,
  saved: 0,
  gold: 0,
  home: 0,
  bank: 0,
  investments: 0,
  retirement: 0,
  property: 0,
  car: 0,
  otherAssets: 0,
  homeLoan: 0,
  vehicleLoan: 0,
  otherDebt: 0,
})

const assetFields = [
  { key: 'gold', label: 'Gold and jewellery', hint: 'Current resale value of your share' },
  { key: 'home', label: 'Home value', hint: 'Your ownership share at today’s approximate value' },
  { key: 'bank', label: 'Bank savings and deposits', hint: 'Savings accounts, FDs, and cash' },
  { key: 'investments', label: 'Investments', hint: 'Stocks, mutual funds, bonds, and similar assets' },
  { key: 'retirement', label: 'Retirement savings', hint: 'EPF, PPF, NPS, pension corpus, and similar funds' },
  { key: 'property', label: 'Other property or land', hint: 'Your share of property beyond your primary home' },
  { key: 'car', label: 'Car or other vehicles', hint: 'Approximate current resale value' },
  { key: 'otherAssets', label: 'Other financial assets', hint: 'Business ownership, receivables, or anything not listed' },
] as const

const debtFields = [
  { key: 'homeLoan', label: 'Outstanding home loans', hint: 'Current principal still owed' },
  { key: 'vehicleLoan', label: 'Outstanding vehicle loans', hint: 'Current principal still owed' },
  { key: 'otherDebt', label: 'Other loans and debt', hint: 'Personal loans, education loans, cards, or other balances' },
] as const

const annualIncome = computed(() => (period.value === 'monthly' ? values.income * 12 : values.income))
const annualSavings = computed(() => (period.value === 'monthly' ? values.saved * 12 : values.saved))

const totalAssets = computed(() =>
  assetFields.reduce((total, field) => total + values[field.key], 0),
)

const totalDebt = computed(() =>
  debtFields.reduce((total, field) => total + values[field.key], 0),
)

const netWorth = computed(() => totalAssets.value - totalDebt.value)
const savingsRate = computed(() =>
  annualIncome.value > 0 ? Math.min(999, (annualSavings.value / annualIncome.value) * 100) : 0,
)
const incomeEstimate = computed(() => estimatePercentile(annualIncome.value, incomeAnchors))
const wealthEstimate = computed(() => estimatePercentile(netWorth.value, wealthAnchors))
const liquidAssets = computed(() => values.bank + values.investments + values.retirement)

function percentileSuffix(percentile: number) {
  if (!Number.isInteger(percentile)) return 'th'

  const remainder100 = percentile % 100
  if (remainder100 >= 11 && remainder100 <= 13) return 'th'

  const remainder10 = percentile % 10
  if (remainder10 === 1) return 'st'
  if (remainder10 === 2) return 'nd'
  if (remainder10 === 3) return 'rd'
  return 'th'
}

const hasData = computed(
  () => annualIncome.value > 0 || totalAssets.value > 0 || totalDebt.value > 0,
)

function calculate() {
  if (!hasData.value) return
  submitted.value = true
  window.setTimeout(() => resultsSection.value?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 60)
}

function reset() {
  Object.keys(values).forEach((key) => {
    values[key as keyof typeof values] = 0
  })
  submitted.value = false
  window.scrollTo({ top: 0, behavior: 'smooth' })
}
</script>

<template>
  <main class="financial-page">
    <SiteHeader active="financial" @home="emit('home')" @everyday="emit('everyday')" @financial="() => undefined" @sources="emit('sources')" />

    <section class="financial-hero">
      <div>
        <p class="eyebrow">India financial profile</p>
        <h1>See where your money places you.</h1>
      </div>
      <div class="financial-hero__intro">
        <p>
          Add your income, savings, assets, and debt to estimate your income and net-worth position
          among Indian adults.
        </p>
        <span>Your values stay in this browser and are never sent anywhere.</span>
      </div>
    </section>

    <form class="financial-form" @submit.prevent="calculate">
      <section class="finance-section finance-section--income">
        <div class="finance-section__heading">
          <span>01</span>
          <div>
            <p class="eyebrow">Money coming in</p>
            <h2>Income and saving</h2>
            <p>Use your individual pre-tax income, including salary, business, rent, and investment income.</p>
          </div>
        </div>

        <div class="finance-section__content">
          <div class="period-toggle" aria-label="Income period">
            <button type="button" :class="{ active: period === 'monthly' }" @click="period = 'monthly'">Monthly</button>
            <button type="button" :class="{ active: period === 'annual' }" @click="period = 'annual'">Annual</button>
          </div>
          <div class="finance-grid finance-grid--two">
            <MoneyInput
              id="income"
              v-model="values.income"
              :label="`${period === 'monthly' ? 'Monthly' : 'Annual'} income`"
              hint="Before tax and deductions"
              placeholder="1,00,000"
            />
            <MoneyInput
              id="saved"
              v-model="values.saved"
              :label="`Money saved ${period === 'monthly' ? 'each month' : 'each year'}`"
              hint="What you keep after spending"
              placeholder="20,000"
            />
          </div>
        </div>
      </section>

      <section class="finance-section">
        <div class="finance-section__heading">
          <span>02</span>
          <div>
            <p class="eyebrow">What you own</p>
            <h2>Your assets</h2>
            <p>Enter current approximate values in INR. For jointly owned assets, include only your share.</p>
          </div>
        </div>

        <div class="finance-section__content">
          <div class="finance-grid">
            <MoneyInput
              v-for="field in assetFields"
              :id="field.key"
              :key="field.key"
              v-model="values[field.key]"
              :label="field.label"
              :hint="field.hint"
            />
          </div>
          <div class="running-total">
            <span>Total assets</span>
            <strong>{{ formatInr(totalAssets, true) }}</strong>
          </div>
        </div>
      </section>

      <section class="finance-section finance-section--debt">
        <div class="finance-section__heading">
          <span>03</span>
          <div>
            <p class="eyebrow">What you owe</p>
            <h2>Loans and debt</h2>
            <p>Net worth is assets minus outstanding debt. Leave these at zero if you have none.</p>
          </div>
        </div>

        <div class="finance-section__content">
          <div class="finance-grid finance-grid--three">
            <MoneyInput
              v-for="field in debtFields"
              :id="field.key"
              :key="field.key"
              v-model="values[field.key]"
              :label="field.label"
              :hint="field.hint"
            />
          </div>
          <div class="running-total running-total--debt">
            <span>Total debt</span>
            <strong>{{ formatInr(totalDebt, true) }}</strong>
          </div>
        </div>
      </section>

      <div class="calculate-bar">
        <div>
          <span>Estimated net worth</span>
          <strong>{{ formatInr(netWorth, true) }}</strong>
        </div>
        <button class="primary-button" type="submit" :disabled="!hasData">
          Calculate my position
          <svg viewBox="0 0 20 20" aria-hidden="true"><path d="M4 10h11M11 6l4 4-4 4" /></svg>
        </button>
      </div>
    </form>

    <Transition name="result-rise">
      <section v-if="submitted" ref="resultsSection" class="financial-results">
        <div class="financial-results__heading">
          <p class="eyebrow">Your estimated position</p>
          <h2>Your money tells two different stories.</h2>
          <p>
            Income shows your current earning position. Net worth shows accumulated assets after debt.
            They are estimated separately because the source does not publish their joint distribution.
          </p>
        </div>

        <div class="percentile-results">
          <article class="percentile-card percentile-card--income">
            <div class="percentile-card__top">
              <span>Annual income</span>
              <strong>{{ formatInr(annualIncome, true) }}</strong>
            </div>
            <div class="percentile-card__rank">
              <span>{{ incomeEstimate.band }}</span>
              <strong>{{ incomeEstimate.percentile.toFixed(incomeEstimate.percentile >= 90 ? 1 : 0) }}<small>{{ percentileSuffix(incomeEstimate.percentile) }}</small></strong>
              <p>estimated income percentile</p>
            </div>
            <div class="percentile-track" aria-hidden="true">
              <span :style="{ width: `${incomeEstimate.percentile}%` }"></span>
            </div>
            <p>{{ incomeEstimate.comparison }}</p>
          </article>

          <article class="percentile-card percentile-card--wealth">
            <div class="percentile-card__top">
              <span>Net worth</span>
              <strong>{{ formatInr(netWorth, true) }}</strong>
            </div>
            <div class="percentile-card__rank">
              <span>{{ netWorth < 0 ? 'Negative net worth' : wealthEstimate.band }}</span>
              <strong>{{ wealthEstimate.percentile.toFixed(wealthEstimate.percentile >= 90 ? 1 : 0) }}<small>{{ percentileSuffix(wealthEstimate.percentile) }}</small></strong>
              <p>estimated wealth percentile</p>
            </div>
            <div class="percentile-track" aria-hidden="true">
              <span :style="{ width: `${wealthEstimate.percentile}%` }"></span>
            </div>
            <p>{{ netWorth < 0 ? 'Your outstanding debt is greater than your entered assets.' : wealthEstimate.comparison }}</p>
          </article>
        </div>

        <div class="financial-snapshot">
          <article>
            <span>Savings rate</span>
            <strong>{{ savingsRate.toFixed(1) }}%</strong>
            <p>{{ formatInr(annualSavings, true) }} saved per year</p>
          </article>
          <article>
            <span>Liquid and invested assets</span>
            <strong>{{ formatInr(liquidAssets, true) }}</strong>
            <p>Bank, investments, and retirement funds</p>
          </article>
          <article>
            <span>Debt against assets</span>
            <strong>{{ totalAssets > 0 ? ((totalDebt / totalAssets) * 100).toFixed(1) : '0.0' }}%</strong>
            <p>{{ formatInr(totalDebt, true) }} outstanding</p>
          </article>
        </div>

        <div class="financial-method">
          <div>
            <p class="eyebrow">Read this estimate carefully</p>
            <h3>Directional, not definitive.</h3>
          </div>
          <div>
            <p>
              The calculator interpolates between published 2022–23 thresholds for Indian adults.
              Below the median, where fewer thresholds are available, the estimate is especially broad.
            </p>
            <p>
              Current values are compared with a 2022–23 benchmark without inflation or regional
              adjustment, so the result may overstate today’s position. It is not tax, investment, or
              financial-planning advice.
            </p>
            <a :href="financialSource.url" target="_blank" rel="noreferrer">
              Read the World Inequality Lab paper
              <svg viewBox="0 0 18 18" aria-hidden="true"><path d="M6 12 12 6M7 6h5v5" /></svg>
            </a>
          </div>
        </div>

        <button class="reset-finances" type="button" @click="reset">Clear all values and start again</button>
      </section>
    </Transition>
  </main>
</template>
