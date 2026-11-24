<script setup lang="ts">
import { computed } from 'vue'
import { RotateCcw, Copy, Check } from 'lucide-vue-next'
import ToolShell from '../components/ToolShell.vue'
import { UiCard, UiChip, UiDatePicker, UiMetricCard } from '../components/ui'
import type { ToolAction } from '../utils/action'
import { useToolProcessor } from '../composables/useToolProcessor'
import { useCopyFeedback } from '../composables/useCopyFeedback'
import { diffFromToday, describeDiff, todayISO, addDays, sameDayNextYear } from '../utils/dateDiff'
import type { DateDiffResult } from '../utils/dateDiff'

const today = todayISO()
const initial = addDays(today, 100)
const { copied, copy } = useCopyFeedback()

const { input, output, error } = useToolProcessor<string, DateDiffResult>({
  initial,
  process: (text) => diffFromToday(text, today),
})

const headline = computed(() => (output.value ? describeDiff(output.value) : ''))

const metrics = computed(() => {
  const result = output.value
  if (!result) return []
  return [
    { label: '相差天数', value: result.absDays },
    { label: '折合', value: `${result.weeks} 周 ${result.restDays} 天` },
    { label: '目标日星期', value: result.weekday },
    { label: '当年第几天', value: result.dayOfYear },
    { label: '闰年', value: result.isLeap ? '是' : '否' },
  ]
})

const quickPicks = computed(() => [
  { label: '今天', value: today },
  { label: '100 天后', value: addDays(today, 100) },
  { label: '今年年底', value: `${today.slice(0, 4)}-12-31` },
  { label: '明年今天', value: sameDayNextYear(today) },
])

function setDate(value: string) {
  if (value) input.value = value
}

const summary = computed(() => {
  const result = output.value
  if (!result) return ''
  return `${result.target}：${describeDiff(result)}（${result.weekday}）`
})

const actions = computed<ToolAction[]>(() => [
  { label: '重置', icon: RotateCcw, run: () => { input.value = initial } },
  {
    label: '复制结果',
    activeLabel: '已复制',
    icon: Copy,
    activeIcon: Check,
    active: copied.value,
    primary: true,
    run: () => { void copy(summary.value) },
  },
])
</script>

<template>
  <ToolShell :actions="actions" :error="error">
    <UiCard>
      <div class="date-row">
        <div class="date-picker-col">
          <div class="field-label">目标日期</div>
          <UiDatePicker :model-value="input" style="width: 100%" @update:model-value="setDate" />
        </div>
        <div class="chips">
          <UiChip
            v-for="pick in quickPicks"
            :key="pick.label"
            shape="pill"
            :active="input === pick.value"
            @click="setDate(pick.value)"
          >
            {{ pick.label }}
          </UiChip>
        </div>
      </div>
    </UiCard>

    <UiCard>
      <div class="date-headline">
        <span class="headline">{{ headline }}</span>
        <span class="headline-sub">{{ output?.target }} · 今天 {{ output?.today }}</span>
      </div>
    </UiCard>

    <div class="metric-grid">
      <UiMetricCard
        v-for="metric in metrics"
        :key="metric.label"
        :label="metric.label"
        :value="metric.value"
      />
    </div>
  </ToolShell>
</template>
