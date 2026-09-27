import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const body = await readBody(event)
  const { type, id, ...itemData } = body

  if (!type || !id) {
    throw createError({ statusCode: 400, message: 'İçerik türü ve ID belirtilmelidir.' })
  }

  let updatedItem
  switch (type) {
    case 'value': {
      updatedItem = await prisma.aboutValue.update({
        where: { id },
        data: {
          title: itemData.title !== undefined ? itemData.title : undefined,
          description: itemData.description !== undefined ? itemData.description : undefined,
          icon: itemData.icon !== undefined ? itemData.icon : undefined,
          sortOrder: itemData.sortOrder !== undefined ? Number(itemData.sortOrder) : undefined,
          isActive: itemData.isActive !== undefined ? Boolean(itemData.isActive) : undefined,
        },
      })
      break
    }
    case 'whyUs': {
      updatedItem = await prisma.whyUsItem.update({
        where: { id },
        data: {
          title: itemData.title !== undefined ? itemData.title : undefined,
          description: itemData.description !== undefined ? itemData.description : undefined,
          icon: itemData.icon !== undefined ? itemData.icon : undefined,
          sortOrder: itemData.sortOrder !== undefined ? Number(itemData.sortOrder) : undefined,
          isActive: itemData.isActive !== undefined ? Boolean(itemData.isActive) : undefined,
        },
      })
      break
    }
    case 'history': {
      updatedItem = await prisma.historyItem.update({
        where: { id },
        data: {
          year: itemData.year !== undefined ? itemData.year : undefined,
          title: itemData.title !== undefined ? itemData.title : undefined,
          description: itemData.description !== undefined ? itemData.description : undefined,
          image: itemData.image !== undefined ? itemData.image : undefined,
          sortOrder: itemData.sortOrder !== undefined ? Number(itemData.sortOrder) : undefined,
          isActive: itemData.isActive !== undefined ? Boolean(itemData.isActive) : undefined,
        },
      })
      break
    }
    case 'service': {
      updatedItem = await prisma.aboutServiceItem.update({
        where: { id },
        data: {
          title: itemData.title !== undefined ? itemData.title : undefined,
          description: itemData.description !== undefined ? itemData.description : undefined,
          icon: itemData.icon !== undefined ? itemData.icon : undefined,
          image: itemData.image !== undefined ? itemData.image : undefined,
          sortOrder: itemData.sortOrder !== undefined ? Number(itemData.sortOrder) : undefined,
          isActive: itemData.isActive !== undefined ? Boolean(itemData.isActive) : undefined,
        },
      })
      break
    }
    case 'faq': {
      updatedItem = await prisma.faqItem.update({
        where: { id },
        data: {
          question: itemData.question !== undefined ? itemData.question : undefined,
          answer: itemData.answer !== undefined ? itemData.answer : undefined,
          category: itemData.category !== undefined ? itemData.category : undefined,
          sortOrder: itemData.sortOrder !== undefined ? Number(itemData.sortOrder) : undefined,
          isActive: itemData.isActive !== undefined ? Boolean(itemData.isActive) : undefined,
        },
      })
      break
    }
    default:
      throw createError({ statusCode: 400, message: 'Geçersiz içerik türü.' })
  }

  return {
    success: true,
    data: updatedItem,
    message: 'İçerik başarıyla güncellendi.',
  }
})
