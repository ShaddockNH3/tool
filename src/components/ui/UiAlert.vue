<script setup lang="ts">
import { AlertCircle } from 'lucide-vue-next'

defineProps<{
  message: string
}>()
</script>

<template>
  <div v-if="message" class="ui-alert" role="alert">
    <AlertCircle :size="16" class="ui-alert-icon" />
    <span>{{ message }}</span>
  </div>
</template>

<style scoped>
.ui-alert {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 14px;
  border-radius: var(--radius-md);
  background: var(--caution-bg);
  color: var(--caution-color);
  font-size: 13px;
  font-weight: 500;
}

.ui-alert-icon {
  flex: none;
}
</style>
