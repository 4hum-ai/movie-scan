<template>
  <img
    :src="transformedSrc"
    :srcset="srcset"
    :sizes="computedSizes"
    :alt="alt"
    :width="width"
    :height="height"
    :class="imageClasses"
    :loading="loading"
    :decoding="decoding"
    :referrerpolicy="shouldSetReferrerPolicy ? 'no-referrer' : undefined"
    @error="$emit('error')"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCdn } from '@/composables'
import {
  transformImageUrl,
  generateSrcset,
  RESPONSIVE_BREAKPOINTS,
  RESPONSIVE_SIZES,
  type ImageTransformOptions,
  type ResponsiveBreakpoint,
} from '@/utils/imageTransform'

// Define emits
defineEmits<{
  (e: 'error'): void
}>()

// CDN composable
const { domain: cdnDomain } = useCdn()

interface Props {
  /** Source image URL */
  src: string
  /** Image width in pixels */
  width?: number
  /** Image height in pixels */
  height?: number
  /** Alt text for accessibility */
  alt?: string
  /** Image format (webp, avif, auto, jpeg, png) */
  format?: 'webp' | 'avif' | 'auto' | 'jpeg' | 'png'
  /** Image quality (1-100) */
  quality?: number
  /** Fit mode for resizing */
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad' | 'squeeze'
  /** Device pixel ratio for high-DPI displays */
  dpr?: number
  /** Whether to preserve animation frames */
  anim?: boolean
  /** Background color for transparent images */
  background?: string
  /** Blur radius (1-250) */
  blur?: number
  /** Brightness adjustment (0.5-2.0) */
  brightness?: number
  /** Contrast adjustment (0.5-2.0) */
  contrast?: number
  /** Saturation adjustment (0-2.0) */
  saturation?: number
  /** Sharpening strength (0-10) */
  sharpen?: number
  /** Gravity for cropping (auto, face, left, right, top, bottom, or coordinates) */
  gravity?: 'auto' | 'face' | 'left' | 'right' | 'top' | 'bottom' | string
  /** Trim settings for removing borders */
  trim?: string | { top?: number; right?: number; bottom?: number; left?: number }
  /** Rotation in degrees */
  rotate?: 90 | 180 | 270
  /** Flip direction */
  flip?: 'h' | 'v' | 'hv'
  /** CSS classes for the image */
  class?: string
  /** Loading strategy */
  loading?: 'lazy' | 'eager'
  /** Decoding strategy */
  decoding?: 'async' | 'sync' | 'auto'
  /** Responsive breakpoints for srcset */
  breakpoints?: ResponsiveBreakpoint[]
  /** Sizes attribute for responsive images */
  sizes?: string
  /** Preset for common use cases (thumbnail, card, hero) */
  preset?: 'thumbnail' | 'card' | 'hero' | 'custom'
  /** Cloudflare domain (optional, defaults to relative path) */
  domain?: string
}

const props = withDefaults(defineProps<Props>(), {
  format: 'auto',
  quality: 85,
  fit: 'scale-down',
  dpr: 1,
  anim: true,
  loading: 'lazy',
  decoding: 'async',
  preset: 'custom',
  sizes: '100vw',
})

/**
 * Build image transformation options from props
 */
const imageOptions = computed(
  (): ImageTransformOptions => ({
    width: props.width,
    height: props.height,
    format: props.format,
    quality: props.quality,
    fit: props.fit,
    dpr: props.dpr,
    anim: props.anim,
    background: props.background,
    blur: props.blur,
    brightness: props.brightness,
    contrast: props.contrast,
    saturation: props.saturation,
    sharpen: props.sharpen,
    gravity: props.gravity,
    trim: props.trim,
    rotate: props.rotate,
    flip: props.flip,
  }),
)

/**
 * Get responsive breakpoints based on preset or custom values
 */
const computedBreakpoints = computed(() => {
  if (props.preset !== 'custom' && props.preset in RESPONSIVE_BREAKPOINTS) {
    // Convert readonly array to mutable array to satisfy type requirements
    return [...RESPONSIVE_BREAKPOINTS[props.preset]]
  }
  return props.breakpoints || [{ dpr: 1 }, { dpr: 1.5 }, { dpr: 2 }, { dpr: 3 }]
})

/**
 * Get sizes attribute based on preset or custom value
 */
const computedSizes = computed((): string => {
  if (props.preset !== 'custom' && props.preset in RESPONSIVE_SIZES) {
    return RESPONSIVE_SIZES[props.preset]
  }
  return props.sizes
})

/**
 * Transform image URL to use CDN
 */
const transformedSrc = computed(() => {
  return transformImageUrl(props.src, imageOptions.value, props.domain || cdnDomain)
})

/**
 * Generate responsive srcset for different pixel densities
 */
const srcset = computed(() => {
  if (!props.width) return ''

  return generateSrcset(
    props.src,
    imageOptions.value,
    computedBreakpoints.value,
    props.domain || cdnDomain,
  )
})

/**
 * CSS classes for the image
 */
const imageClasses = computed(() => {
  const baseClasses = 'max-w-full h-auto'
  return props.class ? `${baseClasses} ${props.class}` : baseClasses
})

/**
 * Determine if referrerpolicy should be set based on domain comparison
 */
const shouldSetReferrerPolicy = computed(() => {
  const currentDomain = window.location.hostname

  // Only set referrerpolicy when domains are different
  return cdnDomain && currentDomain !== cdnDomain
})
</script>
