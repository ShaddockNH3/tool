<script setup lang="ts">
import { UiAlert } from './ui'
import ActionBar from './ActionBar.vue'
import type { ToolAction } from '../utils/action'

withDefaults(defineProps<{ actions: ToolAction[]; error?: string }>(), { error: '' })
</script>

<template>
  <div class="tool-page">
    <slot name="top" />
    <UiAlert :message="error" />
    <slot />
    <ActionBar :actions="actions" />
  </div>
</template>
