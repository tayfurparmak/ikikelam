import prisma from '~/lib/prisma'
import { getAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Program kimliği (ID) belirtilmelidir.',
    })
  }

  const session = await getAdminSession(event)

  const schedule = await prisma.weeklySchedule.findUnique({
    where: { id },
  })

  if (!schedule) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Ders programı bulunamadı.',
    })
  }

  if (!schedule.isActive && !session) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Ders programı bulunamadı veya aktif değil.',
    })
  }

  return {
    success: true,
    data: schedule,
  }
})
