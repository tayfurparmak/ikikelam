import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const address = 'Gürpınar, Çakabey Cd. 40/a'
  const district = 'Bornova'
  const city = 'İzmir'
  const postalCode = '35060'
  const phone = '0541 155 74 01'
  const whatsapp = '+905411557401'
  const googleMapsUrl = 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x14b9659d91b2e59f:0x46bb50e2b956af15?sa=X&ved=1t:8290&ictx=111'
  const googleMapsEmbedUrl = 'https://maps.google.com/maps?q=G%C3%BCrp%C4%B1nar,+%C3%87akabey+Cd.+40/a,+35060+Bornova/%C4%B0zmir&t=&z=16&ie=UTF8&iwloc=&output=embed'
  const transportationPublic = 'İzmir Metrosu Bornova veya Evka 3 aktarma merkezlerinden kalkan ESHOT otobüsleri ve minibüslerle Gürpınar Çakabey Caddesi durağına kolayca ulaşabilirsiniz.'
  const transportationPrivate = 'Çakabey Caddesi üzerinde ve bina çevresinde araç park imkânı bulunmaktadır.'

  const existing = await prisma.contactSettings.findFirst({
    orderBy: { createdAt: 'asc' },
  })

  if (existing) {
    const updated = await prisma.contactSettings.update({
      where: { id: existing.id },
      data: {
        address,
        district,
        city,
        postalCode,
        phone,
        whatsapp,
        googleMapsUrl,
        googleMapsEmbedUrl,
        transportationPublic,
        transportationPrivate,
      },
    })
    console.log('ContactSettings updated successfully in database:', updated.id)
  } else {
    const created = await prisma.contactSettings.create({
      data: {
        organizationName: 'İki Kelam İlim ve Kültür Derneği',
        address,
        district,
        city,
        postalCode,
        phone,
        whatsapp,
        email: 'bilgi@ikikelam.org.tr',
        googleMapsUrl,
        googleMapsEmbedUrl,
        transportationPublic,
        transportationPrivate,
        visitDays: 'Pazartesi – Cumartesi',
        visitHours: '10:00 – 20:00 (Namaz vakitleri hariç)',
      },
    })
    console.log('ContactSettings created successfully in database:', created.id)
  }
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
