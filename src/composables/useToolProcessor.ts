import { ref, watch } from 'vue'
import type { Ref } from 'vue'

export interface ToolProcessorOptions<T, R> {
  initial: T
  /** 唯一需要每个页面各写一份的东西：输入怎么变成输出 */
  process: (input: T) => R | Promise<R>
  /** 除输入外还影响结果的状态，例如进制、编码方向 */
  extra?: Ref<unknown>[]
}

export interface ToolProcessor<T, R> {
  input: Ref<T>
  output: Ref<R | undefined>
  error: Ref<string>
  run: () => Promise<void>
}

export function useToolProcessor<T, R>(options: ToolProcessorOptions<T, R>): ToolProcessor<T, R> {
  const input = ref(options.initial) as Ref<T>
  const output = ref<R | undefined>(undefined) as Ref<R | undefined>
  const error = ref('')

  // 异步处理（HTML 美化）会乱序返回，用序号丢弃过期结果
  let seq = 0

  async function run(): Promise<void> {
    const token = (seq += 1)
    error.value = ''
    try {
      const next = await options.process(input.value)
      if (token === seq) output.value = next
    } catch (cause) {
      if (token !== seq) return
      output.value = undefined
      error.value = cause instanceof Error ? cause.message : '处理失败'
    }
  }

  watch([input, ...(options.extra ?? [])], () => void run(), { immediate: true })

  return { input, output, error, run }
}
