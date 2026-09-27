import type { Prisma } from '@prisma/client'
import prisma from '~/lib/prisma'
import { getAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const session = await getAdminSession(event)

  // 1. Sayfalama parametreleri
  const page = Math.max(1, parseInt(String(query.page || '1'), 10) || 1)
  const limit = Math.min(50, Math.max(1, parseInt(String(query.limit || '10'), 10) || 10))
  const skip = (page - 1) * limit

  // 2. Filtre oluşturma
  const where: Prisma.PostWhereInput = {}

  // Statü filtresi: Eğer kullanıcı admin değilse SADECE PUBLISHED içerikler gelir
  if (session) {
    if (query.status && typeof query.status === 'string') {
      const upperStatus = query.status.toUpperCase()
      if (['DRAFT', 'PUBLISHED', 'ARCHIVED'].includes(upperStatus)) {
        where.status = upperStatus as 'DRAFT' | 'PUBLISHED' | 'ARCHIVED'
      }
    }
  } else {
    where.status = 'PUBLISHED'
  }

  // Kategori filtresi (ID veya Slug)
  if (query.category && typeof query.category === 'string') {
    where.category = {
      OR: [{ id: query.category }, { slug: query.category }],
    }
  }

  // Slug filtresi
  if (query.slug && typeof query.slug === 'string') {
    where.slug = query.slug
  }

  // Arama filtresi (Başlık, Özet, İçerik)
  if (query.search && typeof query.search === 'string') {
    const term = query.search.trim()
    where.OR = [
      { title: { contains: term, mode: 'insensitive' } },
      { excerpt: { contains: term, mode: 'insensitive' } },
      { content: { contains: term, mode: 'insensitive' } },
    ]
  }

  // 3. Veritabanı sorgusu ve toplam kayıt sayısı
  const [total, posts] = await Promise.all([
    prisma.post.count({ where }),
    prisma.post.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
  ])

  const totalPages = Math.ceil(total / limit) || 1

  return {
    success: true,
    data: posts,
    meta: {
      total,
      page,
      limit,
      totalPages,
      hasMore: page < totalPages,
    },
  }
})
