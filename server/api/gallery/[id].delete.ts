import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { deleteFromSupabaseStorage } from '~/server/utils/storage'

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
      message: 'Silinmek istenen görsel bulunamadı.',
    })
  }

  // 3. Supabase Storage dosyasını sil (storagePath veya imageUrl üzerinden)
  const targetPath = existing.storagePath || existing.imageUrl
  if (targetPath) {
    await deleteFromSupabaseStorage(targetPath)
  }

  // 4. Veritabanı kaydını sil
  await prisma.galleryImage.delete({
    where: { id },
  })

  return {
    success: true,
    message: 'Görsel ve ilişkili depolama dosyası başarıyla silindi.',
  }
})
