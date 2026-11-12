import { onMounted, onUnmounted, ref } from 'vue'

export function useViewport() {
  const isNarrow = ref(false)
  const isPhone = ref(false)
  let narrowQuery: MediaQueryList | undefined
  let phoneQuery: MediaQueryList | undefined

  function sync() {
    isNarrow.value = narrowQuery?.matches ?? false
    isPhone.value = phoneQuery?.matches ?? false
  }

  onMounted(() => {
    narrowQuery = window.matchMedia('(max-width: 768px)')
    phoneQuery = window.matchMedia('(max-width: 480px)')
    sync()
    narrowQuery.addEventListener('change', sync)
    phoneQuery.addEventListener('change', sync)
  })

  onUnmounted(() => {
    narrowQuery?.removeEventListener('change', sync)
    phoneQuery?.removeEventListener('change', sync)
  })

  return { isNarrow, isPhone }
}
