<script setup lang="ts">
import { computed, ref, watch } from 'vue'

const props = withDefaults(
  defineProps<{
    id: string
    modelValue: number
    label: string
    hint?: string
    placeholder?: string
  }>(),
  {
    hint: '',
    placeholder: '0',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: number]
}>()

const focused = ref(false)
const textValue = ref('')

const displayValue = computed(() => {
  if (focused.value) return textValue.value
  if (!props.modelValue) return ''
  return props.modelValue.toLocaleString('en-IN', { maximumFractionDigits: 0 })
})

watch(
  () => props.modelValue,
  (value) => {
    if (!focused.value) textValue.value = value ? String(Math.round(value)) : ''
  },
  { immediate: true },
)

function parseValue(value: string) {
  const digits = value.replace(/[^0-9.]/g, '')
  const parsed = Number(digits)
  return Number.isFinite(parsed) ? Math.max(0, parsed) : 0
}

function handleInput(event: Event) {
  const value = (event.target as HTMLInputElement).value
  textValue.value = value
  emit('update:modelValue', parseValue(value))
}

function handleFocus() {
  focused.value = true
  textValue.value = props.modelValue ? String(Math.round(props.modelValue)) : ''
}

function handleBlur() {
  focused.value = false
}
</script>

<template>
  <label class="money-field" :for="id">
    <span class="money-field__label">{{ label }}</span>
    <span class="money-field__control">
      <span aria-hidden="true">₹</span>
      <input
        :id="id"
        :value="displayValue"
        type="text"
        inputmode="decimal"
        autocomplete="off"
        :placeholder="placeholder"
        @input="handleInput"
        @focus="handleFocus"
        @blur="handleBlur"
      />
    </span>
    <small v-if="hint">{{ hint }}</small>
  </label>
</template>
