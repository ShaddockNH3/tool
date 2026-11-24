<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'regular' | 'primary' | 'plain'
    size?: 'sm' | 'md'
    circle?: boolean
    type?: 'button' | 'submit' | 'reset'
    disabled?: boolean
  }>(),
  {
    variant: 'regular',
    size: 'md',
    circle: false,
    type: 'button',
    disabled: false,
  },
)
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="ui-btn"
    :class="[`is-${variant}`, `is-${size}`, { 'is-circle': circle }]"
  >
    <slot name="icon" />
    <slot />
  </button>
</template>

<style scoped>
.ui-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  border: none;
  border-radius: var(--radius-md);
  font-family: inherit;
  font-weight: 600;
  cursor: pointer;
  white-space: nowrap;
  user-select: none;
  transition: background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard),
    transform var(--duration-fast) var(--ease-standard);
}

.ui-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.ui-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.ui-btn.is-md {
  height: 36px;
  padding: 0 14px;
  font-size: 13px;
}

.ui-btn.is-sm {
  height: 30px;
  padding: 0 10px;
  font-size: 12px;
  border-radius: var(--radius-sm);
}

.ui-btn.is-circle {
  padding: 0;
  width: 36px;
  border-radius: var(--radius-pill);
}

.ui-btn.is-circle.is-sm {
  width: 30px;
}

.ui-btn.is-regular {
  background: var(--btn-regular-bg);
  color: var(--btn-content);
}

.ui-btn.is-regular:hover:not(:disabled) {
  background: var(--btn-regular-bg-hover);
}

.ui-btn.is-regular:active:not(:disabled) {
  background: var(--btn-regular-bg-active);
}

.ui-btn.is-primary {
  background: var(--primary);
  color: #ffffff;
}

:root.dark .ui-btn.is-primary {
  color: oklch(0.16 0.014 var(--hue));
}

.ui-btn.is-primary:hover:not(:disabled) {
  background: var(--primary-hover);
}

.ui-btn.is-primary:active:not(:disabled) {
  background: var(--primary-active);
}

.ui-btn.is-plain {
  background: transparent;
  color: var(--text-2);
}

.ui-btn.is-plain:hover:not(:disabled) {
  background: var(--btn-plain-bg-hover);
  color: var(--deep-text);
}

.ui-btn.is-plain:active:not(:disabled) {
  background: var(--btn-plain-bg-active);
}
</style>
