<script setup lang="ts">
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl'
  showText?: boolean
  showSubtitle?: boolean
  variant?: 'dark' | 'light' | 'auto'
}

withDefaults(defineProps<Props>(), {
  size: 'md',
  showText: true,
  showSubtitle: true,
  variant: 'auto',
})
</script>

<template>
  <div
    class="inline-flex items-center space-x-3 select-none"
    :class="[
      variant === 'dark' ? 'text-white' : variant === 'light' ? 'text-navy-950' : 'text-navy-950 dark:text-white',
    ]"
  >
    <!-- Logo Emblem (Emblem Circle + Lam-Alif Calligraphy) -->
    <div
      class="shrink-0 relative flex items-center justify-center rounded-full shadow-sm"
      :class="[
        size === 'sm' && 'w-8 h-8',
        size === 'md' && 'w-11 h-11',
        size === 'lg' && 'w-16 h-16',
        size === 'xl' && 'w-24 h-24',
      ]"
    >
      <svg
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        class="w-full h-full drop-shadow-sm"
      >
        <!-- Golden Amber Circle Background -->
        <circle cx="250" cy="250" r="240" fill="#EBA83A" />

        <!-- Lam-Alif Calligraphy Group -->
        <g fill="#12141A">
          <!-- Right Stroke (Alif / Upright stem with Thuluth serif header and base hook) -->
          <path
            d="M325 142
               C335 152 355 165 358 175
               C353 186 340 200 338 215
               C333 245 333 285 333 325
               C333 345 335 365 342 385
               C345 394 340 405 328 406
               C313 408 304 397 302 380
               C300 365 304 340 307 312
               C308 280 308 240 310 200
               C310 178 307 165 325 142 Z"
          />

          <!-- Left Diagonal Stroke & Crossed Base (Lam branch crossing to base) -->
          <path
            d="M135 160
               C145 150 175 168 185 185
               C188 198 178 208 165 210
               C150 213 140 205 133 195
               C125 185 125 170 135 160 Z"
          />

          <!-- Main sweeping diagonal and interlocking base -->
          <path
            d="M165 195
               C190 220 225 255 255 288
               C275 310 295 332 312 355
               C320 366 322 380 310 392
               C295 405 270 405 240 405
               L145 405
               C135 405 130 398 135 390
               C145 375 180 355 215 335
               C245 318 268 295 280 272
               C255 250 220 220 185 188
               C165 170 150 180 165 195 Z"
          />

          <!-- Base connector / triangle interior loop of Lam-Alif -->
          <path
            d="M245 390
               L310 390
               C318 390 322 380 315 372
               C305 360 292 345 280 330
               C270 348 258 370 245 390 Z"
          />
        </g>
      </svg>
    </div>

    <!-- Typography (iki Kelam + Subtitle) -->
    <div v-if="showText" class="flex flex-col justify-center">
      <div class="relative">
        <span
          class="font-black tracking-tight leading-none flex items-center font-sans"
          :class="[
            size === 'sm' && 'text-lg',
            size === 'md' && 'text-2xl',
            size === 'lg' && 'text-3xl',
            size === 'xl' && 'text-4xl',
          ]"
        >
          <span class="mr-1.5 font-bold">iki</span>
          <span class="font-extrabold relative">
            Kelam
            <!-- Yellow accent curve line matching the logo -->
            <svg
              viewBox="0 0 100 12"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              class="absolute -bottom-1 left-0 w-full h-1 text-[#EBA83A]"
            >
              <path
                d="M2 6C30 11 70 11 98 4"
                stroke="currentColor"
                stroke-width="3"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </span>
      </div>

      <span
        v-if="showSubtitle"
        class="text-[11px] font-medium tracking-wide mt-1.5 opacity-80"
        :class="[
          size === 'sm' && 'text-[9px] mt-0.5',
          size === 'lg' && 'text-xs',
        ]"
      >
        İlim ve Kültür Derneği
      </span>
    </div>
  </div>
</template>
