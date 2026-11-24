import type { Component } from 'vue'

export interface ToolAction {
  label: string
  activeLabel?: string
  icon?: Component
  activeIcon?: Component
  active?: boolean
  primary?: boolean
  run: () => void
}
