import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { categoryUpdateSchema, resolveUniqueSlug } from '~/server/utils/validators'
import { slugify } from '~/utils'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Kategori ID belirtilmelidir.',
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
      message: 'Güncellenecek kategori bulunamadı.',
    })
  }

  // 3. Body doğrulama
  const body = await readBody(event)
  const validation = categoryUpdateSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: validation.error.issues[0]?.message || 'Geçersiz güncelleme verisi.',
      data: validation.error.issues,
    })
  }

  const { name, description, shortDescription, image, icon, isActive, sortOrder } = validation.data
  let slug = existing.slug

  if (validation.data.slug && validation.data.slug !== existing.slug) {
    const formattedSlug = slugify(validation.data.slug)
    const duplicate = await prisma.category.findFirst({
      where: {
        slug: formattedSlug,
        NOT: { id: existing.id },
      },
    })
    if (duplicate) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Bu slug ile kayıtlı başka bir kategori zaten mevcuttur.',
      })
    }
    slug = formattedSlug
  } else if (name && name !== existing.name && !validation.data.slug) {
    // İsim değiştiğinde benzersiz slug üret
    slug = await resolveUniqueSlug('category', name, existing.id)
  }

  // 4. Güncelleme
  const updated = await prisma.category.update({
    where: { id },
    data: {
      name: name ?? existing.name,
      slug,
      description: description !== undefined ? description : existing.description,
      shortDescription: shortDescription !== undefined ? shortDescription : existing.shortDescription,
      image: image !== undefined ? image : existing.image,
      icon: icon !== undefined ? icon : existing.icon,
      isActive: isActive !== undefined ? isActive : existing.isActive,
      sortOrder: sortOrder !== undefined ? sortOrder : existing.sortOrder,
    },
  })

  return {
    success: true,
    data: updated,
  }
})
