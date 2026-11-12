import type { Component } from 'vue'

export interface ToolAction {
  label: string
  icon?: Component
  primary?: boolean
  run: () => void
}
