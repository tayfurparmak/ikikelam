import prisma from '~/lib/prisma'
import { getAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const idOrSlug = getRouterParam(event, 'id')
  if (!idOrSlug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Yazı kimliği (ID veya slug) belirtilmelidir.',
    })
  }

  const session = await getAdminSession(event)

  const post = await prisma.post.findFirst({
    where: {
      OR: [{ id: idOrSlug }, { slug: idOrSlug }],
    },
    include: {
      category: {
        select: {
          id: true,
          name: true,
          slug: true,
        },
      },
    },
  })

  if (!post) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'İçerik bulunamadı.',
    })
  }

  // Eğer içerik yayınlanmamışsa ve ziyaretçi admin değilse 404 dön
  if (post.status !== 'PUBLISHED' && !session) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'İçerik bulunamadı veya henüz yayında değil.',
    })
  }

  return {
    success: true,
    data: post,
  }
})
