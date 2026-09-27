import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { scheduleUpdateSchema } from '~/server/utils/validators'

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
      message: 'Güncellenecek ders programı bulunamadı.',
    })
  }

  // 3. Body doğrulama
  const body = await readBody(event)
  const validation = scheduleUpdateSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: validation.error.issues[0]?.message || 'Geçersiz ders programı verisi.',
      data: validation.error.issues,
    })
  }

  const { dayOfWeek, startTime, endTime, lessonName, teacher, targetAudience, description, isActive } =
    validation.data

  // 4. Güncelle
  const updated = await prisma.weeklySchedule.update({
    where: { id },
    data: {
      ...(dayOfWeek !== undefined ? { dayOfWeek } : {}),
      ...(startTime !== undefined ? { startTime } : {}),
      ...(endTime !== undefined ? { endTime } : {}),
      ...(lessonName !== undefined ? { lessonName } : {}),
      ...(teacher !== undefined ? { teacher } : {}),
      ...(targetAudience !== undefined ? { targetAudience: targetAudience ?? null } : {}),
      ...(description !== undefined ? { description: description ?? null } : {}),
      ...(isActive !== undefined ? { isActive } : {}),
    },
  })

  return {
    success: true,
    data: updated,
  }
})
