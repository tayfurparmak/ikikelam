import { PrismaClient, PostStatus } from '@prisma/client'

const prisma = new PrismaClient()

const categoriesData = [
  {
    name: "Çocuk Kur'an Kursları",
    slug: 'cocuk-kuran-kurslari',
    description:
      'Tecvid, mahreç ve hafızlık hazırlık programlarıyla çocuklarımızın Kur\'an-ı Kerim\'i doğru ve sevgisiyle öğrenmelerini hedefleyen tedrisat halkalarımız.',
    isActive: true,
  },
  {
    name: 'Çocuk Dersleri',
    slug: 'cocuk-dersleri',
    description:
      'Temel dini bilgiler, adab-ı muaşeret, siyer-i nebi ve karakter inşası odağında çocuklara yönelik hafta sonu ilim meclisleri.',
    isActive: true,
  },
  {
    name: 'Gençlik Dersleri',
    slug: 'genclik-dersleri',
    description:
      'Lise ve üniversite çağındaki gençlere yönelik akaid, fıkıh, medeniyet tasavvuru ve güncel fikri meselelerin tahlil edildiği atölye ve okumalar.',
    isActive: true,
  },
  {
    name: 'Haftalık Sohbetler',
    slug: 'haftalik-sohbetler',
    description:
      'Her hafta camiamız, mahalle sakinlerimiz ve ilim talipleriyle bir araya geldiğimiz tefsir, hadis ve irfan meclisleri.',
    isActive: true,
  },
]

const samplePosts = [
  {
    categorySlug: 'cocuk-kuran-kurslari',
    title: "Minik Kalplerde Kur'an Sevgisi: Elifba ve Tecvid Eğitimi",
    slug: 'minik-kalplerde-kuran-sevgisi-elifba-ve-tecvid-egitimi',
    excerpt:
      "Çocuklarımıza Kur'an-ı Kerim okumayı harflerin doğru mahreci ve tecvid kaideleriyle sevdirerek öğretiyoruz.",
    coverImage: 'https://images.unsplash.com/photo-1609599006353-e629aaabfeae?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Kur'an-ı Kerim eğitimi, bir Müslümanın evladına bırakabileceği en kıymetli mirastır. Medresemizde tertip edilen Çocuk Kur'an Kurslarımızda, pedagojik formasyon ve şefkatli bir tedrisat diliyle minik yavrularımıza harflerin mahreçleri ve temel tecvid kuralları talim ettirilmektedir.</p>
      <h3>Eğitim Müfredatımız</h3>
      <ul>
        <li><strong>Elifbâ ve Mahreç Talimi:</strong> Harflerin ses özelliklerine uygun olarak doğru telaffuzu.</li>
        <li><strong>Temel Tecvid Kaideleri:</strong> Medler, gunneler ve ihfa gibi temel kuralların uygulamalı tatbiki.</li>
        <li><strong>Namaz Sureleri Ezberi:</strong> Fatiha ve kısa surelerin manalarıyla birlikte hıfz edilmesi.</li>
        <li><strong>Dua ve Adab:</strong> Günlük hayatın bereket vesilesi olan me'sur duaların öğretilmesi.</li>
      </ul>
      <p>Hafta içi ve hafta sonu gruplarımızla her bir talebemizle birebir ilgilenilmekte, çocukların yaş gruplarına uygun etkinliklerle dersler zenginleştirilmektedir.</p>
    `,
  },
  {
    categorySlug: 'cocuk-kuran-kurslari',
    title: 'Hafızlık Ön Hazırlık ve Sure Talimi Sınıflarımız Başladı',
    slug: 'hafizlik-on-hazirlik-ve-sure-talimi-siniflarimiz-basladi',
    excerpt:
      'Kur\'an-ı Kerim\'i yüzünden akıcı okuyan talebelerimiz için hafızlık temeli atan özel talim sınıflarımız açıldı.',
    coverImage: 'https://images.unsplash.com/photo-1584551246679-0daf3d275d0f?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Hafızlık, zihni ve kalbi vahiyle inşa eden muazzam bir lütuftur. İki Kelam Derneği bünyesinde tecvidini ikmal etmiş talebelerimiz için başlattığımız ön hazırlık programında düzenli ezber yapma disiplini ve kelime tahlilleri uygulanmaktadır.</p>
      <h3>Program Kazanımları</h3>
      <p>Talebelerimiz bu program ile zihin intizamı kazanırken aynı zamanda Kur'an lafızlarının ulviyetini idrak etmektedirler.</p>
    `,
  },
  {
    categorySlug: 'cocuk-dersleri',
    title: "Çocuklar İçin Siyer-i Nebi ve Sahabe İklimi",
    slug: 'cocuklar-icin-siyer-i-nebi-ve-sahabe-iklimi',
    excerpt:
      'Peygamber Efendimiz (s.a.v.) ve kutlu ashabının hayatını çocukların dünyasına hitap eden hikâyelerle aktarıyoruz.',
    coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Karakter inşasının en sağlam zeminini, Asr-ı Saadet'in nurlu tabloları teşkil eder. Hafta sonları düzenlenen Çocuk Derslerimizde, Resûlullah Efendimiz'in çocuklara olan merhametini, adaleti ve örnek ahlakını hikâye diliyle işlemekteyiz.</p>
      <h3>İşlenen Temel Başlıklar</h3>
      <ul>
        <li>Peygamberimizin Çocukluk ve Gençlik Yılları</li>
        <li>Enes b. Malik ve Abdullah b. Abbas gibi genç sahabelerin örnekliği</li>
        <li>Doğruluk, Emanet, Tevazu ve Cömertlik ahlakı</li>
        <li>Camii ve cemaat adabı, büyüklere saygı</li>
      </ul>
      <p>Dersler sonunda yapılan interaktif soru-cevap ve atölye çalışmalarıyla öğrenilenler kalıcı hale getirilmektedir.</p>
    `,
  },
  {
    categorySlug: 'cocuk-dersleri',
    title: 'Adab-ı Muaşeret ve Güzel Ahlak Atölyesi',
    slug: 'adab-i-muaseret-ve-guzel-ahlak-atolyesi',
    excerpt:
      'Selamlaşma, sofra adabı, büyüklere hürmet ve kardeşlik ahlakını uygulamalı olarak işleyen meclislerimiz.',
    coverImage: 'https://images.unsplash.com/photo-1497633762265-9d179a990aa6?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>İlim, edeple kıymet kazanır. Kadim medrese ahlakının en mühim unsuru olan adab-ı muaşeret kaidelerini, çocuklarımızın günlük hayatlarında tatbik edebilmeleri için haftalık tematik atölyeler tertipliyoruz.</p>
    `,
  },
  {
    categorySlug: 'genclik-dersleri',
    title: 'Gençlerle Fıkıh ve Hayat: Çağdaş Meselelere Şer\'i Bakış',
    slug: 'genclerle-fikih-ve-hayat-cagdas-meselelere-seri-bakis',
    excerpt:
      'Günümüz dünyasında gençlerin karşılaştığı iktisadi, ahlaki ve dijital meseleleri fıkıh usûlü penceresinden inceliyoruz.',
    coverImage: 'https://images.unsplash.com/photo-1524178232363-1fb2b075b655?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Fıkıh, sadece teorik ahkam bütünü değil; hayatın her alanını tanzim eden canlı bir kılavuzdur. Üniversite ve lise talebelerimizle gerçekleştirdiğimiz Gençlik Derslerinde, klasik metinlerin ışığında günümüz meselelerini tahlil etmekteyiz.</p>
      <h3>Mütalaa Edilen Başlıklar</h3>
      <ul>
        <li>İbadetlerin hikmetleri ve incelikleri</li>
        <li>Sosyal medya ve dijital dünyada kul hakkı ve mahremiyet</li>
        <li>Helal kazanç, faizsiz finans ilkeleri ve tüketim ahlakı</li>
        <li>Arkadaşlık hukuku ve istikamet bilinci</li>
      </ul>
      <p>Gençlerin serbestçe soru sorabildiği, fikir teatisi yapabildiği bu meclislerimiz her cumartesi akşamı icra edilmektedir.</p>
    `,
  },
  {
    categorySlug: 'genclik-dersleri',
    title: 'Akaid Okumaları: Şüpheler Karşısında Sağlam İtikat',
    slug: 'akaid-okumalari-supheler-karsisinda-saglam-itikat',
    excerpt:
      'Ehl-i Sünnet akaidinin temel esasları, varlık, bilgi ve nübüvvet delillerinin delilleriyle tahkiki.',
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Modern çağın kafa karışıklıkları ve fikri cereyanları karşısında akideyi tahkiki bir iman ile muhafaza etmek elzemdir. Metin merkezli akaid seminerlerimizde klasik risaleler satır satır okunmaktadır.</p>
    `,
  },
  {
    categorySlug: 'haftalik-sohbetler',
    title: 'Riyâzü\'s-Sâlihîn Meclisi: Hadislerle Nebevî Hayat',
    slug: 'riyazus-salihin-meclisi-hadislerle-nebevi-hayat',
    excerpt:
      'İmam Nevevî\'nin ölümsüz eseri Riyâzü\'s-Sâlihîn\'den her hafta bir hadis-i şerifin şerhi ve hayata yansımaları.',
    coverImage: 'https://images.unsplash.com/photo-1532012164546-f432f2e3777a?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Medresemizin ana salonunda umuma açık olarak düzenlenen Haftalık Sohbetlerimizde, İmam Nevevî'nin (r.a.) telif ettiği <em>Riyâzü's-Sâlihîn</em> eseri takip edilmektedir.</p>
      <h3>Bu Haftanın Konusu: Sıdk ve İhlas</h3>
      <p>Sözde ve amelde doğruluğun imanın temeli olduğu, riyadan ve gösterişten uzak sırf rıza-i ilahi gayesiyle yapılan amellerin fazileti mütalaa edilmiştir.</p>
      <blockquote>
        "Şüphesiz doğruluk insanı iyiliğe, iyilik de cennete götürür..." (Buhârî, Edeb, 69)
      </blockquote>
      <p>Sohbetimiz ikramlar ve yapılan dua ile nihayete ermiştir. Tüm ilim talipleri davetlidir.</p>
    `,
  },
  {
    categorySlug: 'haftalik-sohbetler',
    title: 'Fatiha ve Kısa Surelerin Tefsir Sohbetleri',
    slug: 'fatiha-ve-kisa-surelerin-tefsir-sohbetleri',
    excerpt:
      'Namazlarımızda her gün kıraat ettiğimiz Fatiha ve kısa surelerin derin manaları ve tefsir incelikleri.',
    coverImage: 'https://images.unsplash.com/photo-1507842229451-7f01be8610ce?auto=format&fit=crop&w=1200&q=80',
    content: `
      <p>Her perşembe yatsı namazını müteakip gerçekleştirdiğimiz tefsir meclisimizde, Kur'an ayetlerinin nüzul sebepleri ve ulemamızın beyanları eşliğinde manevi bir yolculuk gerçekleştiriyoruz.</p>
    `,
  },
]

async function main() {
  console.log('🌱 Kategori ve Faaliyet tohum verileri işleniyor...')

  const categoryMap = new Map<string, string>()

  // 1. Kategorileri oluştur veya güncelle
  for (const catData of categoriesData) {
    const cat = await prisma.category.upsert({
      where: { slug: catData.slug },
      update: {
        name: catData.name,
        description: catData.description,
        isActive: catData.isActive,
      },
      create: {
        name: catData.name,
        slug: catData.slug,
        description: catData.description,
        isActive: catData.isActive,
      },
    })
    categoryMap.set(catData.slug, cat.id)
    console.log(`✅ Kategori hazır: ${cat.name} (${cat.slug}) -> ${cat.id}`)
  }

  // 2. Örnek yazıları oluştur veya güncelle
  for (const postData of samplePosts) {
    const categoryId = categoryMap.get(postData.categorySlug)
    if (!categoryId) continue

    const post = await prisma.post.upsert({
      where: { slug: postData.slug },
      update: {
        title: postData.title,
        excerpt: postData.excerpt,
        content: postData.content.trim(),
        coverImage: postData.coverImage,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        categoryId,
      },
      create: {
        title: postData.title,
        slug: postData.slug,
        excerpt: postData.excerpt,
        content: postData.content.trim(),
        coverImage: postData.coverImage,
        status: PostStatus.PUBLISHED,
        publishedAt: new Date(),
        categoryId,
      },
    })
    console.log(`  📄 Yazı hazır: ${post.title} (${post.slug})`)
  }

  console.log('✨ Tüm tohum verileri başarıyla yüklendi!')
}

main()
  .catch((e) => {
    console.error('❌ Tohum verisi yükleme hatası:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
