import prisma from '../lib/prisma'

async function seedAbout() {
  console.log('🌱 Seeding AboutPage and related kurumsal entities...')

  // 1. AboutPage Singleton
  await prisma.aboutPage.upsert({
    where: { id: 'main' },
    update: {},
    create: {
      id: 'main',
      title: 'Biz Kimiz?',
      subtitle: 'İlim, irfan ve muhabbet yolunda birlikte.',
      intro: 'İki Kelam İlim ve Kültür Derneği; kadim medrese usûlünü günümüz idrakiyle meczederek ilim, amel ve ihlâs ekseninde talebe yetiştiren, ilmi neşriyat ve kültürel faaliyetler yürüten bir ilim ve irfan meclisidir.',
      content: '<h3>İlim ve İrfan Mirasımız</h3><p>İki Kelam, sahih İslam mirasının temel taşları olan tefsir, hadis, fıkıh ve akaid ilimlerini klasik medrese metodolojisiyle yeni nesillere aktarmayı şiar edinmiştir. İstanbul Fatih\'in kadim manevi atmosferinde kurulan medresemiz; ilim talebelerine burs, barınma ve düzenli tedrisat desteği sağlamaktadır.</p><p>Ders meclislerimiz sadece nazari bir bilgi aktarımı değil; edep, tevazu, ihlâs ve kardeşlik şuuruyla yoğrulan bir seyr ü sülûk ve şahsiyet inşası gayesi taşır.</p>',
      image: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
      videoUrl: 'https://www.youtube.com/watch?v=CV797WTQ7b8',
      buttonText: 'Faaliyetlerimizi Keşfet',
      buttonUrl: '/activities',
      isActive: true,
      missionTitle: 'Misyonumuz',
      missionSubtitle: 'Kadim medrese mirasını günümüz idrakiyle buluşturmak.',
      missionContent: '<p>Ehl-i Sünnet ve’l-Cemaat çizgisine sadakatle, metin merkezli klasik tedrisatı ihya etmek; ilmin izzetini koruyarak çağın zihni ve ahlaki buhranlarına sahih ilimle rehberlik eden müstakim ilim ehli ve talebeler yetiştirmektir.</p>',
      missionIcon: 'Compass',
      missionActive: true,
      visionTitle: 'Vizyonumuz',
      visionSubtitle: 'İlim ve faziletle mücehhez bir nesil yetiştirmek.',
      visionContent: '<p>Gelenekten geleceğe uzanan köprüde, ilim ile ameli meczeden, toplumun her kesimine irfan ve muhabbet aşılayan, ulusal ve uluslararası düzeyde örnek bir ilim ve kültür yuvası olmaktır.</p>',
      visionIcon: 'Eye',
      visionActive: true,
      valuesActive: true,
      whyUsActive: true,
      historyActive: true,
      servicesActive: true,
      faqActive: true,
      seoTitle: 'Biz Kimiz? | İki Kelam İlim ve Kültür Derneği',
      seoDescription: 'İki Kelam\'ın misyonu, vizyonu, temel değerleri, medrese tarihçesi ve topluma sunduğu hayırlı hizmetler.',
    },
  })
  console.log('✅ AboutPage singleton created.')

  // 2. Values (Değerlerimiz)
  const valuesCount = await prisma.aboutValue.count()
  if (valuesCount === 0) {
    const defaultValues = [
      { title: 'İlim', description: 'Sahih itikat ve kadim medrese usûlü üzere tavizsiz ilmi derinlik.', icon: 'BookOpen', sortOrder: 1 },
      { title: 'İrfan', description: 'İlmi kalbe nakşeden, amele dönüştüren ahlaki ve manevi terbiye.', icon: 'Heart', sortOrder: 2 },
      { title: 'Muhabbet', description: 'Gönülleri birleştiren, kardeşliği pekiştiren samimi ve sıcak meclisler.', icon: 'Smile', sortOrder: 3 },
      { title: 'Kardeşlik', description: 'Talebelerimiz ve gönüldaşlarımızla hakiki bir uhuvvet bağı.', icon: 'Users', sortOrder: 4 },
      { title: 'Ahlak & Edep', description: 'İlim meclislerinin temel taşı olan nebevî edep ve tevazu.', icon: 'ShieldCheck', sortOrder: 5 },
      { title: 'Dayanışma', description: 'İlim talebelerinin her türlü maddi ve manevi ihtiyacında yanında olma.', icon: 'Handshake', sortOrder: 6 },
      { title: 'Metin Merkezli Tedrisat', description: 'Klasik usûlde şerh ve haşiyelerin satır satır mütalaası.', icon: 'GraduationCap', sortOrder: 7 },
      { title: 'Karşılıksız Hizmet', description: 'Yalnızca rıza-i ilahi gayesiyle yürütülen vakıf ruhu.', icon: 'Sparkles', sortOrder: 8 },
    ]
    for (const v of defaultValues) {
      await prisma.aboutValue.create({ data: { ...v, isActive: true } })
    }
    console.log(`✅ ${defaultValues.length} values created.`)
  }

  // 3. WhyUsItem (Neden İki Kelam?)
  const whyUsCount = await prisma.whyUsItem.count()
  if (whyUsCount === 0) {
    const defaultWhyUs = [
      { title: 'Sahih İstikamet', description: 'Ehl-i Sünnet omurgasına sadakatle, şüphe ve tefritten uzak sahih ilmi rehberlik.', icon: 'Compass', sortOrder: 1 },
      { title: 'Klasik Tedrisat & Birebir Takip', description: 'Her talebenin ilmi ve ahlaki gelişimini yakından gözeten ehil müderrisler.', icon: 'Award', sortOrder: 2 },
      { title: 'Sıcak & Samimi İrfan Ortamı', description: 'Kuru malumattan uzak, kalpleri dirilten sohbetler ve kardeşlik meclisleri.', icon: 'Flame', sortOrder: 3 },
      { title: 'Gençlik & Aile Odaklı Çalışmalar', description: 'Çocuklardan gençlere, ailelerden esnafa her yaş grubuna özel programlar.', icon: 'UserCheck', sortOrder: 4 },
    ]
    for (const w of defaultWhyUs) {
      await prisma.whyUsItem.create({ data: { ...w, isActive: true } })
    }
    console.log(`✅ ${defaultWhyUs.length} why-us items created.`)
  }

  // 4. HistoryItem (Tarihçe)
  const historyCount = await prisma.historyItem.count()
  if (historyCount === 0) {
    const defaultHistory = [
      { year: '2020', title: 'İki Kelam\'ın Temelleri', description: 'İstanbul Fatih\'te küçük bir mecliste ilim ve irfan sevdalısı gönüllerin bir araya gelmesiyle çalışmalarımız başladı.', sortOrder: 1 },
      { year: '2022', title: 'Düzenli Ders Halkaları', description: 'Klasik sarf, nahiv, fıkıh ve akaid halkaları kurularak medrese tedrisatı kurumsal zemine oturtuldu.', sortOrder: 2 },
      { year: '2024', title: 'Gençlik ve Talebe Destekleri', description: 'Talebe bursları, yatılı medrese imkânları ve haftalık umuma açık sohbetlerle faaliyetlerimiz genişletildi.', sortOrder: 3 },
      { year: '2026', title: 'Dijital Medrese & Neşriyat', description: 'İlmi birikimi çağdaş araçlarla tüm dünyaya ulaştırmak üzere dijital neşriyat ve web platformumuz hayata geçirildi.', sortOrder: 4 },
    ]
    for (const h of defaultHistory) {
      await prisma.historyItem.create({ data: { ...h, isActive: true } })
    }
    console.log(`✅ ${defaultHistory.length} history items created.`)
  }

  // 5. AboutServiceItem (Hizmetlerimiz)
  const servicesCount = await prisma.aboutServiceItem.count()
  if (servicesCount === 0) {
    const defaultServices = [
      { title: 'Risale-i Nur & Tefsir Dersleri', description: 'Kur\'an ve iman hakikatlerinin çağın idrakine sunulduğu derinlikli mütalaalar.', icon: 'BookOpen', sortOrder: 1 },
      { title: 'Klasik Medrese Tedrisatı', description: 'Arapça, sarf, nahiv, fıkıh, mantık ve akaid derslerinden oluşan tam teşekküllü ilim programı.', icon: 'GraduationCap', sortOrder: 2 },
      { title: 'Aile ve Çocuk Programları', description: 'Geleceğimizin teminatı yavrularımız için Kur\'an-ı Kerim, temel dini bilgiler ve ahlak atölyeleri.', icon: 'Heart', sortOrder: 3 },
      { title: 'Gençlik Sohbetleri & Kamplar', description: 'Üniversite ve lise gençliğine yönelik şuur seminerleri, kitap tahlilleri ve sosyal etkinlikler.', icon: 'Users', sortOrder: 4 },
      { title: 'Haftalık İlim Meclisleri', description: 'Her hafta cumartesi ve pazar günleri umuma açık irfani sohbet ve nasihat halkaları.', icon: 'Mic', sortOrder: 5 },
      { title: 'Dijital Neşriyat & Video Yayınlar', description: 'İlim ve tefekkür sohbetlerinin yüksek kalitede video kayıtları ve sosyal medya neşriyatı.', icon: 'Video', sortOrder: 6 },
    ]
    for (const s of defaultServices) {
      await prisma.aboutServiceItem.create({ data: { ...s, isActive: true } })
    }
    console.log(`✅ ${defaultServices.length} service items created.`)
  }

  // 6. FaqItem (Sıkça Sorulan Sorular)
  const faqCount = await prisma.faqItem.count()
  if (faqCount === 0) {
    const defaultFaqs = [
      { question: 'İki Kelam Derneği nedir ve hangi usûlle faaliyet göstermektedir?', answer: 'İki Kelam, Ehl-i Sünnet ve’l-Cemaat itikadı üzere klasik İslam medrese geleneğini muhafaza eden ve çağın manevi ihtiyaçlarına cevap vermeyi hedefleyen bağımsız bir ilim ve irfan hareketidir.', sortOrder: 1 },
      { question: 'Haftalık sohbet ve derslere kimler katılabilir?', answer: 'Umuma açık haftalık sohbetlerimize ve seminerlerimize dileyen tüm kardeşlerimiz ücretsiz olarak katılabilir.', sortOrder: 2 },
      { question: 'Dersler nerede ve hangi vakitlerde yapılmaktadır?', answer: 'Derslerimiz dernek merkezimiz olan Fatih medresemizde yürütülmektedir. Güncel gün ve saatler Haftalık Program sayfamızda ilan edilmektedir.', sortOrder: 3 },
      { question: 'Çocuklar ve gençler için hangi programlar mevcuttur?', answer: 'Hafta sonu çocuk Kur\'an kursları, gençlik kitap tahlilleri ve ahlaki gelişim halkaları düzenli olarak gerçekleştirilmektedir.', sortOrder: 4 },
      { question: 'Medrese talebelerine nasıl destek olabilir veya bağış yapabilirim?', answer: 'Bağış sayfamızda yer alan resmi banka hesap numaralarımız (IBAN) üzerinden talebe bursu veya genel dernek faaliyetlerine açıklama belirterek bağışta bulunabilirsiniz.', sortOrder: 5 },
    ]
    for (const f of defaultFaqs) {
      await prisma.faqItem.create({ data: { ...f, isActive: true } })
    }
    console.log(`✅ ${defaultFaqs.length} FAQ items created.`)
  }

  await prisma.$disconnect()
  console.log('🎉 About seed completed successfully!')
}

seedAbout().catch((err) => {
  console.error(err)
  process.exit(1)
})
