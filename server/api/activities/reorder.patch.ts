import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { z } from 'zod'

const reorderSchema = z.object({
  items: z.array(
    z.object({
      id: z.string(),
      sortOrder: z.number().int().min(0),
    })
  ).min(1, 'En az bir faaliyet sıralaması belirtilmelidir.'),
})

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const body = await readBody(event)
  const validation = reorderSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Geçersiz sıralama verisi.',
      data: validation.error.issues,
    })
  }

  // Update in a transaction
  await prisma.$transaction(
    validation.data.items.map((item) =>
      prisma.category.update({
        where: { id: item.id },
        data: { sortOrder: item.sortOrder },
      })
    )
  )

  return {
    success: true,
    message: 'Faaliyet sıralaması güncellendi.',
  }
})
