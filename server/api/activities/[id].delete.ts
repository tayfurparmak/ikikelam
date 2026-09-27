import prisma from '~/lib/prisma'
import { requireAdminRole } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü (SUPER_ADMIN ve ADMIN)
  await requireAdminRole(event, ['SUPER_ADMIN', 'ADMIN'])

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Faaliyet ID belirtilmelidir.',
    })
  }

  // 2. Mevcut kaydı kontrol et
  const existing = await prisma.category.findUnique({
    where: { id },
  })

  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Silinecek faaliyet bulunamadı.',
    })
  }

  // 3. Silme işlemi (Prisma onDelete: SetNull sayesinde bağlı postlar bozulmadan korunur)
  await prisma.category.delete({
    where: { id },
  })

  return {
    success: true,
    message: `"${existing.name}" faaliyeti başarıyla silindi. Bağlı içerikler korundu.`,
  }
})
