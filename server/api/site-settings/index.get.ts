import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  let settings = await prisma.contactSettings.findFirst({
    orderBy: { createdAt: 'asc' },
  })

  if (!settings) {
    settings = await prisma.contactSettings.create({
      data: {
        organizationName: 'İki Kelam İlim ve Kültür Derneği',
        description: 'İlim, irfan ve hikmet yolunda talebe yetiştiren, ilmi meclisler ve hayrî faaliyetler yürüten vakıf müessesesi.',
        phone: '+90 500 000 00 00',
        whatsapp: '+90 500 000 00 00',
        email: 'bilgi@ikikelam.org.tr',
        address: 'Ali Kuşçu Mah. Medrese Sok. No: 12',
        district: 'Fatih',
        city: 'İstanbul',
        postalCode: '34083',
        googleMapsUrl: 'https://maps.google.com/?q=Fatih+Mosque+Istanbul',
        googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Fatih+Mosque+Istanbul&t=&z=15&ie=UTF8&iwloc=&output=embed',
        transportationPublic: 'M1 Emniyet-Fatih durağına 8 dakika, T1 Fındıkzade durağına 10 dakika yürüme mesafesindedir.',
        transportationPrivate: 'Fatih Camii avlusu ve çevresindeki İSPARK açık/kapalı otopark alanlarını kullanabilirsiniz.',
        transportationNotes: 'Cuma günleri ve kandil gecelerinde medrese çevresi araç trafiğine kısmen kapalı olabilir.',
        visitDays: 'Pazartesi – Cumartesi',
        visitHours: '10:00 – 20:00 (Namaz vakitleri hariç)',
        youtubeUrl: 'https://www.youtube.com/@ikikelamresmi',
        instagramUrl: 'https://instagram.com/ikikelamresmi',
        featuredYoutubeVideoId: 'CV797WTQ7b8',
        featuredYoutubeTitle: "Kur'an'da Heisenberg Belirsizlik İlkesi",
        featuredYoutubeDescription: "İki Kelam resmi YouTube kanalından ilim, irfan ve kainat tefekkürüne dair seçilmiş video sohbet.",
      },
    })
  }

  // Ensure default video and social URLs if existing row had nulls
  const publicData = {
    organizationName: settings.organizationName,
    description: settings.description,
    phone: settings.phone,
    whatsapp: settings.whatsapp,
    email: settings.email,
    address: settings.address,
    district: settings.district,
    city: settings.city,
    postalCode: settings.postalCode,
    googleMapsUrl: settings.googleMapsUrl,
    googleMapsEmbedUrl: settings.googleMapsEmbedUrl,
    transportationPublic: settings.transportationPublic,
    transportationPrivate: settings.transportationPrivate,
    transportationNotes: settings.transportationNotes,
    visitDays: settings.visitDays,
    visitHours: settings.visitHours,
    youtubeUrl: settings.youtubeUrl || 'https://www.youtube.com/@ikikelamresmi',
    instagramUrl: settings.instagramUrl || 'https://instagram.com/ikikelamresmi',
    featuredYoutubeVideoId: settings.featuredYoutubeVideoId || 'CV797WTQ7b8',
    featuredYoutubeTitle: settings.featuredYoutubeTitle || "Kur'an'da Heisenberg Belirsizlik İlkesi",
    featuredYoutubeDescription:
      settings.featuredYoutubeDescription ||
      "İki Kelam resmi YouTube kanalından ilim, irfan ve kainat tefekkürüne dair seçilmiş video sohbet.",
  }

  setHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300')

  return {
    success: true,
    data: publicData,
  }
})
