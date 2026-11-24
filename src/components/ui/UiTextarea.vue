<script setup lang="ts">
withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    rows?: number
    mono?: boolean
  }>(),
  {
    placeholder: '',
    rows: 6,
    mono: false,
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()
</script>

<template>
  <textarea
    :value="modelValue"
    :placeholder="placeholder"
    :rows="rows"
    class="ui-textarea"
    :class="{ 'is-mono': mono }"
    @input="emit('update:modelValue', ($event.target as HTMLTextAreaElement).value)"
  />
</template>

<style scoped>
.ui-textarea {
  width: 100%;
  min-height: 140px;
  padding: 12px 14px;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  background: var(--muted);
  color: var(--deep-text);
  font-family: inherit;
  font-size: 13px;
  line-height: 1.7;
  resize: vertical;
  outline: none;
  transition: border-color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard);
}

.ui-textarea.is-mono {
  font-family: var(--font-mono);
  font-size: 12.5px;
}

.ui-textarea:focus {
  border-color: var(--primary);
  background: var(--card-bg);
}

.ui-textarea::placeholder {
  color: var(--content-meta);
}
</style>
