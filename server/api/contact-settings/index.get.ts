import prisma from '~/lib/prisma'

export default defineEventHandler(async (event) => {
  // Singleton pattern: get existing or initialize default
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
        transportationPublic: 'M1 Emniyet-Fatih durağına 8 dakika, T1 Fındıkzade durağına 10 dakika yürüme mesafesindedir. Fatih Camii veya Yavuz Selim duraklarından geçen tüm otobüslerle derneğimize kolayca ulaşabilirsiniz.',
        transportationPrivate: 'Fatih Camii avlusu ve çevresindeki İSPARK açık/kapalı otopark alanlarını kullanabilirsiniz.',
        transportationNotes: 'Cuma günleri ve kandil gecelerinde medrese çevresi araç trafiğine kısmen kapalı olabilir.',
        visitDays: 'Pazartesi – Cumartesi',
        visitHours: '10:00 – 20:00 (Namaz vakitleri hariç)',
      },
    })
  }

  // Cache headers: 60s max-age, stale-while-revalidate
  setHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300')

  return {
    success: true,
    data: settings,
  }
})
