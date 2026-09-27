import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { postCreateSchema, resolveUniqueSlug } from '~/server/utils/validators'
import { slugify } from '~/utils'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü
  await requireAdminSession(event)

  // 2. Body doğrulama
  const body = await readBody(event)
  const validation = postCreateSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: validation.error.issues[0]?.message || 'Geçersiz yazı verisi.',
      data: validation.error.issues,
    })
  }

  const { title, excerpt, content, coverImage, status, categoryId } = validation.data
  let slug: string

  // 3. Slug üretimi ve 409 Conflict kontrolü
  if (validation.data.slug && validation.data.slug.trim()) {
    const formattedSlug = slugify(validation.data.slug)
    const existing = await prisma.post.findUnique({
      where: { slug: formattedSlug },
      select: { id: true },
    })
    if (existing) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Bu slug ile kayıtlı bir yazı zaten mevcuttur.',
      })
    }
    slug = formattedSlug
  } else {
    slug = await resolveUniqueSlug('post', title)
  }

  // 4. Kategori varlık kontrolü (varsa)
  if (categoryId) {
    const cat = await prisma.category.findUnique({
      where: { id: categoryId },
      select: { id: true },
    })
    if (!cat) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Bad Request',
        message: 'Belirtilen kategori bulunamadı.',
      })
    }
  }

  // 5. Yayınlanma tarihi belirleme
  const publishedAt =
    status === 'PUBLISHED'
      ? validation.data.publishedAt
        ? new Date(validation.data.publishedAt)
        : new Date()
      : validation.data.publishedAt
        ? new Date(validation.data.publishedAt)
        : null

  // 6. Kayıt oluşturma (Database Transaction ile atomik yürütme)
  const post = await prisma.$transaction(async (tx) => {
    return await tx.post.create({
      data: {
        title,
        slug,
        excerpt: excerpt ?? null,
        content,
        coverImage: coverImage ?? null,
        status,
        publishedAt,
        categoryId: categoryId ?? null,
      },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    })
  })

  setResponseStatus(event, 201)
  return {
    success: true,
    data: post,
  }
})
