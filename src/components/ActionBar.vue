<script setup lang="ts">
import { NButton } from 'naive-ui'
import type { ToolAction } from '../utils/action'

defineProps<{ actions: ToolAction[] }>()
</script>

<template>
  <div class="action-bar">
    <n-button
      v-for="action in actions"
      :key="action.label"
      :class="{ 'is-primary': action.primary }"
      @click="action.run"
    >
      <template v-if="action.icon" #icon>
        <component :is="action.icon" :size="16" />
      </template>
      {{ action.label }}
    </n-button>
  </div>
</template>
