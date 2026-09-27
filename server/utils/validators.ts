import { z } from 'zod'
import prisma from '../../lib/prisma'
import { slugify } from '../../utils'
import {
  isValidYoutubeDomain,
  isValidInstagramDomain,
  extractYoutubeVideoId,
} from '../../utils/youtube'

export { isValidYoutubeDomain, isValidInstagramDomain, extractYoutubeVideoId }

// ---------------------------------------------------------------------------
// Zod Schemas
// ---------------------------------------------------------------------------

export const categoryCreateSchema = z.object({
  name: z.string().min(2, 'Kategori / Faaliyet adı en az 2 karakter olmalıdır.').max(100),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
  sortOrder: z.number().int().min(0).optional().default(0),
})

export const categoryUpdateSchema = z.object({
  name: z.string().min(2).max(100).optional(),
  slug: z.string().optional(),
  description: z.string().optional().nullable(),
  shortDescription: z.string().optional().nullable(),
  image: z.string().optional().nullable(),
  icon: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
  sortOrder: z.number().int().min(0).optional(),
})

export const isGoogleMapsUrl = (url: string): boolean => {
  try {
    const parsed = new URL(url)
    const host = parsed.hostname.toLowerCase()
    return (
      host === 'maps.google.com' ||
      host.endsWith('.google.com') ||
      host === 'goo.gl' ||
      host === 'maps.app.goo.gl'
    )
  } catch {
    return false
  }
}

export const contactSettingsUpdateSchema = z.object({
  organizationName: z.string().min(2, 'Kurum adı en az 2 karakter olmalıdır.').max(150),
  description: z.string().max(2000).optional().nullable(),
  phone: z.string().max(50).optional().nullable(),
  whatsapp: z.string().max(50).optional().nullable(),
  email: z.string().email('Geçerli bir e-posta adresi giriniz.').optional().nullable().or(z.literal('')),
  address: z.string().max(300).optional().nullable(),
  district: z.string().max(100).optional().nullable(),
  city: z.string().max(100).optional().nullable(),
  postalCode: z.string().max(20).optional().nullable(),
  googleMapsUrl: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val === '' || isGoogleMapsUrl(val), {
      message: 'Google Maps bağlantısı yalnızca geçerli bir Google Maps URL olmalıdır.',
    }),
  googleMapsEmbedUrl: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val === '' || isGoogleMapsUrl(val), {
      message: 'Harita iframe bağlantısı yalnızca geçerli bir Google Maps Embed URL olmalıdır.',
    }),
  transportationPublic: z.string().max(2000).optional().nullable(),
  transportationPrivate: z.string().max(2000).optional().nullable(),
  transportationNotes: z.string().max(2000).optional().nullable(),
  visitDays: z.string().max(150).optional().nullable(),
  visitHours: z.string().max(150).optional().nullable(),
  // Social Media & YouTube
  youtubeUrl: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val === '' || isValidYoutubeDomain(val), {
      message: 'Geçerli bir YouTube URL giriniz.',
    }),
  instagramUrl: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val === '' || isValidInstagramDomain(val), {
      message: 'Geçerli bir Instagram URL giriniz.',
    }),
  featuredYoutubeVideoId: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val === '' || /^[a-zA-Z0-9_-]{11}$/.test(val), {
      message: 'Geçersiz YouTube Video ID.',
    }),
  featuredYoutubeTitle: z.string().max(200).optional().nullable(),
  featuredYoutubeDescription: z.string().max(2000).optional().nullable(),
})

export const siteSettingsUpdateSchema = z.object({
  organizationName: z.string().min(2, 'Kurum adı en az 2 karakter olmalıdır.').max(150).optional(),
  description: z.string().max(2000).optional().nullable(),
  youtubeUrl: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val === '' || isValidYoutubeDomain(val), {
      message: 'Geçerli bir YouTube URL giriniz.',
    }),
  instagramUrl: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val === '' || isValidInstagramDomain(val), {
      message: 'Geçerli bir Instagram URL giriniz.',
    }),
  featuredYoutubeVideoUrl: z.string().optional().nullable(),
  featuredYoutubeVideoId: z
    .string()
    .optional()
    .nullable()
    .refine((val) => !val || val === '' || /^[a-zA-Z0-9_-]{11}$/.test(val), {
      message: 'Geçersiz YouTube Video ID.',
    }),
  featuredYoutubeTitle: z.string().max(200).optional().nullable(),
  featuredYoutubeDescription: z.string().max(2000).optional().nullable(),
})

export const postCreateSchema = z.object({
  title: z.string().min(3, 'Yazı başlığı en az 3 karakter olmalıdır.').max(250),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1, 'Yazı içeriği boş olamaz.'),
  coverImage: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional().default('DRAFT'),
  publishedAt: z.string().datetime({ offset: true }).or(z.date()).optional().nullable(),
  categoryId: z.string().optional().nullable(),
})

export const postUpdateSchema = z.object({
  title: z.string().min(3).max(250).optional(),
  slug: z.string().optional(),
  excerpt: z.string().optional().nullable(),
  content: z.string().min(1).optional(),
  coverImage: z.string().optional().nullable(),
  status: z.enum(['DRAFT', 'PUBLISHED', 'ARCHIVED']).optional(),
  publishedAt: z.string().datetime({ offset: true }).or(z.date()).optional().nullable(),
  categoryId: z.string().optional().nullable(),
})

export const galleryCreateSchema = z.object({
  title: z.string().min(2, 'Görsel başlığı en az 2 karakter olmalıdır.').max(200),
  imageUrl: z.string().min(1, 'Görsel bağlantısı zorunludur.'),
  storagePath: z.string().optional().nullable(),
  category: z
    .enum(['MEDRESE_LIFE', 'CLASSES', 'EVENTS', 'LIBRARY', 'HISTORICAL', 'GENERAL'])
    .optional()
    .default('GENERAL'),
  altText: z.string().optional().nullable(),
})

export const galleryUpdateSchema = z.object({
  title: z.string().min(2).max(200).optional(),
  imageUrl: z.string().optional(),
  storagePath: z.string().optional().nullable(),
  category: z.enum(['MEDRESE_LIFE', 'CLASSES', 'EVENTS', 'LIBRARY', 'HISTORICAL', 'GENERAL']).optional(),
  altText: z.string().optional().nullable(),
})

export const scheduleCreateSchema = z.object({
  dayOfWeek: z.number().int().min(1, 'Haftanın günü 1 (Pzt) ile 7 (Paz) arasında olmalıdır.').max(7),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Başlangıç saati SS:DD formatında olmalıdır.'),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Bitiş saati SS:DD formatında olmalıdır.'),
  lessonName: z.string().min(2, 'Ders adı en az 2 karakter olmalıdır.'),
  teacher: z.string().min(2, 'Hoca / eğitmen adı zorunludur.'),
  targetAudience: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional().default(true),
})

export const scheduleUpdateSchema = z.object({
  dayOfWeek: z.number().int().min(1).max(7).optional(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
  lessonName: z.string().min(2).optional(),
  teacher: z.string().min(2).optional(),
  targetAudience: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
})

export const contactCreateSchema = z.object({
  name: z.string().min(2, 'İsim en az 2 karakter olmalıdır.').max(100),
  email: z.string().email('Geçerli bir e-posta adresi giriniz.'),
  phone: z.string().max(30).optional().nullable(),
  subject: z.string().max(200).optional().nullable(),
  message: z.string().min(5, 'Mesajınız en az 5 karakter olmalıdır.').max(3000),
  type: z.enum(['GENERAL', 'COURSE_INQUIRY', 'DONATION', 'VOLUNTEER', 'OTHER']).optional().default('GENERAL'),
})

export const messageStatusUpdateSchema = z.object({
  status: z.enum(['UNREAD', 'READ', 'ARCHIVED', 'REPLIED']),
})

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Generates and validates an auto-slug, resolving duplicates with suffix.
 */
export async function resolveUniqueSlug(
  type: 'post' | 'category',
  titleOrSlug: string,
  currentId?: string,
): Promise<string> {
  let baseSlug = slugify(titleOrSlug)
  if (!baseSlug) baseSlug = 'icerik'

  let candidate = baseSlug
  let count = 1

  while (true) {
    if (type === 'post') {
      const existing = await prisma.post.findUnique({
        where: { slug: candidate },
        select: { id: true },
      })
      if (!existing || (currentId && existing.id === currentId)) {
        return candidate
      }
    } else {
      const existing = await prisma.category.findUnique({
        where: { slug: candidate },
        select: { id: true },
      })
      if (!existing || (currentId && existing.id === currentId)) {
        return candidate
      }
    }

    candidate = `${baseSlug}-${count}`
    count++
  }
}
