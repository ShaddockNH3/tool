<script setup lang="ts">
import { computed, ref } from 'vue'
import { ArrowDownUp, Copy, Check } from 'lucide-vue-next'
import ToolShell from '../components/ToolShell.vue'
import { UiButton, UiCard, UiChip, UiInput, UiSelect } from '../components/ui'
import type { SelectOption } from '../components/ui'
import type { ToolAction } from '../utils/action'
import { useToolProcessor } from '../composables/useToolProcessor'
import { useCopyFeedback } from '../composables/useCopyFeedback'
import { convertBase } from '../utils/base'

const baseOptions: SelectOption[] = Array.from({ length: 35 }, (_, index) => ({
  label: `${index + 2} 进制`,
  value: index + 2,
}))
const quickBases = [2, 8, 10, 16, 36]

const fromBase = ref(10)
const toBase = ref(16)
const { copied, copy } = useCopyFeedback()

const { input, output, error } = useToolProcessor<string, string>({
  initial: '123456789012345678901234567890',
  process: (text) => convertBase(text, fromBase.value, toBase.value),
  extra: [fromBase, toBase],
})

function setFrom(value: string) {
  fromBase.value = Number(value) || 10
}

function setTo(value: string | number) {
  toBase.value = Number(value) || 10
}

function swap() {
  const previousFrom = fromBase.value
  fromBase.value = toBase.value
  toBase.value = previousFrom
  input.value = output.value ?? ''
}

const actions = computed<ToolAction[]>(() => [
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
    <UiCard>
      <div class="convert-row">
        <div style="width: 118px">
          <div class="field-label">源进制</div>
          <UiSelect :model-value="fromBase" :options="baseOptions" @update:model-value="setFrom" />
        </div>
        <div class="grow">
          <div class="field-label">输入</div>
          <UiInput v-model="input" mono placeholder="输入待转换数字…" />
        </div>
      </div>

      <div class="swap">
        <UiButton variant="regular" circle aria-label="交换进制与数值" @click="swap">
          <template #icon><ArrowDownUp :size="16" /></template>
        </UiButton>
      </div>

      <div class="convert-row">
        <div style="width: 118px">
          <div class="field-label">目标进制</div>
          <UiSelect :model-value="toBase" :options="baseOptions" @update:model-value="setTo" />
        </div>
        <div class="grow">
          <div class="field-label">输出</div>
          <UiInput :model-value="output ?? ''" readonly mono />
        </div>
      </div>

      <div class="chips">
        <UiChip
          v-for="base in quickBases"
          :key="base"
          shape="rectangle"
          :active="toBase === base"
          @click="setTo(base)"
        >
          {{ base }} 进制
        </UiChip>
      </div>
    </UiCard>
  </ToolShell>
</template>
