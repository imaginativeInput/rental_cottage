import { describe, it, expect, afterEach, vi } from 'vitest'
import { srcsetFor } from '@/utils/responsiveImages.js'

// No mount/pinia needed — pure utility under test.
// import.meta.glob is resolved by Vite/Vitest against the real filesystem,
// so URLs like "/src/assets/gallery/fireplace02-480.avif" are real path strings.

afterEach(() => {
  vi.restoreAllMocks()
})

describe('srcsetFor — AVIF (default)', () => {
  it('returns type image/avif for an AVIF name', () => {
    const { type } = srcsetFor('fireplace02')
    expect(type).toBe('image/avif')
  })

  it('srcset contains 480w, 960w, and 1440w descriptors', () => {
    const { srcset } = srcsetFor('fireplace02')
    expect(srcset).toContain('480w')
    expect(srcset).toContain('960w')
    expect(srcset).toContain('1440w')
  })

  it('srcset entries are in ascending width order', () => {
    const { srcset } = srcsetFor('fireplace02')
    const widths = srcset
      .split(', ')
      .map((entry) => parseInt(entry.match(/(\d+)w$/)[1], 10))
    expect(widths).toEqual([...widths].sort((a, b) => a - b))
  })

  it('srcset URLs contain the image name', () => {
    const { srcset } = srcsetFor('fireplace02')
    expect(srcset).toContain('fireplace02')
  })

  it('src equals the middle entry URL (entries[floor(len/2)])', () => {
    const { srcset, src } = srcsetFor('fireplace02')
    const entries = srcset.split(', ').map((e) => e.split(' ')[0])
    expect(src).toBe(entries[Math.floor(entries.length / 2)])
  })

  it('src is the 960w variant (middle of 3) for fireplace02', () => {
    const { src } = srcsetFor('fireplace02')
    expect(src).toBe('/src/assets/gallery/fireplace02-960.avif')
  })

  it('returns correct full srcset string for fireplace02', () => {
    const { srcset } = srcsetFor('fireplace02')
    expect(srcset).toBe(
      '/src/assets/gallery/fireplace02-480.avif 480w, /src/assets/gallery/fireplace02-960.avif 960w, /src/assets/gallery/fireplace02-1440.avif 1440w'
    )
  })

  it('also works for NZF_4358 with all three AVIF widths', () => {
    const { srcset, src, type } = srcsetFor('NZF_4358')
    expect(type).toBe('image/avif')
    expect(srcset).toContain('480w')
    expect(srcset).toContain('960w')
    expect(srcset).toContain('1440w')
    expect(src).toBe('/src/assets/gallery/NZF_4358-960.avif')
  })
})

describe('srcsetFor — JPEG format', () => {
  it('returns type image/jpeg when format is jpeg', () => {
    const { type } = srcsetFor('terma-bania', { format: 'jpeg', widths: [480, 960] })
    expect(type).toBe('image/jpeg')
  })

  it('srcset contains 480w and 960w for terma-bania jpeg', () => {
    const { srcset } = srcsetFor('terma-bania', { format: 'jpeg', widths: [480, 960] })
    expect(srcset).toContain('480w')
    expect(srcset).toContain('960w')
  })

  it('srcset does NOT contain avif in URLs', () => {
    const { srcset } = srcsetFor('terma-bania', { format: 'jpeg', widths: [480, 960] })
    expect(srcset).not.toContain('.avif')
  })

  it('src equals the middle entry for 2-entry set (index 1)', () => {
    const { srcset, src } = srcsetFor('terma-bania', { format: 'jpeg', widths: [480, 960] })
    const entries = srcset.split(', ').map((e) => e.split(' ')[0])
    // 2 entries → floor(2/2) = 1 → second entry (960w)
    expect(src).toBe(entries[1])
    expect(src).toBe('/src/assets/attractions/terma-bania-960.jpg')
  })
})

describe('srcsetFor — partial (missing widths silently skipped)', () => {
  it('skips missing 1440 for terma-bania jpeg, returns only 480w and 960w', () => {
    const { srcset } = srcsetFor('terma-bania', { format: 'jpeg', widths: [480, 960, 1440] })
    const parts = srcset.split(', ')
    expect(parts).toHaveLength(2)
    expect(srcset).toContain('480w')
    expect(srcset).toContain('960w')
    expect(srcset).not.toContain('1440w')
  })

  it('type is still image/jpeg even when a width is missing', () => {
    const { type } = srcsetFor('terma-bania', { format: 'jpeg', widths: [480, 960, 1440] })
    expect(type).toBe('image/jpeg')
  })

  it('src is still set even with partial entries', () => {
    const { src } = srcsetFor('terma-bania', { format: 'jpeg', widths: [480, 960, 1440] })
    expect(src).toBeTruthy()
    expect(src).toContain('terma-bania')
  })
})

describe('srcsetFor — unknown name', () => {
  it('returns empty srcset for unknown name', () => {
    const { srcset } = srcsetFor('definitely-not-real')
    expect(srcset).toBe('')
  })

  it('returns empty src for unknown name', () => {
    const { src } = srcsetFor('definitely-not-real')
    expect(src).toBe('')
  })

  it('returns empty type for unknown name', () => {
    const { type } = srcsetFor('definitely-not-real')
    expect(type).toBe('')
  })
})

describe('srcsetFor — single width', () => {
  it('with one width, src equals that single entry URL', () => {
    const { srcset, src } = srcsetFor('fireplace02', { widths: [480] })
    const entries = srcset.split(', ').map((e) => e.split(' ')[0])
    // 1 entry → floor(1/2) = 0 → first (and only) entry
    expect(src).toBe(entries[0])
    expect(src).toBe('/src/assets/gallery/fireplace02-480.avif')
  })

  it('srcset has only one entry', () => {
    const { srcset } = srcsetFor('fireplace02', { widths: [480] })
    expect(srcset.split(', ')).toHaveLength(1)
  })
})

describe('srcsetFor — custom widths subset', () => {
  it('custom widths [480, 1440] skips 960, src is entries[floor(2/2)] = entries[1]', () => {
    const { srcset, src } = srcsetFor('fireplace02', { widths: [480, 1440] })
    const entries = srcset.split(', ').map((e) => e.split(' ')[0])
    expect(entries).toHaveLength(2)
    expect(src).toBe(entries[1])
    expect(src).toBe('/src/assets/gallery/fireplace02-1440.avif')
  })
})

describe('srcsetFor — format jpeg on AVIF-only image', () => {
  it('returns empty result when no jpg variants exist for that name', () => {
    // NZF_4358 only has .avif files, not .jpg
    const { srcset, src, type } = srcsetFor('NZF_4358', { format: 'jpeg' })
    expect(srcset).toBe('')
    expect(src).toBe('')
    expect(type).toBe('')
  })
})

describe('srcsetFor — default options', () => {
  it('calling srcsetFor with no options uses avif format', () => {
    const { type } = srcsetFor('fireplace02')
    expect(type).toBe('image/avif')
  })

  it('calling srcsetFor with no options uses default widths [480,960,1440]', () => {
    const { srcset } = srcsetFor('fireplace02')
    expect(srcset).toContain('480w')
    expect(srcset).toContain('960w')
    expect(srcset).toContain('1440w')
    expect(srcset.split(', ')).toHaveLength(3)
  })
})
