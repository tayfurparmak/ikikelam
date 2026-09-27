import prisma from '~/lib/prisma'
import { getAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const idOrSlug = getRouterParam(event, 'id')
  if (!idOrSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Faaliyet ID veya Slug belirtilmelidir.',
    })
  }

  const session = await getAdminSession(event)

  const activity = await prisma.category.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
      ...(session ? {} : { isActive: true }),
    },
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })

  if (!activity) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Faaliyet kategorisi bulunamadı veya pasif durumda.',
    })
  }

  return {
    success: true,
    data: activity,
  }
})
