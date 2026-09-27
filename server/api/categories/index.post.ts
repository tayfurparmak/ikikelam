import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { categoryCreateSchema, resolveUniqueSlug } from '~/server/utils/validators'
import { slugify } from '~/utils'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü
  await requireAdminSession(event)

  // 2. Body doğrulama
  const body = await readBody(event)
  const validation = categoryCreateSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: validation.error.issues[0]?.message || 'Geçersiz kategori verisi.',
      data: validation.error.issues,
    })
  }

  const { name, description, shortDescription, image, icon, isActive, sortOrder } = validation.data
  let slug: string

  // 3. Slug üretimi ve 409 Conflict kontrolü
  if (validation.data.slug && validation.data.slug.trim()) {
    const formattedSlug = slugify(validation.data.slug)
    const existing = await prisma.category.findUnique({
      where: { slug: formattedSlug },
      select: { id: true },
    })
    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Bu slug ile kayıtlı bir kategori zaten mevcuttur.',
      })
    }
    slug = formattedSlug
  } else {
    slug = await resolveUniqueSlug('category', name)
  }

  // 4. Veritabanına kayıt
  const category = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      shortDescription,
      image,
      icon,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: sortOrder !== undefined ? sortOrder : 0,
    },
  })

  setResponseStatus(event, 201)
  return {
    success: true,
    data: category,
  }
})
