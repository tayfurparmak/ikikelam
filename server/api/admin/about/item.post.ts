import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const body = await readBody(event)
  const { type, ...itemData } = body

  if (!type) {
    throw createError({ statusCode: 400, message: 'İçerik türü belirtilmelidir.' })
  }

  let createdItem
  switch (type) {
    case 'value': {
      if (!itemData.title || !itemData.description) {
        throw createError({ statusCode: 400, message: 'Başlık ve açıklama zorunludur.' })
      }
      const count = await prisma.aboutValue.count()
      createdItem = await prisma.aboutValue.create({
        data: {
          title: itemData.title,
          description: itemData.description,
          icon: itemData.icon || 'Heart',
          sortOrder: itemData.sortOrder !== undefined ? Number(itemData.sortOrder) : count + 1,
          isActive: itemData.isActive !== undefined ? Boolean(itemData.isActive) : true,
        },
      })
      break
    }
    case 'whyUs': {
      if (!itemData.title || !itemData.description) {
        throw createError({ statusCode: 400, message: 'Başlık ve açıklama zorunludur.' })
      }
      const count = await prisma.whyUsItem.count()
      createdItem = await prisma.whyUsItem.create({
        data: {
          title: itemData.title,
          description: itemData.description,
          icon: itemData.icon || 'CheckCircle',
          sortOrder: itemData.sortOrder !== undefined ? Number(itemData.sortOrder) : count + 1,
          isActive: itemData.isActive !== undefined ? Boolean(itemData.isActive) : true,
        },
      })
      break
    }
    case 'history': {
      if (!itemData.year || !itemData.title || !itemData.description) {
        throw createError({ statusCode: 400, message: 'Yıl, başlık ve açıklama zorunludur.' })
      }
      const count = await prisma.historyItem.count()
      createdItem = await prisma.historyItem.create({
        data: {
          year: itemData.year,
          title: itemData.title,
          description: itemData.description,
          image: itemData.image || null,
          sortOrder: itemData.sortOrder !== undefined ? Number(itemData.sortOrder) : count + 1,
          isActive: itemData.isActive !== undefined ? Boolean(itemData.isActive) : true,
        },
      })
      break
    }
    case 'service': {
      if (!itemData.title || !itemData.description) {
        throw createError({ statusCode: 400, message: 'Hizmet başlığı ve açıklaması zorunludur.' })
      }
      const count = await prisma.aboutServiceItem.count()
      createdItem = await prisma.aboutServiceItem.create({
        data: {
          title: itemData.title,
          description: itemData.description,
          icon: itemData.icon || 'BookOpen',
          image: itemData.image || null,
          sortOrder: itemData.sortOrder !== undefined ? Number(itemData.sortOrder) : count + 1,
          isActive: itemData.isActive !== undefined ? Boolean(itemData.isActive) : true,
        },
      })
      break
    }
    case 'faq': {
      if (!itemData.question || !itemData.answer) {
        throw createError({ statusCode: 400, message: 'Soru ve cevap zorunludur.' })
      }
      const count = await prisma.faqItem.count()
      createdItem = await prisma.faqItem.create({
        data: {
          question: itemData.question,
          answer: itemData.answer,
          category: itemData.category || 'Genel',
          sortOrder: itemData.sortOrder !== undefined ? Number(itemData.sortOrder) : count + 1,
          isActive: itemData.isActive !== undefined ? Boolean(itemData.isActive) : true,
        },
      })
      break
    }
    default:
      throw createError({ statusCode: 400, message: 'Geçersiz içerik türü.' })
  }

  return {
    success: true,
    data: createdItem,
    message: 'Yeni içerik başarıyla eklendi.',
  }
})
