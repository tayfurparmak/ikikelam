// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  srcDir: '.',
  future: {
    compatibilityVersion: 3,
  },

  devtools: { enabled: true },

  modules: [
    '@nuxtjs/tailwindcss',
    '@nuxt/eslint',
  ],

  css: ['~/assets/css/main.css'],

  typescript: {
    strict: true,
  },

  tailwindcss: {
    cssPath: '~/assets/css/main.css',
    configPath: '~/tailwind.config.ts',
  },

  runtimeConfig: {
    // Private keys (Server-side only)
    databaseUrl: process.env.DATABASE_URL,
    directUrl: process.env.DIRECT_URL,
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
    supabaseStorageBucket: process.env.SUPABASE_STORAGE_BUCKET || 'gallery',
    authSecret: process.env.AUTH_SECRET || 'ikikelam-default-auth-secret-change-in-production',

    // Public keys (Exposed to client & server)
    public: {
      siteUrl: process.env.NUXT_PUBLIC_SITE_URL || 'http://localhost:3000',
      whatsappNumber: process.env.NUXT_PUBLIC_WHATSAPP_NUMBER || '+905000000000',
      googleMapsUrl: process.env.NUXT_PUBLIC_GOOGLE_MAPS_URL || 'https://maps.google.com',
    },
  },

  app: {
    head: {
      titleTemplate: (titleChunk?: string) => {
        return titleChunk && titleChunk !== 'İki Kelam'
          ? `${titleChunk} — İki Kelam`
          : 'İki Kelam — İlim, İrfan ve Medrese Geleneği'
      },
      title: 'İki Kelam — İlim, İrfan ve Medrese Geleneği',
      htmlAttrs: {
        lang: 'tr',
      },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        {
          name: 'description',
          content:
            'İki Kelam İlim ve Kültür Derneği resmi web sitesi. Kadim medrese usûlüyle fıkıh, kelam, hadis okumaları ve ilim talebeleri yetiştiren irfan yuvası.',
        },
        { name: 'theme-color', content: '#14532d' },
        // OpenGraph Base Structure
        { property: 'og:site_name', content: 'İki Kelam İlim ve Kültür Derneği' },
        { property: 'og:type', content: 'website' },
        { property: 'og:locale', content: 'tr_TR' },
        { property: 'og:title', content: 'İki Kelam — İlim, İrfan ve Medrese Geleneği' },
        {
          property: 'og:description',
          content:
            'İki Kelam İlim ve Kültür Derneği resmi web sitesi. Kadim medrese usûlüyle fıkıh, kelam, hadis okumaları ve ilim talebeleri yetiştiren irfan yuvası.',
        },
        { property: 'og:image', content: '/logo.svg' },
        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'İki Kelam — İlim, İrfan ve Medrese Geleneği' },
        {
          name: 'twitter:description',
          content:
            'İki Kelam İlim ve Kültür Derneği resmi web sitesi. Kadim medrese usûlüyle ilim ve irfan meclisi.',
        },
        { name: 'twitter:image', content: '/logo.svg' },
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/logo.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Amiri:ital,wght@0,400;0,700;1,400&family=Plus+Jakarta+Sans:wght@300;400;500;600;700&display=swap',
        },
      ],
    },
  },
})
