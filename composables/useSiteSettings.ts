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
  phone: '+90 500 000 00 00',
  whatsapp: '+90 500 000 00 00',
  email: 'bilgi@ikikelam.org.tr',
  address: 'Ali Kuşçu Mah. Medrese Sok. No: 12',
  district: 'Fatih',
  city: 'İstanbul',
  postalCode: '34083',
  googleMapsUrl: 'https://maps.google.com/?q=Fatih+Istanbul',
  googleMapsEmbedUrl: 'https://maps.google.com/maps?q=Fatih+Istanbul&output=embed',
  transportationPublic: 'M1 Emniyet-Fatih ve T1 Fındıkzade hatları.',
  transportationPrivate: 'İSPARK Fatih otoparkı.',
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
