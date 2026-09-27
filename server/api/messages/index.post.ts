import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { contactCreateSchema } from '~/server/utils/validators'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü
  await requireAdminSession(event)

  // 2. Body doğrulama
  const body = await readBody(event)
  const validation = contactCreateSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: validation.error.issues[0]?.message || 'Lütfen form alanlarını kontrol ediniz.',
      data: validation.error.issues,
    })
  }

  const { name, email, phone, subject, message, type } = validation.data

  const contact = await prisma.contactMessage.create({
    data: {
      name,
      email,
      phone: phone ?? null,
      subject: subject ?? null,
      message,
      type: type || 'GENERAL',
      status: 'UNREAD',
    },
  })

  setResponseStatus(event, 201)
  return {
    success: true,
    data: contact,
  }
})
