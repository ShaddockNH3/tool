<script setup lang="ts">
import { computed } from 'vue'
import { NCard, NGrid, NGi, NStatistic, NDatePicker, NTag } from 'naive-ui'
import { RotateCcw, Copy } from 'lucide-vue-next'
import ToolShell from '../components/ToolShell.vue'
import type { ToolAction } from '../utils/action'
import { useToolProcessor } from '../composables/useToolProcessor'
import { diffFromToday, describeDiff, todayISO, addDays, sameDayNextYear } from '../utils/dateDiff'
import type { DateDiffResult } from '../utils/dateDiff'
import { copyText } from '../utils/clipboard'
import { useViewport } from '../composables/useViewport'

const { isNarrow, isPhone } = useViewport()

const today = todayISO()
const initial = addDays(today, 100)

const { input, output, error } = useToolProcessor<string, DateDiffResult>({
  initial,
  process: (text) => diffFromToday(text, today),
})

const cols = computed(() => (isPhone.value ? 2 : isNarrow.value ? 3 : 5))

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

function setDate(value: string | null) {
  if (value) input.value = value
}

const summary = computed(() => {
  const result = output.value
  if (!result) return ''
  return `${result.target}：${describeDiff(result)}（${result.weekday}）`
})

const actions: ToolAction[] = [
  { label: '重置', icon: RotateCcw, run: () => { input.value = initial } },
  { label: '复制结果', icon: Copy, primary: true, run: () => { void copyText(summary.value) } },
]
</script>

<template>
  <ToolShell :actions="actions" :error="error">
    <n-card>
      <div class="date-row">
        <div>
          <div class="field-label">目标日期</div>
          <n-date-picker
            :formatted-value="input"
            value-format="yyyy-MM-dd"
            type="date"
            :clearable="false"
            style="width: 176px"
            @update:formatted-value="setDate"
          />
        </div>
        <div class="chips">
          <n-tag
            v-for="pick in quickPicks"
            :key="pick.label"
            size="small"
            :bordered="false"
            :type="input === pick.value ? 'primary' : 'default'"
            @click="setDate(pick.value)"
          >
            {{ pick.label }}
          </n-tag>
        </div>
      </div>
    </n-card>

    <n-card>
      <div class="date-headline">
        <span class="headline">{{ headline }}</span>
        <span class="headline-sub">{{ output?.target }} · 今天 {{ output?.today }}</span>
      </div>
    </n-card>

    <n-grid :cols="cols" :x-gap="10" :y-gap="10" class="metric-grid">
      <n-gi v-for="metric in metrics" :key="metric.label">
        <n-card class="metric">
          <n-statistic :label="metric.label" :value="metric.value" />
        </n-card>
      </n-gi>
    </n-grid>
  </ToolShell>
</template>
