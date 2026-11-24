<script setup lang="ts">
import { computed, ref } from 'vue'
import { Trash2, Copy, Check } from 'lucide-vue-next'
import ToolShell from '../components/ToolShell.vue'
import { UiButton, UiCard, UiCodeOutput, UiSegmented, UiTextarea } from '../components/ui'
import type { SegmentedOption } from '../components/ui'
import type { ToolAction } from '../utils/action'
import { useToolProcessor } from '../composables/useToolProcessor'
import { useCopyFeedback } from '../composables/useCopyFeedback'
import { formatJson, formatHtml } from '../utils/format'
import type { FormatKind, FormatMode } from '../utils/format'

const DEMO_JSON = '{"name":"attilio","tools":["count","format","base64","base","date"],"ok":true}'
const DEMO_HTML = '<div class="box"><span>hi</span><span>there</span></div>'

const kindOptions: SegmentedOption[] = [
  { label: 'JSON', value: 'json' },
  { label: 'HTML', value: 'html' },
]

const modeOptions: SegmentedOption[] = [
  { label: '美化', value: 'pretty' },
  { label: '压缩', value: 'minify' },
]

const kind = ref<FormatKind>('json')
const mode = ref<FormatMode>('pretty')
const { copied, copy } = useCopyFeedback()

const { input, output, error } = useToolProcessor<string, string>({
  initial: DEMO_JSON,
  process: async (text) => {
    if (!text.trim()) return ''
    return kind.value === 'json' ? formatJson(text, mode.value) : await formatHtml(text, mode.value)
  },
  extra: [kind, mode],
})

function setKind(next: string) {
  const value = next as FormatKind
  kind.value = value
  input.value = value === 'json' ? DEMO_JSON : DEMO_HTML
}

function setMode(next: string) {
  mode.value = next as FormatMode
}

function copyOutput() {
  void copy(output.value ?? '')
}

const actions = computed<ToolAction[]>(() => [
  { label: '清空', icon: Trash2, run: () => { input.value = '' } },
  {
    label: '复制结果',
    activeLabel: '已复制',
    icon: Copy,
    activeIcon: Check,
    active: copied.value,
    primary: true,
    run: copyOutput,
  },
])
</script>

<template>
  <ToolShell :actions="actions" :error="error">
    <template #top>
      <UiCard compact>
        <div class="row-between">
          <UiSegmented :model-value="kind" :options="kindOptions" @update:model-value="setKind" />
          <UiSegmented :model-value="mode" :options="modeOptions" @update:model-value="setMode" />
        </div>
      </UiCard>
    </template>

    <div class="fmt-grid">
      <UiCard title="输入" meta="自动处理">
        <UiTextarea v-model="input" mono :rows="10" placeholder="粘贴 JSON 或 HTML…" />
      </UiCard>

      <UiCard title="输出" :meta="`${(output ?? '').length} 字符`">
        <template #header-extra>
          <UiButton size="sm" variant="regular" @click="copyOutput">
            <template #icon><component :is="copied ? Check : Copy" :size="14" /></template>
            {{ copied ? '已复制' : '复制' }}
          </UiButton>
        </template>
        <UiCodeOutput :value="output" />
      </UiCard>
    </div>
  </ToolShell>
</template>
