<script setup lang="ts">
withDefaults(
  defineProps<{
    value?: string
    placeholder?: string
    accent?: boolean
  }>(),
  {
    value: '',
    placeholder: '暂无输出结果',
    accent: false,
  },
)
</script>

<template>
  <pre class="ui-output" :class="{ 'is-accent': accent, 'is-empty': !value }">{{
    value || placeholder
  }}</pre>
</template>

<style scoped>
.ui-output {
  margin: 0;
  min-height: 140px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: var(--muted);
  color: var(--deep-text);
  font-family: var(--font-mono);
  font-size: 12.5px;
  line-height: 1.7;
  white-space: pre-wrap;
  word-break: break-all;
  overflow-x: auto;
}

.ui-output.is-accent {
  color: var(--primary);
  letter-spacing: 0.015em;
}

.ui-output.is-empty {
  color: var(--content-meta);
  font-family: var(--font-sans);
}
</style>
