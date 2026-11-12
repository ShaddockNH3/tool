<script setup lang="ts">
import { ref, watch } from 'vue'
import { NCard, NInput, NRadioGroup, NRadioButton, NAlert } from 'naive-ui'
import { Trash2, Copy, ArrowDownUp } from 'lucide-vue-next'
import ActionBar from '../components/ActionBar.vue'
import type { ToolAction } from '../utils/action'
import { encodeBase64, decodeBase64 } from '../utils/base64'
import type { Base64Variant } from '../utils/base64'
import { copyText } from '../utils/clipboard'

const DEMO_TEXT = '今天改完了工具站的第一版原型 🐋'
const DEMO_ENCODED = encodeBase64(DEMO_TEXT)

type Direction = 'encode' | 'decode'

const direction = ref<Direction>('encode')
const variant = ref<Base64Variant>('standard')
const input = ref(DEMO_TEXT)
const output = ref('')
const error = ref('')

function run() {
  error.value = ''
  try {
    output.value = direction.value === 'encode'
      ? encodeBase64(input.value, variant.value)
      : decodeBase64(input.value, variant.value)
  } catch {
    output.value = ''
    error.value = '输入不是合法 Base64，无法解码'
  }
}

watch([direction, variant, input], run, { immediate: true })

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
  input.value = output.value
  direction.value = direction.value === 'encode' ? 'decode' : 'encode'
}

const actions: ToolAction[] = [
  { label: '清空', icon: Trash2, run: () => { input.value = '' } },
  { label: '交换', icon: ArrowDownUp, run: swap },
  { label: '复制结果', icon: Copy, primary: true, run: () => { void copyText(output.value) } },
]
</script>

<template>
  <div class="tool-page">
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

    <n-card>
      <div class="card-head">
        <span class="card-title">{{ direction === 'encode' ? '输入文本' : '输入 Base64' }}</span>
        <span class="card-meta">UTF-8</span>
      </div>
      <n-input v-model:value="input" type="textarea" />
    </n-card>

    <n-alert v-if="error" type="error" style="margin-bottom: 12px">{{ error }}</n-alert>

    <n-card>
      <div class="card-head">
        <span class="card-title">{{ direction === 'encode' ? 'Base64' : '解码结果' }}</span>
        <span class="card-meta">{{ output.length }} 字符</span>
      </div>
      <pre class="output base64">{{ output }}</pre>
    </n-card>

    <ActionBar :actions="actions" />
  </div>
</template>
