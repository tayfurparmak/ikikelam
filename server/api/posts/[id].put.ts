import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { deleteFromSupabaseStorage } from '~/server/utils/storage'
import { postUpdateSchema, resolveUniqueSlug } from '~/server/utils/validators'
import { slugify } from '~/utils'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü
  await requireAdminSession(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Yazı kimliği (ID) belirtilmelidir.',
    })
  }

  // 2. Mevcut yazıyı bul
  const existingPost = await prisma.post.findUnique({
    where: { id },
  })

  if (!existingPost) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Not Found',
      message: 'Güncellenecek yazı bulunamadı.',
    })
  }

  // 3. Body doğrulama
  const body = await readBody(event)
  const validation = postUpdateSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: validation.error.issues[0]?.message || 'Geçersiz yazı verisi.',
      data: validation.error.issues,
    })
  }

  const { title, excerpt, content, coverImage, status, categoryId } = validation.data

  // 4. Kategori kontrolü
  if (categoryId !== undefined && categoryId !== null) {
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

  // 5. Slug güncelleme kontrolü
  let slug = existingPost.slug
  if (validation.data.slug && validation.data.slug !== existingPost.slug) {
    const formattedSlug = slugify(validation.data.slug)
    const duplicate = await prisma.post.findFirst({
      where: {
        slug: formattedSlug,
        NOT: { id: existingPost.id },
      },
    })
    if (duplicate) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Conflict',
        message: 'Bu slug ile kayıtlı başka bir yazı zaten mevcuttur.',
      })
    }
    slug = formattedSlug
  } else if (title && title !== existingPost.title && !validation.data.slug) {
    slug = await resolveUniqueSlug('post', title, existingPost.id)
  }

  // 6. Kapak resmi değiştiyse eski resmi temizle
  if (coverImage !== undefined && existingPost.coverImage && existingPost.coverImage !== coverImage) {
    await deleteFromSupabaseStorage(existingPost.coverImage)
  }

  // 7. Yayın tarihi belirleme
  let publishedAt = existingPost.publishedAt
  if (validation.data.publishedAt !== undefined) {
    publishedAt = validation.data.publishedAt ? new Date(validation.data.publishedAt) : null
  } else if (status === 'PUBLISHED' && !existingPost.publishedAt) {
    publishedAt = new Date()
  }

  // 8. Veritabanını güncelle
  const updatedPost = await prisma.post.update({
    where: { id },
    data: {
      ...(title !== undefined ? { title } : {}),
      slug,
      ...(excerpt !== undefined ? { excerpt: excerpt ?? null } : {}),
      ...(content !== undefined ? { content } : {}),
      ...(coverImage !== undefined ? { coverImage: coverImage ?? null } : {}),
      ...(status !== undefined ? { status } : {}),
      publishedAt,
      ...(categoryId !== undefined ? { categoryId: categoryId ?? null } : {}),
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

  return {
    success: true,
    data: updatedPost,
  }
})
