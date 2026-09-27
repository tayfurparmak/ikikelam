import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Görsel kimliği (ID) belirtilmelidir.',
    })
  }

  const image = await prisma.galleryImage.findUnique({
    where: { id },
  })

  if (!image) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Görsel bulunamadı.',
    })
  }

  return {
    success: true,
    data: image,
  }
})
