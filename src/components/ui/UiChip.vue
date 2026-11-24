<script setup lang="ts">
withDefaults(
  defineProps<{
    active?: boolean
    shape?: 'pill' | 'rectangle'
    clickable?: boolean
  }>(),
  {
    active: false,
    shape: 'pill',
    clickable: true,
  },
)
</script>

<template>
  <component
    :is="clickable ? 'button' : 'span'"
    :type="clickable ? 'button' : undefined"
    class="ui-chip"
    :class="[`is-${shape}`, { 'is-active': active, 'is-clickable': clickable }]"
  >
    <slot />
  </component>
</template>

<style scoped>
.ui-chip {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  border: none;
  padding: 4px 11px;
  font-family: inherit;
  font-size: 12px;
  font-weight: 500;
  background: var(--muted);
  color: var(--text-2);
  transition: background-color var(--duration-fast) var(--ease-standard),
    color var(--duration-fast) var(--ease-standard);
}

.ui-chip.is-pill {
  border-radius: var(--radius-pill);
}

.ui-chip.is-rectangle {
  border-radius: var(--radius-sm);
}

.ui-chip.is-clickable {
  cursor: pointer;
}

.ui-chip.is-clickable:hover:not(.is-active) {
  background: var(--muted-hover);
  color: var(--deep-text);
}

.ui-chip.is-active {
  background: var(--btn-regular-bg);
  color: var(--btn-content);
  font-weight: 600;
}
</style>
