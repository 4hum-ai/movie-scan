/**
 * Image Transformation Utilities
 *
 * This module provides helper functions for transforming image URLs
 * to use CDN services with image optimization features.
 *
 * Supports:
 * - Google Cloud Storage URLs (storage.googleapis.com)
 * - Google CDN URLs (googleusercontent.com)
 * - Custom domain configuration via environment variables
 */

import { useCdn } from '@/composables'

export interface ImageTransformOptions {
  width?: number
  height?: number
  format?: 'webp' | 'avif' | 'auto' | 'jpeg' | 'png'
  quality?: number
  fit?: 'scale-down' | 'contain' | 'cover' | 'crop' | 'pad' | 'squeeze'
  dpr?: number
  anim?: boolean
  background?: string
  blur?: number
  brightness?: number
  contrast?: number
  saturation?: number
  sharpen?: number
  gravity?: 'auto' | 'face' | 'left' | 'right' | 'top' | 'bottom' | string
  trim?: string | { top?: number; right?: number; bottom?: number; left?: number }
  rotate?: 90 | 180 | 270
  flip?: 'h' | 'v' | 'hv'
}

export interface ResponsiveBreakpoint {
  dpr: number
  width?: number
  height?: number
}

/**
 * Transform an image URL to use CDN with specified options
 */
export function transformImageUrl(
  sourceUrl: string,
  options: ImageTransformOptions = {},
  domain?: string,
): string {
  if (!sourceUrl) return ''

  // Check if transformations are disabled via environment
  const { enabled: transformationsEnabled } = useCdn()
  if (!transformationsEnabled) {
    return sourceUrl
  }

  // If already a CDN URL, return as-is
  if (sourceUrl.includes('/cdn-cgi/image/')) {
    return sourceUrl
  }

  // Build transformation options string
  const optionStrings: string[] = []

  Object.entries(options).forEach(([key, value]) => {
    if (value === undefined || value === null) return

    switch (key) {
      // Simple numeric/string values
      case 'width':
      case 'height':
      case 'quality':
      case 'dpr':
      case 'blur':
      case 'brightness':
      case 'contrast':
      case 'saturation':
      case 'sharpen':
      case 'rotate':
      case 'format':
      case 'fit':
      case 'gravity':
      case 'flip':
        optionStrings.push(`${key}=${value}`)
        break

      // Boolean values (only add if false)
      case 'anim':
        if (!value) optionStrings.push('anim=false')
        break

      // URL-encoded values
      case 'background':
        optionStrings.push(`background=${encodeURIComponent(value)}`)
        break

      // Complex object values
      case 'trim':
        if (typeof value === 'string') {
          optionStrings.push(`trim=${value}`)
        } else if (typeof value === 'object') {
          const trimParts: string[] = []
          if (value.top !== undefined) trimParts.push(value.top.toString())
          if (value.right !== undefined) trimParts.push(value.right.toString())
          if (value.bottom !== undefined) trimParts.push(value.bottom.toString())
          if (value.left !== undefined) trimParts.push(value.left.toString())
          if (trimParts.length > 0) {
            optionStrings.push(`trim=${trimParts.join(';')}`)
          }
        }
        break
    }
  })

  // Build CDN URL
  const optionsString = optionStrings.join(',')
  const { domain: cdnDomain } = useCdn()
  const basePath = domain ? `https://${domain}/cdn-cgi/image` : `https://${cdnDomain}/cdn-cgi/image`
  return `${basePath}/${optionsString}/${encodeURI(sourceUrl)}`
}

/**
 * Generate responsive srcset for different pixel densities
 */
export function generateSrcset(
  sourceUrl: string,
  baseOptions: ImageTransformOptions,
  breakpoints: ResponsiveBreakpoint[] = [{ dpr: 1 }, { dpr: 1.5 }, { dpr: 2 }, { dpr: 3 }],
  domain?: string,
): string {
  if (!baseOptions.width || breakpoints.length === 0) return ''

  return breakpoints
    .map(({ dpr }) => {
      const options = { ...baseOptions }

      // Scale dimensions by DPR
      if (options.width) {
        options.width = Math.round(options.width * dpr)
      }
      if (options.height) {
        options.height = Math.round(options.height * dpr)
      }

      const transformedUrl = transformImageUrl(sourceUrl, options, domain)
      return `${transformedUrl} ${dpr}x`
    })
    .join(', ')
}

/**
 * Predefined responsive breakpoints for common use cases
 */
export const RESPONSIVE_BREAKPOINTS = {
  thumbnail: [
    { dpr: 1, width: 150, height: 150 },
    { dpr: 2, width: 300, height: 300 },
    { dpr: 3, width: 450, height: 450 },
  ],
  card: [
    { dpr: 1, width: 300, height: 200 },
    { dpr: 2, width: 600, height: 400 },
    { dpr: 3, width: 900, height: 600 },
  ],
  hero: [
    { dpr: 1, width: 1200, height: 600 },
    { dpr: 2, width: 2400, height: 1200 },
    { dpr: 3, width: 3600, height: 1800 },
  ],
} as const

/**
 * Predefined sizes for common layouts
 */
export const RESPONSIVE_SIZES = {
  thumbnail: '(min-width: 768px) 150px, 100px',
  card: '(min-width: 768px) 300px, (min-width: 480px) 250px, 200px',
  hero: '(min-width: 1200px) 1200px, (min-width: 768px) 768px, 100vw',
  fullWidth: '100vw',
} as const

/**
 * Get the default CDN domain from environment variables
 * @deprecated Use useCdn().domain instead
 */
export function getCdnDomain(): string | undefined {
  const { domain } = useCdn()
  return domain
}
