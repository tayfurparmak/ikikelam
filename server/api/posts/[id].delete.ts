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
      message: 'Yazı kimliği (ID) belirtilmelidir.',
    })
  }

  // 2. Mevcut yazıyı bul
  const existingPost = await prisma.post.findUnique({
    where: { id },
  })

  if (!existingPost) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Silinmek istenen yazı bulunamadı.',
    })
  }

  // 3. Kapak görseli varsa storage'dan temizle
  if (existingPost.coverImage) {
    await deleteFromSupabaseStorage(existingPost.coverImage)
  }

  // 4. Veritabanından sil
  await prisma.post.delete({
    where: { id },
  })

  return {
    success: true,
    message: 'Yazı başarıyla silindi.',
  }
})
