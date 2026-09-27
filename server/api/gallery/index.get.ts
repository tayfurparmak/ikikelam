import type { GalleryCategory } from '@prisma/client'
import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  const page = Math.max(1, Number.parseInt(String(query.page || '1'), 10) || 1)
  const limit = Math.min(100, Math.max(1, Number.parseInt(String(query.limit || '20'), 10) || 20))
  const skip = (page - 1) * limit

  const whereClause: {
    category?: GalleryCategory
    OR?: Array<{
      title?: { contains: string; mode: 'insensitive' }
      altText?: { contains: string; mode: 'insensitive' }
    }>
  } = {}

  if (query.category) {
    const rawCat = String(query.category).trim()
    const aliasMap: Record<string, GalleryCategory> = {
      'MEDRESE_LIFE': 'MEDRESE_LIFE',
      'haftalik-sohbetler': 'MEDRESE_LIFE',
      'CLASSES': 'CLASSES',
      'cocuk-dersleri': 'CLASSES',
      'EVENTS': 'EVENTS',
      'etkinlikler': 'EVENTS',
      'LIBRARY': 'LIBRARY',
      'HISTORICAL': 'HISTORICAL',
      'GENERAL': 'GENERAL',
    }
    const mapped = aliasMap[rawCat] || aliasMap[rawCat.toUpperCase()]
    if (mapped) {
      whereClause.category = mapped
    }
  }

  if (query.search) {
    const search = String(query.search).trim()
    if (search) {
      whereClause.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { altText: { contains: search, mode: 'insensitive' } },
      ]
    }
  }

  const [total, images] = await Promise.all([
    prisma.galleryImage.count({ where: whereClause }),
    prisma.galleryImage.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return {
    success: true,
    data: images,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  }
})
