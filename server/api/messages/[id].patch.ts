import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { messageStatusUpdateSchema } from '~/server/utils/validators'

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

  // 2. Mevcut mesajı kontrol et
  const existing = await prisma.contactMessage.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Mesaj bulunamadı.',
    })
  }

  // 3. Body doğrulama
  const body = await readBody(event)
  const validation = messageStatusUpdateSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: validation.error.issues[0]?.message || 'Geçersiz mesaj durumu.',
      data: validation.error.issues,
    })
  }

  // 4. Güncelle
  const updated = await prisma.contactMessage.update({
    where: { id },
    data: {
      status: validation.data.status,
    },
  })

  return {
    success: true,
    data: updated,
  }
})
