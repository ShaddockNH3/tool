<script setup lang="ts">
import { UiButton } from './ui'
import type { ToolAction } from '../utils/action'

defineProps<{ actions: ToolAction[] }>()
</script>

<template>
  <div class="action-bar">
    <UiButton
      v-for="action in actions"
      :key="action.label"
      :variant="action.primary ? 'primary' : 'regular'"
      @click="action.run"
    >
      <template v-if="action.active && action.activeIcon ? action.activeIcon : action.icon" #icon>
        <component
          :is="action.active && action.activeIcon ? action.activeIcon : action.icon"
          :size="16"
        />
      </template>
      {{ action.active && action.activeLabel ? action.activeLabel : action.label }}
    </UiButton>
  </div>
</template>
