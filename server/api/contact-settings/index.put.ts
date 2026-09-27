import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'
import { contactSettingsUpdateSchema } from '~/server/utils/validators'

export default defineEventHandler(async (event) => {
  // 1. Yetkilendirme kontrolü
  await requireAdminSession(event)

  // 2. Body doğrulama
  const body = await readBody(event)
  const validation = contactSettingsUpdateSchema.safeParse(body)
  if (!validation.success) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: validation.error.issues[0]?.message || 'Geçersiz form verisi.',
      data: validation.error.issues,
    })
  }

  const data = validation.data

  // 3. Singleton kontrolü
  let settings = await prisma.contactSettings.findFirst({
    orderBy: { createdAt: 'asc' },
  })

  if (settings) {
    settings = await prisma.contactSettings.update({
      where: { id: settings.id },
      data: {
        organizationName: data.organizationName,
        description: data.description ?? null,
        phone: data.phone ?? null,
        whatsapp: data.whatsapp ?? null,
        email: data.email || null,
        address: data.address ?? null,
        district: data.district ?? null,
        city: data.city ?? null,
        postalCode: data.postalCode ?? null,
        googleMapsUrl: data.googleMapsUrl || null,
        googleMapsEmbedUrl: data.googleMapsEmbedUrl || null,
        transportationPublic: data.transportationPublic ?? null,
        transportationPrivate: data.transportationPrivate ?? null,
        transportationNotes: data.transportationNotes ?? null,
        visitDays: data.visitDays ?? null,
        visitHours: data.visitHours ?? null,
        youtubeUrl: data.youtubeUrl !== undefined ? data.youtubeUrl : undefined,
        instagramUrl: data.instagramUrl !== undefined ? data.instagramUrl : undefined,
        featuredYoutubeVideoId: data.featuredYoutubeVideoId !== undefined ? data.featuredYoutubeVideoId : undefined,
        featuredYoutubeTitle: data.featuredYoutubeTitle !== undefined ? data.featuredYoutubeTitle : undefined,
        featuredYoutubeDescription: data.featuredYoutubeDescription !== undefined ? data.featuredYoutubeDescription : undefined,
      },
    })
  } else {
    settings = await prisma.contactSettings.create({
      data: {
        organizationName: data.organizationName,
        description: data.description ?? null,
        phone: data.phone ?? null,
        whatsapp: data.whatsapp ?? null,
        email: data.email || null,
        address: data.address ?? null,
        district: data.district ?? null,
        city: data.city ?? null,
        postalCode: data.postalCode ?? null,
        googleMapsUrl: data.googleMapsUrl || null,
        googleMapsEmbedUrl: data.googleMapsEmbedUrl || null,
        transportationPublic: data.transportationPublic ?? null,
        transportationPrivate: data.transportationPrivate ?? null,
        transportationNotes: data.transportationNotes ?? null,
        visitDays: data.visitDays ?? null,
        visitHours: data.visitHours ?? null,
        youtubeUrl: data.youtubeUrl || null,
        instagramUrl: data.instagramUrl || null,
        featuredYoutubeVideoId: data.featuredYoutubeVideoId || null,
        featuredYoutubeTitle: data.featuredYoutubeTitle || null,
        featuredYoutubeDescription: data.featuredYoutubeDescription || null,
      },
    })
  }

  return {
    success: true,
    data: settings,
    message: 'İletişim bilgileri başarıyla güncellendi.',
  }
})
