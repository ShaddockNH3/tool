<script setup lang="ts">
import { computed, ref } from 'vue'
import { Trash2, Copy, Check } from 'lucide-vue-next'
import ToolShell from '../components/ToolShell.vue'
import { UiCard, UiMetricCard, UiTextarea } from '../components/ui'
import type { ToolAction } from '../utils/action'
import { countText } from '../utils/count'
import { useCopyFeedback } from '../composables/useCopyFeedback'

const { copied, copy } = useCopyFeedback()
const text = ref('今天改完了工具站的第一版原型，顺便把 🐋 和 emoji 一起算进去。\n第二行用来测行数，English words too。')
const result = computed(() => countText(text.value))

const metrics = computed(() => [
  { label: '字符', value: result.value.chars },
  { label: '中文字符', value: result.value.han },
  { label: '词数', value: result.value.words },
  { label: '行数', value: result.value.lines },
  { label: 'UTF-8 字节', value: result.value.bytes },
])

const actions = computed<ToolAction[]>(() => [
  { label: '清空', icon: Trash2, run: () => { text.value = '' } },
  {
    label: '复制结果',
    activeLabel: '已复制',
    icon: Copy,
    activeIcon: Check,
    active: copied.value,
    primary: true,
    run: () => { void copy(metrics.value.map((m) => `${m.label}：${m.value}`).join('\n')) },
  },
])
</script>

<template>
  <ToolShell :actions="actions">
    <UiCard title="输入" :meta="`${result.chars} 字符`">
      <UiTextarea v-model="text" placeholder="输入或粘贴需要统计的文本…" />
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
