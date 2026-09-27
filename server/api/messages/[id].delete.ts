import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Mesaj kimliği (ID) belirtilmelidir.',
    })
  }

  const existing = await prisma.contactMessage.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Silinmek istenen mesaj bulunamadı.',
    })
  }

  await prisma.contactMessage.delete({
    where: { id },
  })

  return {
    success: true,
    message: 'Mesaj başarıyla silindi.',
  }
})
