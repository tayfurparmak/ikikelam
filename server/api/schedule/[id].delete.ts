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
      message: 'Program kimliği (ID) belirtilmelidir.',
    })
  }

  // 2. Mevcut kaydı bul
  const existing = await prisma.weeklySchedule.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Silinmek istenen ders programı bulunamadı.',
    })
  }

  // 3. Veritabanından sil
  await prisma.weeklySchedule.delete({
    where: { id },
  })

  return {
    success: true,
    message: 'Ders programı başarıyla silindi.',
  }
})
