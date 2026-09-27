import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const body = await readBody(event)
  const { type, id, isActive } = body as {
    type: string
    id: string
    isActive: boolean
  }

  if (!type || !id || typeof isActive !== 'boolean') {
    throw createError({ statusCode: 400, message: 'Tür, ID ve aktiflik durumu gereklidir.' })
  }

  let updated
  switch (type) {
    case 'value':
      updated = await prisma.aboutValue.update({
        where: { id },
        data: { isActive },
      })
      break
    case 'whyUs':
      updated = await prisma.whyUsItem.update({
        where: { id },
        data: { isActive },
      })
      break
    case 'history':
      updated = await prisma.historyItem.update({
        where: { id },
        data: { isActive },
      })
      break
    case 'service':
      updated = await prisma.aboutServiceItem.update({
        where: { id },
        data: { isActive },
      })
      break
    case 'faq':
      updated = await prisma.faqItem.update({
        where: { id },
        data: { isActive },
      })
      break
    default:
      throw createError({ statusCode: 400, message: 'Geçersiz tür.' })
  }

  return {
    success: true,
    data: updated,
    message: isActive ? 'İçerik yayına alındı.' : 'İçerik pasife alındı.',
  }
})
