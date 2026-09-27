import prisma from '~/lib/prisma'

export default defineEventHandler(async () => {
  // 1. Singleton AboutPage
  let page = await prisma.aboutPage.findUnique({
    where: { id: 'main' },
  })

  // If not created yet, create with defaults
  if (!page) {
    page = await prisma.aboutPage.create({
      data: {
        id: 'main',
        title: 'Biz Kimiz?',
        subtitle: 'İlim, irfan ve muhabbet yolunda birlikte.',
        intro: 'İki Kelam İlim ve Kültür Derneği; kadim medrese usûlünü günümüz idrakiyle meczederek ilim, amel ve ihlâs ekseninde talebe yetiştiren, ilmi neşriyat ve kültürel faaliyetler yürüten bir ilim ve irfan meclisidir.',
        buttonText: 'Faaliyetlerimizi Keşfet',
        buttonUrl: '/activities',
      },
    })
  }

  // 2. Fetch Active Items in parallel
  const [values, whyUs, history, services, faqs] = await Promise.all([
    prisma.aboutValue.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.whyUsItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.historyItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.aboutServiceItem.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' },
    }),
    prisma.faqItem.findMany({
      where: { isActive: true },
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
