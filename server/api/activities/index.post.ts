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
      message: validation.error.issues[0]?.message || 'Geçersiz faaliyet verisi.',
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
        message: 'Bu slug ile kayıtlı bir faaliyet kategorisi zaten mevcuttur.',
      })
    }
    slug = formattedSlug
  } else {
    slug = await resolveUniqueSlug('category', name)
  }

  // Otomatik sortOrder hesaplama (eğer belirtilmediyse en sona ekle)
  let calculatedSortOrder = sortOrder
  if (calculatedSortOrder === undefined || calculatedSortOrder === 0) {
    const lastCategory = await prisma.category.findFirst({
      orderBy: { sortOrder: 'desc' },
      select: { sortOrder: true },
    })
    calculatedSortOrder = (lastCategory?.sortOrder ?? -1) + 1
  }

  // 4. Veritabanına kayıt
  const activity = await prisma.category.create({
    data: {
      name,
      slug,
      description,
      shortDescription,
      image,
      icon,
      isActive: isActive !== undefined ? isActive : true,
      sortOrder: calculatedSortOrder,
    },
  })

  setResponseStatus(event, 201)
  return {
    success: true,
    data: activity,
    message: 'Faaliyet kategorisi başarıyla oluşturuldu.',
  }
})
