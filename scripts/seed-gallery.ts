import { PrismaClient, GalleryCategory } from '@prisma/client'

const prisma = new PrismaClient()

const gallerySeedData = [
  // 1. Haftalık Sohbetler (MEDRESE_LIFE)
  {
    title: 'Haftalık Riyâzü\'s-Sâlihîn ve Hadis Sohbet Meclisi',
    altText: 'Cemaat ve talebelerin katıldığı hadis sohbet halkası',
    category: GalleryCategory.MEDRESE_LIFE,
    imageUrl: 'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'İkindi Sonrası Hasbihal ve Manevi Sohbet',
    altText: 'Hocalarımız ve talebelerin ikindi hasbihali',
    category: GalleryCategory.MEDRESE_LIFE,
    imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Medrese Avlusunda Kardeşlik ve Çay Meclisi',
    altText: 'Sohbet sonrası kardeşlik muhabbeti ve çay ikramı',
    category: GalleryCategory.MEDRESE_LIFE,
    imageUrl: 'https://images.unsplash.com/photo-1517245386807-bb43f82c33c4?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Yatsı Namazı Sonrası Tefsir ve Dua Halkası',
    altText: 'Tefsir sohbeti ve toplu dua merasimi',
    category: GalleryCategory.MEDRESE_LIFE,
    imageUrl: 'https://images.unsplash.com/photo-1564769625905-50e93615e769?auto=format&fit=crop&w=1400&q=85',
  },

  // 2. Çocuk Dersleri (CLASSES)
  {
    title: 'Çocuk Kur\'an-ı Kerim ve Elifba Talimi',
    altText: 'Minik talebelerin rahle başında Kur\'an okuması',
    category: GalleryCategory.CLASSES,
    imageUrl: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Hafta Sonu Çocuk Siyer ve Karakter Atölyesi',
    altText: 'Çocukların interaktif siyer dersi çalışması',
    category: GalleryCategory.CLASSES,
    imageUrl: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Talebe Sure Ezberi ve Mahreç Dersi',
    altText: 'Müderris eşliğinde tecvid ve sure ezberi',
    category: GalleryCategory.CLASSES,
    imageUrl: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Çocuklar İçin Adab-ı Muaşeret Eğitimi',
    altText: 'Ahlak ve edep dersine katılan talebeler',
    category: GalleryCategory.CLASSES,
    imageUrl: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1400&q=85',
  },

  // 3. Etkinlikler (EVENTS)
  {
    title: 'Yıllık İlim Meclisi ve İcazet Töreni',
    altText: 'Medrese mezuniyet ve icazet merasimi',
    category: GalleryCategory.EVENTS,
    imageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Gençlik İlim Kampı ve Doğa Yürüyüşü',
    altText: 'Gençlerin katıldığı yaz kampı ve açık hava hasbihali',
    category: GalleryCategory.EVENTS,
    imageUrl: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Ramazan-ı Şerif İftar Sofrası ve Mukabele',
    altText: 'Dernek iftar sofrasında bir araya gelen gönüllüler',
    category: GalleryCategory.EVENTS,
    imageUrl: 'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1400&q=85',
  },
  {
    title: 'Kitap Tahlili ve Yazar Buluşması',
    altText: 'İlim ve fikir dünyasından konukla söyleşi programı',
    category: GalleryCategory.EVENTS,
    imageUrl: 'https://images.unsplash.com/photo-1507842229450-79949f5984f1?auto=format&fit=crop&w=1400&q=85',
  },
]

async function main() {
  console.log('🖼️ Galeri tohum verileri yükleniyor...')

  // Delete previously placeholder or broken test images if needed
  await prisma.galleryImage.deleteMany({
    where: {
      OR: [
        { imageUrl: { contains: 'example.com' } },
        { title: { contains: 'Yetkisiz' } },
      ],
    },
  })

  for (const item of gallerySeedData) {
    const existing = await prisma.galleryImage.findFirst({
      where: { title: item.title },
    })

    if (!existing) {
      await prisma.galleryImage.create({
        data: item,
      })
      console.log(`  ➕ Eklendi: ${item.title} (${item.category})`)
    } else {
      await prisma.galleryImage.update({
        where: { id: existing.id },
        data: item,
      })
      console.log(`  🔄 Güncellendi: ${item.title} (${item.category})`)
    }
  }

  console.log('✨ Galeri tohum verileri başarıyla tamamlandı!')
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
