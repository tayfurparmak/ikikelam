import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)
  const body = await readBody(event)

  const updated = await prisma.aboutPage.upsert({
    where: { id: 'main' },
    update: {
      title: body.title !== undefined ? body.title : undefined,
      subtitle: body.subtitle !== undefined ? body.subtitle : undefined,
      intro: body.intro !== undefined ? body.intro : undefined,
      content: body.content !== undefined ? body.content : undefined,
      image: body.image !== undefined ? body.image : undefined,
      videoUrl: body.videoUrl !== undefined ? body.videoUrl : undefined,
      buttonText: body.buttonText !== undefined ? body.buttonText : undefined,
      buttonUrl: body.buttonUrl !== undefined ? body.buttonUrl : undefined,
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : undefined,

      // Misyon
      missionTitle: body.missionTitle !== undefined ? body.missionTitle : undefined,
      missionSubtitle: body.missionSubtitle !== undefined ? body.missionSubtitle : undefined,
      missionContent: body.missionContent !== undefined ? body.missionContent : undefined,
      missionImage: body.missionImage !== undefined ? body.missionImage : undefined,
      missionIcon: body.missionIcon !== undefined ? body.missionIcon : undefined,
      missionActive: body.missionActive !== undefined ? Boolean(body.missionActive) : undefined,

      // Vizyon
      visionTitle: body.visionTitle !== undefined ? body.visionTitle : undefined,
      visionSubtitle: body.visionSubtitle !== undefined ? body.visionSubtitle : undefined,
      visionContent: body.visionContent !== undefined ? body.visionContent : undefined,
      visionImage: body.visionImage !== undefined ? body.visionImage : undefined,
      visionIcon: body.visionIcon !== undefined ? body.visionIcon : undefined,
      visionActive: body.visionActive !== undefined ? Boolean(body.visionActive) : undefined,

      // Section Toggles
      valuesActive: body.valuesActive !== undefined ? Boolean(body.valuesActive) : undefined,
      whyUsActive: body.whyUsActive !== undefined ? Boolean(body.whyUsActive) : undefined,
      historyActive: body.historyActive !== undefined ? Boolean(body.historyActive) : undefined,
      servicesActive: body.servicesActive !== undefined ? Boolean(body.servicesActive) : undefined,
      faqActive: body.faqActive !== undefined ? Boolean(body.faqActive) : undefined,

      // SEO
      seoTitle: body.seoTitle !== undefined ? body.seoTitle : undefined,
      seoDescription: body.seoDescription !== undefined ? body.seoDescription : undefined,
      seoOgImage: body.seoOgImage !== undefined ? body.seoOgImage : undefined,
      seoCanonical: body.seoCanonical !== undefined ? body.seoCanonical : undefined,
    },
    create: {
      id: 'main',
      title: body.title || 'Biz Kimiz?',
      subtitle: body.subtitle || 'İlim, irfan ve muhabbet yolunda birlikte.',
      intro: body.intro || null,
      content: body.content || null,
      image: body.image || null,
      videoUrl: body.videoUrl || null,
      buttonText: body.buttonText || 'Daha Fazla Bilgi',
      buttonUrl: body.buttonUrl || '/biz-kimiz',
      isActive: body.isActive !== undefined ? Boolean(body.isActive) : true,
      missionTitle: body.missionTitle || 'Misyonumuz',
      missionSubtitle: body.missionSubtitle || null,
      missionContent: body.missionContent || null,
      missionIcon: body.missionIcon || 'Compass',
      missionActive: body.missionActive !== undefined ? Boolean(body.missionActive) : true,
      visionTitle: body.visionTitle || 'Vizyonumuz',
      visionSubtitle: body.visionSubtitle || null,
      visionContent: body.visionContent || null,
      visionIcon: body.visionIcon || 'Eye',
      visionActive: body.visionActive !== undefined ? Boolean(body.visionActive) : true,
      valuesActive: body.valuesActive !== undefined ? Boolean(body.valuesActive) : true,
      whyUsActive: body.whyUsActive !== undefined ? Boolean(body.whyUsActive) : true,
      historyActive: body.historyActive !== undefined ? Boolean(body.historyActive) : true,
      servicesActive: body.servicesActive !== undefined ? Boolean(body.servicesActive) : true,
      faqActive: body.faqActive !== undefined ? Boolean(body.faqActive) : true,
      seoTitle: body.seoTitle || 'Biz Kimiz? | İki Kelam',
      seoDescription: body.seoDescription || null,
    },
  })

  return {
    success: true,
    data: updated,
    message: 'Genel sayfa ve kurumsal ayarlar başarıyla güncellendi.',
  }
})
