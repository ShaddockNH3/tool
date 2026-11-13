<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NInput, NRadioGroup, NRadioButton, NButton } from 'naive-ui'
import { Trash2, Copy } from 'lucide-vue-next'
import ToolShell from '../components/ToolShell.vue'
import type { ToolAction } from '../utils/action'
import { useToolProcessor } from '../composables/useToolProcessor'
import { formatJson, formatHtml } from '../utils/format'
import type { FormatKind, FormatMode } from '../utils/format'
import { copyText } from '../utils/clipboard'

const DEMO_JSON = '{"name":"attilio","tools":["count","format","base64","base","date"],"ok":true}'
const DEMO_HTML = '<div class="box"><span>hi</span><span>there</span></div>'

const kind = ref<FormatKind>('json')
const mode = ref<FormatMode>('pretty')

const { input, output, error } = useToolProcessor<string, string>({
  initial: DEMO_JSON,
  process: async (text) => {
    if (!text.trim()) return ''
    return kind.value === 'json' ? formatJson(text, mode.value) : await formatHtml(text, mode.value)
  },
  extra: [kind, mode],
})

function setKind(next: string | number) {
  const value = String(next) as FormatKind
  kind.value = value
  input.value = value === 'json' ? DEMO_JSON : DEMO_HTML
}

function setMode(next: string | number) {
  mode.value = String(next) as FormatMode
}

function copyOutput() {
  void copyText(output.value ?? '')
}

const actions: ToolAction[] = [
  { label: '清空', icon: Trash2, run: () => { input.value = '' } },
  { label: '复制结果', icon: Copy, primary: true, run: copyOutput },
]
</script>

<template>
  <ToolShell :actions="actions" :error="error">
    <template #top>
      <n-card>
        <div class="row-between">
          <n-radio-group :value="kind" size="small" @update:value="setKind">
            <n-radio-button value="json">JSON</n-radio-button>
            <n-radio-button value="html">HTML</n-radio-button>
          </n-radio-group>
          <div class="row-actions">
            <n-radio-group :value="mode" size="small" @update:value="setMode">
              <n-radio-button value="pretty">美化</n-radio-button>
              <n-radio-button value="minify">压缩</n-radio-button>
            </n-radio-group>
            <n-button size="small" @click="copyOutput">
              <template #icon><Copy :size="14" /></template>
              复制
            </n-button>
          </div>
        </div>
      </n-card>
    </template>

    <div class="fmt-grid">
      <n-card>
        <div class="card-head">
          <span class="card-title">输入</span>
          <span class="card-meta">自动处理</span>
        </div>
        <n-input v-model:value="input" type="textarea" />
      </n-card>
      <n-card>
        <div class="card-head">
          <span class="card-title">输出</span>
          <span class="card-meta">{{ (output ?? '').length }} 字符</span>
        </div>
        <pre class="output">{{ output ?? '' }}</pre>
      </n-card>
    </div>
  </ToolShell>
</template>
