import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  // 1. Singleton AboutPage
  let page = await prisma.aboutPage.findUnique({
    where: { id: 'main' },
  })

  if (!page) {
    page = await prisma.aboutPage.create({
      data: {
        id: 'main',
        title: 'Biz Kimiz?',
        subtitle: 'İlim, irfan ve muhabbet yolunda birlikte.',
        buttonText: 'Daha Fazla Bilgi',
        buttonUrl: '/biz-kimiz',
      },
    })
  }

  // 2. Fetch all items (both active and inactive) for admin
  const [values, whyUs, history, services, faqs] = await Promise.all([
    prisma.aboutValue.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.whyUsItem.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.historyItem.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.aboutServiceItem.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.faqItem.findMany({
      orderBy: { sortOrder: 'asc' },
    }),
  ])

  return {
    success: true,
    data: {
      page,
      values,
      whyUs,
      history,
      services,
      faqs,
    },
  }
})
