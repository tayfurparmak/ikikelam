import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { scheduleCreateSchema } from '~/server/utils/validators'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü
  await requireAdminSession(event)

  // 2. Body doğrulama
  const body = await readBody(event)
  const validation = scheduleCreateSchema.safeParse(body)
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

  // 3. Veritabanına kaydet
  const schedule = await prisma.weeklySchedule.create({
    data: {
      dayOfWeek,
      startTime,
      endTime,
      lessonName,
      teacher,
      targetAudience: targetAudience ?? null,
      description: description ?? null,
      isActive: isActive ?? true,
    },
  })

  setResponseStatus(event, 201)
  return {
    success: true,
    data: schedule,
  }
})
