import type { ContactType, MessageStatus } from '@prisma/client'
import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü
  await requireAdminSession(event)

  const query = getQuery(event)
  const page = Math.max(1, Number.parseInt(String(query.page || '1'), 10) || 1)
  const limit = Math.min(100, Math.max(1, Number.parseInt(String(query.limit || '20'), 10) || 20))
  const skip = (page - 1) * limit

  const whereClause: {
    status?: MessageStatus
    type?: ContactType
    OR?: Array<{
      name?: { contains: string; mode: 'insensitive' }
      email?: { contains: string; mode: 'insensitive' }
      subject?: { contains: string; mode: 'insensitive' }
      message?: { contains: string; mode: 'insensitive' }
    }>
  } = {}

  if (query.status) {
    whereClause.status = query.status as MessageStatus
  }

  if (query.type) {
    whereClause.type = query.type as ContactType
  }

  if (query.search) {
    const search = String(query.search).trim()
    if (search) {
      whereClause.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { subject: { contains: search, mode: 'insensitive' } },
        { message: { contains: search, mode: 'insensitive' } },
      ]
    }
  }

  const [total, unreadCount, messages] = await Promise.all([
    prisma.contactMessage.count({ where: whereClause }),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.contactMessage.findMany({
      where: whereClause,
      skip,
      take: limit,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return {
    success: true,
    data: messages,
    unreadCount,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasMore: page * limit < total,
    },
  }
})
