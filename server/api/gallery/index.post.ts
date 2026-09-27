import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { galleryCreateSchema } from '~/server/utils/validators'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü
  await requireAdminSession(event)

  // 2. Body doğrulama
  const body = await readBody(event)
  const validation = galleryCreateSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: validation.error.issues[0]?.message || 'Geçersiz galeri görseli verisi.',
      data: validation.error.issues,
    })
  }

  const { title, imageUrl, storagePath, category, altText } = validation.data

  // 3. Veritabanına kaydet
  const image = await prisma.galleryImage.create({
    data: {
      title,
      imageUrl,
      storagePath: storagePath ?? null,
      category,
      altText: altText ?? null,
    },
  })

  setResponseStatus(event, 201)
  return {
    success: true,
    data: image,
  }
})
