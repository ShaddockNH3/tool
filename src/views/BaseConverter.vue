<script setup lang="ts">
import { ref, watch } from 'vue'
import { NCard, NInput, NSelect, NTag, NButton, NAlert } from 'naive-ui'
import { ArrowDownUp, Copy } from 'lucide-vue-next'
import ActionBar from '../components/ActionBar.vue'
import type { ToolAction } from '../utils/action'
import { convertBase } from '../utils/base'
import { copyText } from '../utils/clipboard'

const baseOptions = Array.from({ length: 35 }, (_, index) => ({
  label: String(index + 2),
  value: index + 2,
}))
const quickBases = [2, 8, 10, 16, 36]

const fromBase = ref(10)
const toBase = ref(16)
const input = ref('123456789012345678901234567890')
const output = ref('')
const error = ref('')

function run() {
  error.value = ''
  try {
    output.value = convertBase(input.value, fromBase.value, toBase.value)
  } catch (cause) {
    output.value = ''
    error.value = cause instanceof Error ? cause.message : '转换失败'
  }
}

watch([fromBase, toBase, input], run, { immediate: true })

function setFrom(value: unknown) {
  fromBase.value = Number(value) || 10
}

function setTo(value: unknown) {
  toBase.value = Number(value) || 10
}

function swap() {
  const previousFrom = fromBase.value
  fromBase.value = toBase.value
  toBase.value = previousFrom
  input.value = output.value
}

const actions: ToolAction[] = [
  {
    label: '复制结果',
    icon: Copy,
    primary: true,
    run: () => { void copyText(output.value) },
  },
]
</script>

<template>
  <div class="tool-page">
    <n-card>
      <div class="convert-row">
        <div>
          <div class="field-label">源进制</div>
          <n-select :value="fromBase" :options="baseOptions" style="width: 110px" @update:value="setFrom" />
        </div>
        <div class="grow">
          <div class="field-label">输入</div>
          <n-input v-model:value="input" />
        </div>
      </div>

      <div class="swap">
        <n-button quaternary circle @click="swap">
          <template #icon><ArrowDownUp :size="16" /></template>
        </n-button>
      </div>

      <div class="convert-row">
        <div>
          <div class="field-label">目标进制</div>
          <n-select :value="toBase" :options="baseOptions" style="width: 110px" @update:value="setTo" />
        </div>
        <div class="grow">
          <div class="field-label">输出</div>
          <n-input :value="output" readonly />
        </div>
      </div>

      <div class="chips">
        <n-tag
          v-for="base in quickBases"
          :key="base"
          size="small"
          :bordered="false"
          :type="toBase === base ? 'primary' : 'default'"
          @click="setTo(base)"
        >
          {{ base }}
        </n-tag>
      </div>
    </n-card>

    <n-alert v-if="error" type="error" style="margin-bottom: 12px">{{ error }}</n-alert>

    <ActionBar :actions="actions" />
  </div>
</template>
