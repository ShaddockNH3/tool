<script setup lang="ts">
import { ref } from 'vue'
import { X } from 'lucide-vue-next'

withDefaults(
  defineProps<{
    modelValue: string
    placeholder?: string
    readonly?: boolean
    clearable?: boolean
    mono?: boolean
    size?: 'sm' | 'md'
  }>(),
  {
    placeholder: '',
    readonly: false,
    clearable: false,
    mono: false,
    size: 'md',
  },
)

const emit = defineEmits<{
  'update:modelValue': [value: string]
}>()

const inputEl = ref<HTMLInputElement | null>(null)

function focus() {
  inputEl.value?.focus()
}

defineExpose({ focus })
</script>

<template>
  <div class="ui-input-wrap" :class="[`is-${size}`, { 'is-readonly': readonly }]">
    <span v-if="$slots.prefix" class="ui-input-prefix">
      <slot name="prefix" />
    </span>
    <input
      ref="inputEl"
      :value="modelValue"
      :placeholder="placeholder"
      :readonly="readonly"
      class="ui-input-el"
      :class="{ 'is-mono': mono }"
      @input="emit('update:modelValue', ($event.target as HTMLInputElement).value)"
    />
    <button
      v-if="clearable && modelValue && !readonly"
      type="button"
      class="ui-input-clear"
      aria-label="清空"
      @click="emit('update:modelValue', '')"
    >
      <X :size="14" />
    </button>
  </div>
</template>

<style scoped>
.ui-input-wrap {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  background: var(--muted);
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  transition: border-color var(--duration-fast) var(--ease-standard),
    background-color var(--duration-fast) var(--ease-standard);
}

.ui-input-wrap.is-md {
  height: 38px;
}

.ui-input-wrap.is-sm {
  height: 34px;
  border-radius: var(--radius-sm);
}

.ui-input-wrap:focus-within {
  border-color: var(--primary);
  background: var(--card-bg);
}

.ui-input-prefix {
  display: inline-flex;
  color: var(--content-meta);
  flex: none;
}

.ui-input-el {
  width: 100%;
  min-width: 0;
  border: none;
  background: transparent;
  color: var(--deep-text);
  font-family: inherit;
  font-size: 13px;
  outline: none;
}

.ui-input-el.is-mono {
  font-family: var(--font-mono);
}

.ui-input-el::placeholder {
  color: var(--content-meta);
}

.ui-input-clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 2px;
  border: none;
  border-radius: var(--radius-pill);
  background: transparent;
  color: var(--content-meta);
  cursor: pointer;
}

.ui-input-clear:hover {
  background: var(--btn-plain-bg-hover);
  color: var(--deep-text);
}
</style>
