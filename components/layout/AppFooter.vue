<script setup lang="ts">
import { Mail, Phone, MapPin } from 'lucide-vue-next'
import AppLogo from '~/components/common/AppLogo.vue'

const config = useRuntimeConfig()
const whatsappNumber = config.public.whatsappNumber
const mapsUrl = config.public.googleMapsUrl
</script>

<template>
  <footer class="bg-navy-950 text-slate-300 pt-16 pb-12 border-t border-navy-800">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
        <div class="space-y-4 md:col-span-2">
          <NuxtLink to="/" class="inline-block">
            <AppLogo size="lg" variant="dark" />
          </NuxtLink>
          <p class="text-sm text-slate-400 max-w-md leading-relaxed font-light mt-3">
            Gelenekten geleceğe köprü kuran ilim ve irfan meclisi. İlim talebelerine destek ve toplumun manevi inşası için gayret gösteren bir vakıf kültürü.
          </p>
        </div>

        <div>
          <h3 class="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center space-x-2">
            <span class="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
            <span>Hızlı Bağlantılar</span>
          </h3>
          <ul class="space-y-2 text-sm text-slate-400">
            <li><NuxtLink to="/about" class="hover:text-gold-400 transition">Hakkımızda</NuxtLink></li>
            <li><NuxtLink to="/activities" class="hover:text-gold-400 transition">Faaliyetlerimiz</NuxtLink></li>
            <li><NuxtLink to="/schedule" class="hover:text-gold-400 transition">Ders Programı</NuxtLink></li>
            <li><NuxtLink to="/gallery" class="hover:text-gold-400 transition">Fotoğraf Galerisi</NuxtLink></li>
            <li><NuxtLink to="/donation" class="hover:text-gold-400 transition">Bağış ve Destek</NuxtLink></li>
          </ul>
        </div>

        <div>
          <h3 class="text-white font-semibold text-sm tracking-wider uppercase mb-4 flex items-center space-x-2">
            <span class="w-1.5 h-1.5 rounded-full bg-gold-500"></span>
            <span>İletişim</span>
          </h3>
          <ul class="space-y-3 text-sm text-slate-400">
            <li class="flex items-center space-x-2">
              <Phone :size="16" class="text-gold-400 shrink-0" />
              <span>{{ whatsappNumber || '+90 500 000 00 00' }}</span>
            </li>
            <li class="flex items-center space-x-2">
              <Mail :size="16" class="text-gold-400 shrink-0" />
              <span>iletisim@ikikelam.org.tr</span>
            </li>
            <li class="flex items-center space-x-2">
              <MapPin :size="16" class="text-gold-400 shrink-0" />
              <a :href="mapsUrl || '#'" target="_blank" rel="noopener noreferrer" class="hover:text-gold-400 transition">
                Haritada Görüntüle
              </a>
            </li>
          </ul>
        </div>
      </div>

      <div class="border-t border-navy-800/80 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
        <p>&copy; {{ new Date().getFullYear() }} İki Kelam İlim ve Kültür Derneği. Tüm hakları saklıdır.</p>
        <p class="mt-2 sm:mt-0 font-light flex items-center space-x-2">
          <span>İlim ve Amel Birlikteliğiyle</span>
          <span class="w-1.5 h-1.5 rounded-full bg-gold-500/80"></span>
        </p>
      </div>
    </div>
  </footer>
</template>
