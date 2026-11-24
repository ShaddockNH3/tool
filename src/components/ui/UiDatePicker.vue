<script setup lang="ts">
defineProps<{
  modelValue: string
}>()

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

function handleInput(event: Event) {
  const val = (event.target as HTMLInputElement).value
  if (val) emit('update:modelValue', val)
}
</script>

<template>
  <input
    type="date"
    :value="modelValue"
    class="ui-date"
    @input="handleInput"
  />
</template>

<style scoped>
.ui-date {
  height: 38px;
  padding: 0 12px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: var(--muted);
  color: var(--deep-text);
  font-family: var(--font-mono);
  font-size: 13px;
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard);
}

.ui-date:focus {
  border-color: var(--primary);
  background: var(--card-bg);
}
</style>
