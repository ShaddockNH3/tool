<script setup lang="ts">
import { ref } from 'vue'
import { NCard, NInput, NRadioGroup, NRadioButton } from 'naive-ui'
import { Trash2, Copy, ArrowDownUp } from 'lucide-vue-next'
import ToolShell from '../components/ToolShell.vue'
import type { ToolAction } from '../utils/action'
import { useToolProcessor } from '../composables/useToolProcessor'
import { encodeBase64, decodeBase64 } from '../utils/base64'
import type { Base64Variant } from '../utils/base64'
import { copyText } from '../utils/clipboard'

type Direction = 'encode' | 'decode'

const DEMO_TEXT = '今天改完了工具站的第一版原型 🐋'
const DEMO_ENCODED = encodeBase64(DEMO_TEXT)

const direction = ref<Direction>('encode')
const variant = ref<Base64Variant>('standard')

const { input, output, error } = useToolProcessor<string, string>({
  initial: DEMO_TEXT,
  process: (text) => {
    if (!text.trim()) return ''
    try {
      return direction.value === 'encode'
        ? encodeBase64(text, variant.value)
        : decodeBase64(text, variant.value)
    } catch {
      throw new Error('输入不是合法 Base64，无法解码')
    }
  },
  extra: [direction, variant],
})

function setDirection(next: string | number) {
  const value = String(next) as Direction
  if (input.value === DEMO_TEXT || input.value === DEMO_ENCODED) {
    input.value = value === 'encode' ? DEMO_TEXT : DEMO_ENCODED
  }
  direction.value = value
}

function setVariant(next: string | number) {
  variant.value = String(next) as Base64Variant
}

function swap() {
  input.value = output.value ?? ''
  direction.value = direction.value === 'encode' ? 'decode' : 'encode'
}

const actions: ToolAction[] = [
  { label: '清空', icon: Trash2, run: () => { input.value = '' } },
  { label: '交换', icon: ArrowDownUp, run: swap },
  { label: '复制结果', icon: Copy, primary: true, run: () => { void copyText(output.value ?? '') } },
]
</script>

<template>
  <ToolShell :actions="actions" :error="error">
    <template #top>
      <n-card>
        <div class="row-between">
          <n-radio-group :value="direction" size="small" @update:value="setDirection">
            <n-radio-button value="encode">编码</n-radio-button>
            <n-radio-button value="decode">解码</n-radio-button>
          </n-radio-group>
          <n-radio-group :value="variant" size="small" @update:value="setVariant">
            <n-radio-button value="standard">标准</n-radio-button>
            <n-radio-button value="url">URL 安全</n-radio-button>
          </n-radio-group>
        </div>
      </n-card>
    </template>

    <n-card>
      <div class="card-head">
        <span class="card-title">{{ direction === 'encode' ? '输入文本' : '输入 Base64' }}</span>
        <span class="card-meta">UTF-8</span>
      </div>
      <n-input v-model:value="input" type="textarea" />
    </n-card>

    <n-card>
      <div class="card-head">
        <span class="card-title">{{ direction === 'encode' ? 'Base64' : '解码结果' }}</span>
        <span class="card-meta">{{ (output ?? '').length }} 字符</span>
      </div>
      <pre class="output base64">{{ output ?? '' }}</pre>
    </n-card>
  </ToolShell>
</template>
