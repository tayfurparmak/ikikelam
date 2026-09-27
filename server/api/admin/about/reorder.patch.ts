import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const body = await readBody(event)
  const { type, items } = body as {
    type: string
    items: Array<{ id: string; sortOrder: number }>
  }

  if (!type || !Array.isArray(items)) {
    throw createError({ statusCode: 400, message: 'Geçersiz sıralama verisi.' })
  }

  await prisma.$transaction(
    items.map((item) => {
      switch (type) {
        case 'value':
          return prisma.aboutValue.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        case 'whyUs':
          return prisma.whyUsItem.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        case 'history':
          return prisma.historyItem.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        case 'service':
          return prisma.aboutServiceItem.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        case 'faq':
          return prisma.faqItem.update({
            where: { id: item.id },
            data: { sortOrder: item.sortOrder },
          })
        default:
          throw createError({ statusCode: 400, message: 'Geçersiz tür.' })
      }
    })
  )

  return {
    success: true,
    message: 'Sıralama başarıyla güncellendi.',
  }
})
