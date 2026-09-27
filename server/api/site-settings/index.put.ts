import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { siteSettingsUpdateSchema, extractYoutubeVideoId } from '~/server/utils/validators'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü
  await requireAdminSession(event)

  // 2. Body doğrulama
  const body = await readBody(event)
  const validation = siteSettingsUpdateSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: validation.error.issues[0]?.message || 'Geçersiz ayar verisi.',
      data: validation.error.issues,
    })
  }

  const data = validation.data

  // If a full YouTube video URL was provided, safely parse the video ID
  let videoId = data.featuredYoutubeVideoId
  if (data.featuredYoutubeVideoUrl !== undefined) {
    if (data.featuredYoutubeVideoUrl && data.featuredYoutubeVideoUrl.trim()) {
      const parsedId = extractYoutubeVideoId(data.featuredYoutubeVideoUrl)
      if (!parsedId) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Bad Request',
          message: 'Geçerli bir YouTube video bağlantısı girin.',
        })
      }
      videoId = parsedId
    } else {
      // Empty URL clears the featured video
      videoId = null
    }
  } else if (videoId === '') {
    videoId = null
  }

  // 3. Singleton güncelleme / oluşturma
  let settings = await prisma.contactSettings.findFirst({
    orderBy: { createdAt: 'asc' },
  })

  const updatePayload = {
    ...(data.organizationName ? { organizationName: data.organizationName } : {}),
    ...(data.description !== undefined ? { description: data.description } : {}),
    ...(data.youtubeUrl !== undefined ? { youtubeUrl: data.youtubeUrl } : {}),
    ...(data.instagramUrl !== undefined ? { instagramUrl: data.instagramUrl } : {}),
    ...(videoId !== undefined ? { featuredYoutubeVideoId: videoId } : {}),
    ...(data.featuredYoutubeTitle !== undefined ? { featuredYoutubeTitle: data.featuredYoutubeTitle } : {}),
    ...(data.featuredYoutubeDescription !== undefined
      ? { featuredYoutubeDescription: data.featuredYoutubeDescription }
      : {}),
  }

  if (settings) {
    settings = await prisma.contactSettings.update({
      where: { id: settings.id },
      data: updatePayload,
    })
  } else {
    settings = await prisma.contactSettings.create({
      data: {
        organizationName: data.organizationName || 'İki Kelam İlim ve Kültür Derneği',
        description: data.description || null,
        youtubeUrl: data.youtubeUrl || 'https://www.youtube.com/@ikikelamresmi',
        instagramUrl: data.instagramUrl || 'https://instagram.com/ikikelamresmi',
        featuredYoutubeVideoId: videoId || 'CV797WTQ7b8',
        featuredYoutubeTitle: data.featuredYoutubeTitle || "Kur'an'da Heisenberg Belirsizlik İlkesi",
        featuredYoutubeDescription: data.featuredYoutubeDescription || null,
      },
    })
  }

  return {
    success: true,
    data: settings,
    message: 'Site ve sosyal medya ayarları başarıyla güncellendi.',
  }
})
