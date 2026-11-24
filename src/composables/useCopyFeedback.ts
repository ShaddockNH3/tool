import { onUnmounted, ref } from 'vue'
import { copyText } from '../utils/clipboard'

export function useCopyFeedback(duration = 1500) {
  const copied = ref(false)
  let timer: ReturnType<typeof setTimeout> | undefined

  async function copy(text: string): Promise<boolean> {
    if (!text) return false
    const ok = await copyText(text)
    if (ok) {
      copied.value = true
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        copied.value = false
      }, duration)
    }
    return ok
  }

  onUnmounted(() => {
    if (timer) clearTimeout(timer)
  })

  return { copied, copy }
}
