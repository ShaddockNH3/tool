<script setup lang="ts">
export interface SegmentedOption {
  label: string
  value: string
}

defineProps<{
  modelValue: string
  options: SegmentedOption[]
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <div class="ui-segmented" role="radiogroup">
    <button
      v-for="opt in options"
      :key="opt.value"
      type="button"
      role="radio"
      :aria-checked="modelValue === opt.value"
      class="ui-segmented-item"
      :class="{ 'is-active': modelValue === opt.value }"
      @click="emit('update:modelValue', opt.value)"
    >
      {{ opt.label }}
    </button>
  </div>
</template>

<style scoped>
.ui-segmented {
  display: inline-flex;
  padding: 3px;
  gap: 2px;
  background: var(--muted);
  border-radius: var(--radius-md);
}

.ui-segmented-item {
  border: none;
  background: transparent;
  color: var(--text-2);
  font-family: inherit;
  font-size: 13px;
  font-weight: 500;
  padding: 5px 12px;
  border-radius: calc(var(--radius-md) - 3px);
  cursor: pointer;
  transition: background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard),
    box-shadow var(--duration-fast) var(--ease-standard);
}

.ui-segmented-item:hover:not(.is-active) {
  color: var(--deep-text);
}

.ui-segmented-item.is-active {
  background: var(--card-bg);
  color: var(--primary);
  font-weight: 600;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.06);
}

:root.dark .ui-segmented-item.is-active {
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.25);
}
</style>
