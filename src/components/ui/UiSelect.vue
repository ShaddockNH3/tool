<script setup lang="ts">
import { ChevronDown } from 'lucide-vue-next'

export interface SelectOption {
  label: string
  value: string | number
}

defineProps<{
  modelValue: string | number
  options: SelectOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="ui-select-wrap">
    <select
      :value="modelValue"
      class="ui-select-el"
      @change="emit('update:modelValue', ($event.target as HTMLSelectElement).value)"
    >
      <option v-for="opt in options" :key="opt.value" :value="opt.value">
        {{ opt.label }}
      </option>
    </select>
    <ChevronDown :size="15" class="ui-select-arrow" />
  </div>
</template>

<style scoped>
.ui-select-wrap {
  position: relative;
  display: inline-flex;
  align-items: center;
  width: 100%;
}

.ui-select-el {
  width: 100%;
  height: 38px;
  padding: 0 30px 0 12px;
  appearance: none;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: var(--muted);
  color: var(--deep-text);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard);
}

.ui-select-el:focus {
  border-color: var(--primary);
  background: var(--card-bg);
}

.ui-select-arrow {
  position: absolute;
  right: 10px;
  pointer-events: none;
  color: var(--content-meta);
}
</style>
