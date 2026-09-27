/**
 * Formats a Date object or ISO string into Turkish locale format.
 */
export const formatDateTR = (date: Date | string): string => {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(d)
}

/**
 * Normalizes a Turkish string to a URL-friendly slug.
 */
export const slugify = (text: string): string => {
  const trMap: Record<string, string> = {
    ç: 'c',
    Ç: 'c',
    ğ: 'g',
    Ğ: 'g',
    ş: 's',
    Ş: 's',
    ü: 'u',
    Ü: 'u',
    ı: 'i',
    İ: 'i',
    ö: 'o',
    Ö: 'o',
  }

  return text
    .split('')
    .map((char) => trMap[char] || char)
    .join('')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
}
