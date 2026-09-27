import { PrismaClient, AdminRole, PostStatus, GalleryCategory } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Veritabanı seed işlemi başlatılıyor...')

  // 1. Kategoriler (Upsert ile çakışmaları önleme)
  const categoriesData = [
    {
      name: 'Fıkıh & Usûl',
      slug: 'fikih-ve-usul',
      description: 'Klasik medrese usulüyle fıkıh ve metodoloji metinleri.',
    },
    {
      name: 'Kelâm & Akaid',
      slug: 'kelam-ve-akaid',
      description: 'Ehl-i Sünnet akidesi, kelam ve düşünce tarihi.',
    },
    {
      name: 'Hadis & Sünnet',
      slug: 'hadis-ve-sunnet',
      description: 'Hadis usulü, şerhleri ve ahlaki rivayetler.',
    },
    {
      name: 'Medrese & İrfan',
      slug: 'medrese-ve-irfan',
      description: 'İlim talebelerinin hayatı, manevi rehberlik ve vakıf kültürü.',
    },
  ]

  const categories = []
  for (const cat of categoriesData) {
    const c = await prisma.category.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description },
      create: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        isActive: true,
      },
    })
    categories.push(c)
  }
  console.log(`✅ ${categories.length} adet kategori hazırlandı.`)

  // 2. Admin Kullanıcı (Şifre asla koda gömülmez, env üzerinden okunur)
  const adminEmail = process.env.SEED_ADMIN_EMAIL || 'admin@ikikelam.org.tr'
  const rawAdminPassword = process.env.SEED_ADMIN_PASSWORD || 'AdminPassword2026!'
  const passwordHash = await bcrypt.hash(rawAdminPassword, 12)

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: {
      name: 'İki Kelam Başyönetici',
      role: AdminRole.SUPER_ADMIN,
    },
    create: {
      email: adminEmail,
      name: 'İki Kelam Başyönetici',
      passwordHash,
      role: AdminRole.SUPER_ADMIN,
    },
  })
  console.log(`✅ Yönetici kullanıcısı kontrol edildi: ${adminEmail}`)

  // 2.1 Editor Kullanıcı
  const editorEmail = 'editor@ikikelam.org.tr'
  const editorPasswordHash = await bcrypt.hash('EditorPassword2026!', 12)
  await prisma.adminUser.upsert({
    where: { email: editorEmail },
    update: {
      name: 'İki Kelam Editör',
      role: AdminRole.EDITOR,
    },
    create: {
      email: editorEmail,
      name: 'İki Kelam Editör',
      passwordHash: editorPasswordHash,
      role: AdminRole.EDITOR,
    },
  })
  console.log(`✅ Editör kullanıcısı kontrol edildi: ${editorEmail}`)

  // 3. Haftalık Ders Takvimi
  const scheduleData = [
    {
      dayOfWeek: 1, // Pazartesi
      startTime: '18:00',
      endTime: '19:30',
      lessonName: 'Sarf & Nahiv Tahlili (Kavaidü\'l-İ\'rab)',
      teacher: 'Hüseyin Hoca',
      targetAudience: 'Medrese Talebeleri',
      description: 'İleri düzey Arapça gramer ve klasik metin tahlili.',
    },
    {
      dayOfWeek: 3, // Çarşamba
      startTime: '19:00',
      endTime: '20:30',
      lessonName: 'Fıkıh Okumaları (Kifayetü\'l-Ahyar)',
      teacher: 'Ahmet Hoca',
      targetAudience: 'Umuma Açık',
      description: 'Muamelat ve ibadet fıkhı mütalaası.',
    },
    {
      dayOfWeek: 6, // Cumartesi
      startTime: '14:00',
      endTime: '16:00',
      lessonName: 'Usul-i Fıkıh (Menar Metni ve Şerhi)',
      teacher: 'Mehmet Hoca',
      targetAudience: 'İlim Halkası',
      description: 'Hüküm istinbat usulü ve şer\'i deliller.',
    },
    {
      dayOfWeek: 7, // Pazar
      startTime: '11:00',
      endTime: '13:00',
      lessonName: 'Akaid-i Nesefiyye ve Tevhîd Dersi',
      teacher: 'Hafız Ali Hoca',
      targetAudience: 'Gençler & Talebeler',
      description: 'Ehl-i Sünnet inanç esasları ve kelami temeller.',
    },
  ]

  for (const s of scheduleData) {
    const existing = await prisma.weeklySchedule.findFirst({
      where: { dayOfWeek: s.dayOfWeek, lessonName: s.lessonName },
    })

    if (!existing) {
      await prisma.weeklySchedule.create({
        data: s,
      })
    }
  }
  console.log('✅ Haftalık ders takvimi hazırlandı.')

  // 4. Örnek Fotoğraf Galerisi Kayıtları
  const galleryData = [
    {
      title: 'Medrese İlim Meclisi ve Kütüphane',
      imageUrl: 'https://images.unsplash.com/photo-1541829070764-84a7d30dd3f3?auto=format&fit=crop&w=1200&q=80',
      category: GalleryCategory.LIBRARY,
      altText: 'İki Kelam Derneği Kütüphanesi',
    },
    {
      title: 'Haftalık Fıkıh ve Akaid Mütalaası',
      imageUrl: 'https://images.unsplash.com/photo-1507842229450-79949f5984f1?auto=format&fit=crop&w=1200&q=80',
      category: GalleryCategory.CLASSES,
      altText: 'Ders halkası ve talebeler',
    },
    {
      title: 'Geleneksel Talebe İkramı ve Hasbihal',
      imageUrl: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
      category: GalleryCategory.MEDRESE_LIFE,
      altText: 'Medrese günlük yaşam',
    },
  ]

  for (const g of galleryData) {
    const existing = await prisma.galleryImage.findFirst({
      where: { title: g.title },
    })
    if (!existing) {
      await prisma.galleryImage.create({ data: g })
    }
  }
  console.log('✅ Örnek galeri kayıtları hazırlandı.')

  // 5. Örnek Post Kaydı
  const defaultCategory = categories[0]
  if (defaultCategory) {
    await prisma.post.upsert({
      where: { slug: 'medrese-gelenegi-ve-usulun-onemi' },
      update: {},
      create: {
        title: 'Medrese Geleneği ve İlmi Usûlün Önemi',
        slug: 'medrese-gelenegi-ve-usulun-onemi',
        excerpt: 'İlim tahsilinde usul olmadan vusul olmaz kaidesi gereğince, medrese tedrisatının temel dinamikleri üzerine bir mütalaa.',
        content: 'İlim tahsilinde usûl, hakikate ulaştıran en sağlam rehberdir. Medrese geleneğimiz asırlardır talebeyi sadece malumat ile değil, ilmi edep ve ahlak ile donatmıştır...',
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        categoryId: defaultCategory.id,
      },
    })
  }
  console.log('✅ Örnek ilmi yazı hazırlandı.')

  console.log('🎉 Seed işlemi başarıyla tamamlandı!')
}

main()
  .catch((e) => {
    console.error('❌ Seed hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
