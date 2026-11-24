<script setup lang="ts">
import { computed, ref } from 'vue'
import { Trash2, Copy, Check, ArrowDownUp } from 'lucide-vue-next'
import ToolShell from '../components/ToolShell.vue'
import { UiCard, UiCodeOutput, UiSegmented, UiTextarea } from '../components/ui'
import type { SegmentedOption } from '../components/ui'
import type { ToolAction } from '../utils/action'
import { useToolProcessor } from '../composables/useToolProcessor'
import { useCopyFeedback } from '../composables/useCopyFeedback'
import { encodeBase64, decodeBase64 } from '../utils/base64'
import type { Base64Variant } from '../utils/base64'

type Direction = 'encode' | 'decode'

const DEMO_TEXT = '今天改完了工具站的第一版原型 🐋'
const DEMO_ENCODED = encodeBase64(DEMO_TEXT)

const directionOptions: SegmentedOption[] = [
  { label: '编码', value: 'encode' },
  { label: '解码', value: 'decode' },
]

const variantOptions: SegmentedOption[] = [
  { label: '标准', value: 'standard' },
  { label: 'URL 安全', value: 'url' },
]

const direction = ref<Direction>('encode')
const variant = ref<Base64Variant>('standard')
const { copied, copy } = useCopyFeedback()

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

function setDirection(next: string) {
  const value = next as Direction
  if (input.value === DEMO_TEXT || input.value === DEMO_ENCODED) {
    input.value = value === 'encode' ? DEMO_TEXT : DEMO_ENCODED
  }
  direction.value = value
}

function setVariant(next: string) {
  variant.value = next as Base64Variant
}

function swap() {
  input.value = output.value ?? ''
  direction.value = direction.value === 'encode' ? 'decode' : 'encode'
}

const actions = computed<ToolAction[]>(() => [
  { label: '清空', icon: Trash2, run: () => { input.value = '' } },
  { label: '交换', icon: ArrowDownUp, run: swap },
  {
    label: '复制结果',
    activeLabel: '已复制',
    icon: Copy,
    activeIcon: Check,
    active: copied.value,
    primary: true,
    run: () => { void copy(output.value ?? '') },
  },
])
</script>

<template>
  <ToolShell :actions="actions" :error="error">
    <template #top>
      <UiCard compact>
        <div class="row-between">
          <UiSegmented :model-value="direction" :options="directionOptions" @update:model-value="setDirection" />
          <UiSegmented :model-value="variant" :options="variantOptions" @update:model-value="setVariant" />
        </div>
      </UiCard>
    </template>

    <UiCard :title="direction === 'encode' ? '输入文本' : '输入 Base64'" meta="UTF-8">
      <UiTextarea v-model="input" :mono="direction === 'decode'" />
    </UiCard>

    <UiCard
      :title="direction === 'encode' ? 'Base64' : '解码结果'"
      :meta="`${(output ?? '').length} 字符`"
    >
      <UiCodeOutput :value="output" accent />
    </UiCard>
  </ToolShell>
</template>
