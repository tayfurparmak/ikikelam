/**
 * Utility functions for YouTube & Instagram URL parsing, validation, and embed generation.
 */

const YOUTUBE_DOMAINS = [
  'youtube.com',
  'www.youtube.com',
  'm.youtube.com',
  'youtu.be',
  'youtube-nocookie.com',
  'www.youtube-nocookie.com',
]

const INSTAGRAM_DOMAINS = [
  'instagram.com',
  'www.instagram.com',
]

/**
 * Validates whether a given URL is from an authorized YouTube domain.
 */
export function isValidYoutubeDomain(url: string): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`)
    return YOUTUBE_DOMAINS.includes(parsed.hostname.toLowerCase())
  } catch {
    return false
  }
}

/**
 * Validates whether a given URL is from an authorized Instagram domain.
 */
export function isValidInstagramDomain(url: string): boolean {
  if (!url) return false
  try {
    const parsed = new URL(url.trim().startsWith('http') ? url.trim() : `https://${url.trim()}`)
    return INSTAGRAM_DOMAINS.includes(parsed.hostname.toLowerCase())
  } catch {
    return false
  }
}

/**
 * Extracts standard 11-character YouTube video ID from various URL formats:
 * - https://www.youtube.com/watch?v=VIDEO_ID
 * - https://youtu.be/VIDEO_ID
 * - https://www.youtube.com/shorts/VIDEO_ID
 * - https://www.youtube.com/embed/VIDEO_ID
 * - https://m.youtube.com/watch?v=VIDEO_ID
 * - Raw 11-char ID
 */
export function extractYoutubeVideoId(input: string): string | null {
  if (!input) return null
  const trimmed = input.trim()

  // 1. Direct 11-character ID check
  if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
    return trimmed
  }

  try {
    const urlString = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`
    const parsed = new URL(urlString)
    const hostname = parsed.hostname.toLowerCase()

    if (!YOUTUBE_DOMAINS.includes(hostname)) {
      return null
    }

    // Pattern A: youtu.be/VIDEO_ID
    if (hostname === 'youtu.be') {
      const id = parsed.pathname.slice(1).split('/')[0]
      if (id && /^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return id
      }
    }

    // Pattern B: youtube.com/watch?v=VIDEO_ID
    if (parsed.searchParams.has('v')) {
      const v = parsed.searchParams.get('v')
      if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) {
        return v
      }
    }

    // Pattern C: youtube.com/shorts/VIDEO_ID or youtube.com/embed/VIDEO_ID
    const pathParts = parsed.pathname.split('/').filter(Boolean)
    const index = pathParts.findIndex((p) => p === 'shorts' || p === 'embed' || p === 'v')
    if (index !== -1 && pathParts[index + 1]) {
      const id = pathParts[index + 1]
      if (/^[a-zA-Z0-9_-]{11}$/.test(id)) {
        return id
      }
    }
  } catch {
    // Malformed URL, fallback to regex
  }

  // Fallback regex pattern matching
  const match = trimmed.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|shorts\/|watch\?v=|watch\?.+&v=))([a-zA-Z0-9_-]{11})/
  )
  return match ? match[1] : null
}

/**
 * Generates official YouTube thumbnail URL.
 */
export function getYoutubeThumbnailUrl(
  videoId: string,
  quality: 'maxresdefault' | 'hqdefault' | 'mqdefault' = 'hqdefault'
): string {
  if (!videoId) return ''
  return `https://img.youtube.com/vi/${videoId}/${quality}.jpg`
}

/**
 * Generates sanitized YouTube embed iframe URL.
 */
export function getYoutubeEmbedUrl(videoId: string, autoplay = false): string {
  if (!videoId) return ''
  const params = new URLSearchParams({
    rel: '0',
    modestbranding: '1',
    playsinline: '1',
    ...(autoplay ? { autoplay: '1' } : {}),
  })
  return `https://www.youtube.com/embed/${videoId}?${params.toString()}`
}
