import DOMPurify from 'isomorphic-dompurify'

/**
 * Sanitizes rich text HTML content to prevent Cross-Site Scripting (XSS) attacks.
 * Allows safe semantic tags and attributes, blocks scripts and malicious attributes.
 */
export function sanitizeHtml(rawHtml?: string | null): string {
  if (!rawHtml) return ''

  return DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: [
      'p',
      'br',
      'h2',
      'h3',
      'h4',
      'h5',
      'h6',
      'blockquote',
      'ul',
      'ol',
      'li',
      'strong',
      'b',
      'em',
      'i',
      'u',
      's',
      'span',
      'a',
      'img',
      'table',
      'thead',
      'tbody',
      'tr',
      'th',
      'td',
      'code',
      'pre',
      'hr',
      'figure',
      'figcaption',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel', 'src', 'alt', 'title', 'class', 'width', 'height', 'loading'],
    ALLOW_DATA_ATTR: false,
    ADD_ATTR: ['target', 'rel'],
  })
}
