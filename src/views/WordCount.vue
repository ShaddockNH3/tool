<script setup lang="ts">
import { computed, ref } from 'vue'
import { NCard, NInput, NGrid, NGi, NStatistic } from 'naive-ui'
import { Trash2, Copy } from 'lucide-vue-next'
import ActionBar from '../components/ActionBar.vue'
import type { ToolAction } from '../utils/action'
import { countText } from '../utils/count'
import { copyText } from '../utils/clipboard'
import { useViewport } from '../composables/useViewport'

const { isNarrow, isPhone } = useViewport()
const text = ref('今天改完了工具站的第一版原型，顺便把 🐋 和 emoji 一起算进去。\n第二行用来测行数，English words too。')
const result = computed(() => countText(text.value))
const cols = computed(() => (isPhone.value ? 2 : isNarrow.value ? 3 : 5))

const metrics = computed(() => [
  { label: '字符', value: result.value.chars },
  { label: '中文字符', value: result.value.han },
  { label: '词数', value: result.value.words },
  { label: '行数', value: result.value.lines },
  { label: 'UTF-8 字节', value: result.value.bytes },
])

const actions: ToolAction[] = [
  { label: '清空', icon: Trash2, run: () => { text.value = '' } },
  {
    label: '复制结果',
    icon: Copy,
    primary: true,
    run: () => { void copyText(metrics.value.map((m) => `${m.label}：${m.value}`).join('\n')) },
  },
]
</script>

<template>
  <div class="tool-page">
    <n-card>
      <div class="card-head">
        <span class="card-title">输入</span>
        <span class="card-meta">{{ result.chars }} 字符</span>
      </div>
      <n-input v-model:value="text" type="textarea" />
    </n-card>

    <n-grid :cols="cols" :x-gap="10" :y-gap="10" style="margin-bottom: 12px">
      <n-gi v-for="metric in metrics" :key="metric.label">
        <n-card class="metric">
          <n-statistic :label="metric.label" :value="metric.value" />
        </n-card>
      </n-gi>
    </n-grid>

    <ActionBar :actions="actions" />
  </div>
</template>
