export interface WisdomQuote {
  id: string
  type: 'HADITH' | 'AYAH' | 'WISDOM'
  typeLabel: string
  arabicText?: string
  turkishText: string
  source: string
  commentary?: string
}

export const WISDOM_QUOTES: WisdomQuote[] = [
  {
    id: 'hadith-knowledge-path',
    type: 'HADITH',
    typeLabel: 'Hadîs-i Şerîf',
    arabicText: 'مَنْ سَلَكَ طَرِيقًا يَلْتَمِسُ فِيهِ عِلْمًا سَهَّلَ اللَّهُ لَهُ بِهِ طَرِيقًا إِلَى الْجَنَّةِ',
    turkishText:
      'Kim ilim tahsil etmek için bir yola girerse, Allah Teâlâ ona cennete giden yolu kolaylaştırır.',
    source: 'Müslim, Zikir, 38; Tirmizî, İlim, 19',
    commentary:
      'Kadim medrese meclislerimizin temel rehberi; ilim yolculuğunu bir ebediyet azığı ve rıza vesilesi olarak görmektir.',
  },
  {
    id: 'ayah-elevation',
    type: 'AYAH',
    typeLabel: 'Âyet-i Kerîme',
    arabicText: 'يَرْفَعِ اللَّهُ الَّذِينَ آمَنُوا مِنكُمْ وَالَّذِينَ أُوتُوا الْعِلْمَ دَرَجَاتٍ',
    turkishText:
      'Allah, içinizden iman edenlerin ve kendilerine ilim verilenlerin derecelerini yükseltir.',
    source: 'Mücâdele Sûresi, 11. Âyet',
    commentary:
      'İlim, kalbi aydınlatan ve sahibini hem dünyada hem ahirette mertebe sahibi kılan ilahi bir nurdur.',
  },
  {
    id: 'wisdom-shafii',
    type: 'WISDOM',
    typeLabel: 'Kelâm-ı Kibâr',
    arabicText: 'لَيْسَ العِلْمُ مَا حُفِظَ، إِنَّمَا العِلْمُ مَا نَفَعَ',
    turkishText: 'İlim sadece ezberlenen şey değildir; asıl ilim, sahibine ve insanlığa fayda verendir.',
    source: 'İmâm-ı Şâfiî (Rahmetullâhi Aleyh)',
    commentary:
      'Amelle taçlanmayan, edep ve ahlak ile yoğrulmayan malumat yükten ibarettir.',
  },
]
