import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const query = getQuery(event)
  const body = event.node.req.method !== 'GET' ? await readBody(event).catch(() => ({})) : {}
  const type = (query.type || body.type) as string
  const id = (query.id || body.id) as string

  if (!type || !id) {
    throw createError({ statusCode: 400, message: 'İçerik türü ve ID belirtilmelidir.' })
  }

  switch (type) {
    case 'value':
      await prisma.aboutValue.delete({ where: { id } })
      break
    case 'whyUs':
      await prisma.whyUsItem.delete({ where: { id } })
      break
    case 'history':
      await prisma.historyItem.delete({ where: { id } })
      break
    case 'service':
      await prisma.aboutServiceItem.delete({ where: { id } })
      break
    case 'faq':
      await prisma.faqItem.delete({ where: { id } })
      break
    default:
      throw createError({ statusCode: 400, message: 'Geçersiz içerik türü.' })
  }

  return {
    success: true,
    message: 'İçerik başarıyla silindi.',
  }
})
