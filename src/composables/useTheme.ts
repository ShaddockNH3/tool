import { computed, onMounted, onUnmounted, ref } from 'vue'

export type ThemeMode = 'light' | 'dark' | 'system'

const STORAGE_KEY = 'tool-attilio-theme'

const mode = ref<ThemeMode>('light')
const systemDark = ref(false)
let initialized = false
let mediaQuery: MediaQueryList | undefined

function applyDomTheme(dark: boolean) {
  if (typeof document === 'undefined') return
  const root = document.documentElement
  root.classList.toggle('dark', dark)
  root.style.colorScheme = dark ? 'dark' : 'light'
}

function readStoredMode(): ThemeMode {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved === 'light' || saved === 'dark' || saved === 'system') return saved
  } catch {
    // ignore storage errors
  }
  return 'light'
}

export function useTheme() {
  const isDark = computed(() =>
    mode.value === 'system' ? systemDark.value : mode.value === 'dark',
  )

  function sync() {
    applyDomTheme(isDark.value)
  }

  function setMode(next: ThemeMode) {
    mode.value = next
    try {
      localStorage.setItem(STORAGE_KEY, next)
    } catch {
      // ignore storage errors
    }
    const doc = document as Document & {
      startViewTransition?: (cb: () => void) => void
    }
    if (typeof doc.startViewTransition === 'function') {
      doc.startViewTransition(sync)
    } else {
      sync()
    }
  }

  function toggleTheme() {
    setMode(isDark.value ? 'light' : 'dark')
  }

  onMounted(() => {
    if (!initialized && typeof window !== 'undefined') {
      initialized = true
      mode.value = readStoredMode()
      mediaQuery = window.matchMedia('(prefers-color-scheme: dark)')
      systemDark.value = mediaQuery.matches
      mediaQuery.addEventListener('change', (e) => {
        systemDark.value = e.matches
        if (mode.value === 'system') sync()
      })
      sync()
    }
  })

  onUnmounted(() => {
    // singleton listener kept for app lifetime
  })

  return { mode, isDark, setMode, toggleTheme }
}
