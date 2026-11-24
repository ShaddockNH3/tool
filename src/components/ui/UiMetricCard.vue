<script setup lang="ts">
defineProps<{
  label: string
  value: string | number
}>()
</script>

<template>
  <div class="ui-metric">
    <div class="ui-metric-label">{{ label }}</div>
    <div class="ui-metric-value">{{ value }}</div>
  </div>
</template>

<style scoped>
.ui-metric {
  background: var(--card-bg);
  border-radius: var(--radius-large);
  padding: 16px 18px;
  transition: background-color var(--duration-normal) var(--ease-standard);
}

.ui-metric-label {
  font-size: 12px;
  font-weight: 500;
  color: var(--content-meta);
  margin-bottom: 6px;
}

.ui-metric-value {
  font-size: 22px;
  font-weight: 700;
  color: var(--primary);
  font-variant-numeric: tabular-nums;
  line-height: 1.25;
}
</style>
