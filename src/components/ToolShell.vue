<script setup lang="ts">
import { NAlert } from 'naive-ui'
import ActionBar from './ActionBar.vue'
import type { ToolAction } from '../utils/action'

withDefaults(defineProps<{ actions: ToolAction[]; error?: string }>(), { error: '' })
</script>

<template>
  <div class="tool-page">
    <slot name="top" />
    <n-alert v-if="error" type="error" class="tool-error">{{ error }}</n-alert>
    <slot />
    <ActionBar :actions="actions" />
  </div>
</template>
