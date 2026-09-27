import prisma from '~/lib/prisma'
import { getAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const idOrSlug = getRouterParam(event, 'id')
  if (!idOrSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Kategori kimliği (ID veya slug) belirtilmelidir.',
    })
  }

  // ID veya slug ile arama
  const category = await prisma.category.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })

  const session = await getAdminSession(event)
  if (!category || (!category.isActive && !session)) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Kategori bulunamadı veya aktif değil.',
    })
  }

  return {
    success: true,
    data: category,
  }
})
