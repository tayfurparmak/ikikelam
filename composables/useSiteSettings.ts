export interface SiteSettingsState {
  organizationName: string
  description?: string | null
  phone?: string | null
  whatsapp?: string | null
  email?: string | null
  address?: string | null
  district?: string | null
  city?: string | null
  postalCode?: string | null
  googleMapsUrl?: string | null
  googleMapsEmbedUrl?: string | null
  transportationPublic?: string | null
  transportationPrivate?: string | null
  transportationNotes?: string | null
  visitDays?: string | null
  visitHours?: string | null
  youtubeUrl: string
  instagramUrl: string
  featuredYoutubeVideoId: string
  featuredYoutubeTitle: string
  featuredYoutubeDescription?: string | null
}

const DEFAULT_SETTINGS: SiteSettingsState = {
  organizationName: 'İki Kelam İlim ve Kültür Derneği',
  description: 'İlim ve irfan yolunda medrese tedrisatı ve ilmi meclisler.',
  phone: '0541 155 74 01',
  whatsapp: '+905411557401',
  email: 'bilgi@ikikelam.org.tr',
  address: 'Gürpınar, Çakabey Cd. 40/a',
  district: 'Bornova',
  city: 'İzmir',
  postalCode: '35060',
  googleMapsUrl: 'https://www.google.com/maps/place//data=!4m2!3m1!1s0x14b9659d91b2e59f:0x46bb50e2b956af15?sa=X&ved=1t:8290&ictx=111',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=G%C3%BCrp%C4%B1nar,+%C3%87akabey+Cd.+40/a,+35060+Bornova/%C4%B0zmir&t=&z=16&ie=UTF8&iwloc=&output=embed',
  transportationPublic: 'İzmir Metrosu Bornova veya Evka 3 aktarma istasyonlarından hareket eden ESHOT otobüsleri ve minibüs hatları.',
  transportationPrivate: 'Çakabey Caddesi üzerinde ve çevresinde araç park imkânı.',
  visitDays: 'Pazartesi – Cumartesi',
  visitHours: '10:00 – 20:00 (Namaz vakitleri hariç)',
  youtubeUrl: 'https://www.youtube.com/@ikikelamresmi',
  instagramUrl: 'https://instagram.com/ikikelamresmi',
  featuredYoutubeVideoId: 'CV797WTQ7b8',
  featuredYoutubeTitle: "Kur'an'da Heisenberg Belirsizlik İlkesi",
  featuredYoutubeDescription:
    'İki Kelam resmi YouTube kanalından ilim, irfan ve kainat tefekkürüne dair seçilmiş video sohbet.',
}

export function useSiteSettings() {
  const { data: res, status, refresh } = useFetch<{
    success: boolean
    data: SiteSettingsState
  }>('/api/site-settings', {
    key: 'site-settings',
    lazy: true,
  })

  const settings = computed<SiteSettingsState>(() => res.value?.data || DEFAULT_SETTINGS)
  const isLoading = computed(() => status.value === 'pending')

  return {
    settings,
    isLoading,
    refresh,
  }
}
