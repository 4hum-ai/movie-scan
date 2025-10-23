import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useCdn, getCdnDomain, isCdnEnabled, getCdnUrl } from '../../src/composables/useCdn'

describe('useCdn', () => {
  beforeEach(() => {
    // Mock environment variables for tests
    vi.stubEnv('VITE_CLOUDFLARE_DOMAIN', '4hum.ai')
    vi.stubEnv('VITE_ENABLE_CDN', 'true')
  })

  afterEach(() => {
    vi.restoreAllMocks()
    vi.unstubAllEnvs()
  })

  describe('useCdn composable', () => {
    it('returns CDN configuration', () => {
      const cdn = useCdn()

      expect(cdn).toHaveProperty('domain')
      expect(cdn).toHaveProperty('enabled')
      expect(cdn).toHaveProperty('getCdnUrl')
      expect(cdn).toHaveProperty('getCdnDomain')
    })

    it('provides working getCdnUrl function', () => {
      const { getCdnUrl } = useCdn()
      const result = getCdnUrl('https://example.com/audio.mp3')

      expect(typeof result).toBe('string')
    })

    it('provides working getCdnDomain function', () => {
      const { getCdnDomain } = useCdn()
      const result = getCdnDomain()

      expect(typeof result).toBe('string')
    })
  })

  describe('getCdnDomain', () => {
    it('returns a string value', () => {
      const result = getCdnDomain()
      expect(typeof result).toBe('string')
    })

    it('logs domain to console', () => {
      const consoleSpy = vi.spyOn(console, 'log')
      getCdnDomain()
      expect(consoleSpy).toHaveBeenCalledWith('CDN domain from env:', expect.any(String))
    })
  })

  describe('isCdnEnabled', () => {
    it('returns a boolean value', () => {
      const result = isCdnEnabled()
      expect(typeof result).toBe('boolean')
    })

    it('defaults to true', () => {
      const result = isCdnEnabled()
      expect(result).toBe(true)
    })
  })

  describe('getCdnUrl', () => {
    it('returns empty string for empty source URL', () => {
      const result = getCdnUrl('')
      expect(result).toBe('')
    })

    it('returns original URL when CDN is disabled', () => {
      // Mock isCdnEnabled to return false
      vi.doMock('../../src/composables/useCdn', () => ({
        isCdnEnabled: () => false,
        getCdnDomain: () => 'test.com',
      }))

      const result = getCdnUrl('https://example.com/audio.mp3')
      expect(result).toBe('https://example.com/audio.mp3')
    })

    it('returns original URL when already a CDN URL', () => {
      const sourceUrl =
        'https://cdn.example.com/cdn-cgi/image/width=300/https://example.com/image.jpg'
      const result = getCdnUrl(sourceUrl)
      expect(result).toBe(sourceUrl)
    })

    it('returns original URL when CDN domain is not available', () => {
      // Mock getCdnDomain to return undefined
      vi.doMock('../../src/composables/useCdn', () => ({
        isCdnEnabled: () => true,
        getCdnDomain: () => undefined,
      }))

      const result = getCdnUrl('https://example.com/audio.mp3')
      expect(result).toBe('https://example.com/audio.mp3')
    })

    it('returns original URL for regular URLs when CDN is enabled', () => {
      const sourceUrl = 'https://example.com/audio.mp3'
      const result = getCdnUrl(sourceUrl)
      expect(result).toBe(sourceUrl)
    })
  })

  describe('integration', () => {
    it('works with audio/video URLs', () => {
      const audioUrl = 'https://example.com/audio.mp3'
      const videoUrl = 'https://example.com/video.mp4'

      const audioResult = getCdnUrl(audioUrl)
      const videoResult = getCdnUrl(videoUrl)

      expect(audioResult).toBe(audioUrl)
      expect(videoResult).toBe(videoUrl)
    })

    it('works with image URLs', () => {
      const imageUrl = 'https://example.com/image.jpg'
      const result = getCdnUrl(imageUrl)

      expect(result).toBe(imageUrl)
    })
  })
})
