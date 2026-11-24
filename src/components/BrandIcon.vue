<script setup lang="ts">
withDefaults(defineProps<{ size?: number }>(), { size: 22 })
</script>

<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    fill="none"
    aria-hidden="true"
    class="brand-mark"
  >
    <defs>
      <linearGradient id="attilio-brand-bg" x1="8" y1="6" x2="56" y2="58" gradientUnits="userSpaceOnUse">
        <stop offset="0%" stop-color="#ff7aa8" />
        <stop offset="100%" stop-color="#e04f7b" />
      </linearGradient>
    </defs>
    <rect x="4" y="4" width="56" height="56" rx="16" fill="url(#attilio-brand-bg)" />
    <rect x="14" y="14" width="15" height="15" rx="4.5" fill="#ffffff" />
    <rect x="35" y="14" width="15" height="15" rx="4.5" fill="#ffffff" fill-opacity="0.55" />
    <rect x="14" y="35" width="15" height="15" rx="4.5" fill="#ffffff" fill-opacity="0.55" />
    <path
      d="M42.5 34.5L44.6 39.9L50 42L44.6 44.1L42.5 49.5L40.4 44.1L35 42L40.4 39.9L42.5 34.5Z"
      fill="#ffffff"
    />
  </svg>
</template>

<style scoped>
.brand-mark {
  display: block;
  flex: none;
}
</style>
