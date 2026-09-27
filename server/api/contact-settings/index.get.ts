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
        phone: '0541 155 74 01',
        whatsapp: '+905411557401',
        email: 'bilgi@ikikelam.org.tr',
        address: 'Gürpınar, Çakabey Cd. 40/a',
        district: 'Bornova',
        city: 'İzmir',
        postalCode: '35060',
        googleMapsUrl: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x14b9659d91b2e59f:0x46bb50e2b956af15?sa=X&ved=1t:8290&ictx=111',
        googleMapsEmbedUrl: 'https://maps.google.com/maps?q=G%C3%BCrp%C4%B1nar,+%C3%87akabey+Cd.+40/a,+35060+Bornova/%C4%B0zmir&t=&z=16&ie=UTF8&iwloc=&output=embed',
        transportationPublic: 'İzmir Metrosu Bornova veya Evka 3 aktarma istasyonlarından kalkan ESHOT otobüsleri ve minibüs hatları.',
        transportationPrivate: 'Çakabey Caddesi üzerinde ve bina çevresinde araç park alanları mevcuttur.',
        transportationNotes: 'Haftalık sohbet meclislerimizde salonumuz erken saatlerde dolabilmektedir.',
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
