import prisma from '~/lib/prisma'
import { contactCreateSchema } from '~/server/utils/validators'

export default defineEventHandler(async (event) => {
  // 1. Body okuma ve spam/bot koruması (Honeypot)
  const body = await readBody(event)

  // Honeypot kontrolü: Eğer bot tuzak alanı doldurulmuşsa sessizce başarılı dön
  if (body?.website || body?._hp) {
    return {
      success: true,
      message: 'Mesajınız başarıyla iletildi.',
    }
  }

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

  // 2. Mesajı veritabanına kaydet
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
    select: {
      id: true,
      createdAt: true,
    },
  })

  setResponseStatus(event, 201)
  return {
    success: true,
    message: 'Mesajınız başarıyla iletildi. En kısa sürede değerlendirilecektir.',
    data: {
      id: contact.id,
      createdAt: contact.createdAt,
    },
  }
})
