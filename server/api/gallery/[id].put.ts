import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { deleteFromSupabaseStorage } from '~/server/utils/storage'
import { galleryUpdateSchema } from '~/server/utils/validators'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Görsel kimliği (ID) belirtilmelidir.',
    })
  }

  // 2. Mevcut görseli bul
  const existing = await prisma.galleryImage.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Güncellenecek görsel bulunamadı.',
    })
  }

  // 3. Body doğrulama
  const body = await readBody(event)
  const validation = galleryUpdateSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: validation.error.issues[0]?.message || 'Geçersiz görsel verisi.',
      data: validation.error.issues,
    })
  }

  const { title, imageUrl, storagePath, category, altText } = validation.data

  // 4. Eğer dosya yolu/bağlantısı değiştirilmişse ve eskisi varsa, eski dosyayı temizle
  if (
    (storagePath !== undefined && existing.storagePath && existing.storagePath !== storagePath) ||
    (imageUrl !== undefined && existing.imageUrl !== imageUrl && !storagePath && existing.storagePath)
  ) {
    await deleteFromSupabaseStorage(existing.storagePath)
  }

  // 5. Veritabanını güncelle
  const updated = await prisma.galleryImage.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      ...(imageUrl !== undefined ? { imageUrl } : {}),
      ...(storagePath !== undefined ? { storagePath } : {}),
      ...(category !== undefined ? { category } : {}),
      ...(altText !== undefined ? { altText } : {}),
    },
  })

  return {
    success: true,
    data: updated,
  }
})
