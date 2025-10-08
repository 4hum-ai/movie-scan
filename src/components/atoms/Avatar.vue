<template>
  <div
    :class="wrapperClasses"
    :style="backgroundStyle"
    :aria-label="isImageVisible ? undefined : ariaLabel"
    role="img"
  >
    <Image
      v-if="isImageVisible"
      :src="src || ''"
      :alt="altAttr"
      class="h-full w-full object-cover"
      @error="onImgError"
    />
    <span v-else class="font-medium text-white">{{ initialChar }}</span>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import Image from '@/components/molecules/Image.vue'

interface Props {
  label?: string
  seed: string
  src?: string
  alt?: string
  size?: 'sm' | 'md' | 'lg'
  shape?: 'square' | 'circle'
  backgroundColor?: string
}

const props = withDefaults(defineProps<Props>(), {
  size: 'md',
  shape: 'square',
})

const loadError = ref(false)
const isImageVisible = computed(() => Boolean(props.src) && !loadError.value)

const initialChar = computed(() => {
  const base = (props.label || props.seed || '').replace(/^\//, '').trim()
  return base ? base[0].toUpperCase() : '?'
})

const ariaLabel = computed(() => (props.label ? `Avatar for ${props.label}` : 'Avatar'))
const altAttr = computed(() => props.alt || props.label || 'Avatar')

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'h-8 w-8 text-sm'
    case 'lg':
      return 'h-12 w-12 text-lg'
    default:
      return 'h-10 w-10'
  }
})

const shapeClasses = computed(() => (props.shape === 'circle' ? 'rounded-full' : 'rounded-lg'))

const wrapperClasses = computed(
  () =>
    `${sizeClasses.value} ${shapeClasses.value} flex items-center justify-center overflow-hidden shadow-sm`
)

const backgroundStyle = computed(() => {
  if (isImageVisible.value) return undefined
  if (props.backgroundColor) return `background:${props.backgroundColor};`
  const { h, s, l } = colorFromString(props.seed || '')
  const l1 = Math.max(28, l - 10)
  const l2 = Math.min(88, l + 10)
  return `background: linear-gradient(135deg, hsl(${h} ${s}% ${l1}%) 0%, hsl(${h} ${s}% ${l2}%) 100%);`
})

function colorFromString(str: string) {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }
  const h = Math.abs(hash) % 360
  const s = 65
  const l = 55
  return { h, s, l }
}

function onImgError() {
  loadError.value = true
}
</script>
