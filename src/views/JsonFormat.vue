<script setup lang="ts">
import { ref, watch } from 'vue'
import { NCard, NInput, NRadioGroup, NRadioButton, NAlert, NButton } from 'naive-ui'
import { Trash2, Copy } from 'lucide-vue-next'
import ActionBar from '../components/ActionBar.vue'
import type { ToolAction } from '../utils/action'
import { formatJson, formatHtml } from '../utils/format'
import type { FormatKind, FormatMode } from '../utils/format'
import { copyText } from '../utils/clipboard'

const DEMO_JSON = '{"name":"attilio","tools":["count","format","base64","base"],"ok":true}'
const DEMO_HTML = '<div class="box"><span>hi</span><span>there</span></div>'

const kind = ref<FormatKind>('json')
const mode = ref<FormatMode>('pretty')
const input = ref(DEMO_JSON)
const output = ref('')
const error = ref('')

async function run() {
  error.value = ''
  try {
    if (!input.value.trim()) {
      output.value = ''
      return
    }
    output.value = kind.value === 'json'
      ? formatJson(input.value, mode.value)
      : await formatHtml(input.value, mode.value)
  } catch (cause) {
    output.value = ''
    error.value = cause instanceof Error ? cause.message : '处理失败'
  }
}

watch([kind, mode, input], run, { immediate: true })

function setKind(next: string | number) {
  const value = String(next) as FormatKind
  kind.value = value
  input.value = value === 'json' ? DEMO_JSON : DEMO_HTML
}

function setMode(next: string | number) {
  mode.value = String(next) as FormatMode
}

const actions: ToolAction[] = [
  { label: '清空', icon: Trash2, run: () => { input.value = '' } },
  { label: '复制结果', icon: Copy, primary: true, run: () => { void copyText(output.value) } },
]
</script>

<template>
  <div class="tool-page">
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
          <n-button size="small" @click="copyText(output)">
            <template #icon><Copy :size="14" /></template>
            复制
          </n-button>
        </div>
      </div>
    </n-card>

    <n-alert v-if="error" type="error" style="margin-bottom: 12px">{{ error }}</n-alert>

    <div class="fmt-grid" style="margin-bottom: 12px">
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
          <span class="card-meta">{{ output.length }} 字符</span>
        </div>
        <pre class="output">{{ output }}</pre>
      </n-card>
    </div>

    <ActionBar :actions="actions" />
  </div>
</template>
