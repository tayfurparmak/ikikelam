<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted, nextTick } from 'vue'
import { X, ChevronLeft, ChevronRight, ZoomIn } from 'lucide-vue-next'

export interface GalleryItem {
  id: string
  title: string
  imageUrl: string
  storagePath?: string | null
  category: string
  altText?: string | null
  createdAt?: string | Date
}

const props = defineProps<{
  modelValue: boolean
  images: GalleryItem[]
  initialIndex?: number
  categoryLabels?: Record<string, string>
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'close'): void
}>()

const currentIndex = ref(props.initialIndex || 0)
const closeButtonRef = ref<HTMLButtonElement | null>(null)
let previousActiveElement: HTMLElement | null = null

// Sync initialIndex
watch(
  () => props.initialIndex,
  (newIdx) => {
    if (typeof newIdx === 'number' && newIdx >= 0 && newIdx < props.images.length) {
      currentIndex.value = newIdx
    }
  }
)

const currentImage = computed<GalleryItem | undefined>(() => props.images[currentIndex.value])

const canPrev = computed(() => props.images.length > 1)
const canNext = computed(() => props.images.length > 1)

function prevImage() {
  if (props.images.length <= 1) return
  currentIndex.value = (currentIndex.value - 1 + props.images.length) % props.images.length
}

function nextImage() {
  if (props.images.length <= 1) return
  currentIndex.value = (currentIndex.value + 1) % props.images.length
}

function closeModal() {
  emit('update:modelValue', false)
  emit('close')
}

// Body Scroll Lock & Focus Management
watch(
  () => props.modelValue,
  (isOpen) => {
    if (import.meta.client) {
      if (isOpen) {
        previousActiveElement = document.activeElement as HTMLElement | null
        document.body.style.overflow = 'hidden'
        nextTick(() => {
          closeButtonRef.value?.focus()
        })
      } else {
        document.body.style.overflow = ''
        if (previousActiveElement && typeof previousActiveElement.focus === 'function') {
          previousActiveElement.focus()
        }
      }
    }
  }
)

// Keyboard Navigation
function handleKeyDown(e: KeyboardEvent) {
  if (!props.modelValue) return

  switch (e.key) {
    case 'Escape':
      e.preventDefault()
      closeModal()
      break
    case 'ArrowLeft':
      e.preventDefault()
      prevImage()
      break
    case 'ArrowRight':
      e.preventDefault()
      nextImage()
      break
  }
}

// Mobile Touch / Swipe Management
let touchStartX = 0
let touchStartY = 0

function handleTouchStart(e: TouchEvent) {
  if (e.touches.length === 1) {
    touchStartX = e.touches[0].clientX
    touchStartY = e.touches[0].clientY
  }
}

function handleTouchEnd(e: TouchEvent) {
  if (e.changedTouches.length === 1) {
    const deltaX = e.changedTouches[0].clientX - touchStartX
    const deltaY = e.changedTouches[0].clientY - touchStartY

    // Ensure horizontal swipe is more pronounced than vertical scrolling
    if (Math.abs(deltaX) > 40 && Math.abs(deltaX) > Math.abs(deltaY) * 1.5) {
      if (deltaX > 0) {
        prevImage() // swiped right -> show previous
      } else {
        nextImage() // swiped left -> show next
      }
    }
  }
}

onMounted(() => {
  if (import.meta.client) {
    window.addEventListener('keydown', handleKeyDown)
  }
})

onUnmounted(() => {
  if (import.meta.client) {
    window.removeEventListener('keydown', handleKeyDown)
    document.body.style.overflow = ''
  }
})

function getCategoryName(categoryKey?: string) {
  if (!categoryKey) return ''
  if (props.categoryLabels && props.categoryLabels[categoryKey]) {
    return props.categoryLabels[categoryKey]
  }
  return categoryKey
}
</script>

<template>
  <Teleport to="body">
    <Transition
      enter-active-class="transition duration-200 ease-out"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition duration-150 ease-in"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="modelValue && currentImage"
        class="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-navy-950/95 backdrop-blur-md select-none"
        role="dialog"
        aria-modal="true"
        :aria-label="`Görsel İnceleme: ${currentImage.title}`"
        @click.self="closeModal"
        @touchstart="handleTouchStart"
        @touchend="handleTouchEnd"
      >
        <!-- Top Toolbar -->
        <div class="absolute top-4 inset-x-4 sm:inset-x-8 flex items-center justify-between text-white z-20 pointer-events-none">
          <!-- Counter Badge & Category -->
          <div class="pointer-events-auto flex items-center gap-3">
            <span class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-emerald-300 border border-white/15 backdrop-blur-sm">
              <ZoomIn class="w-3.5 h-3.5" />
              <span>{{ currentIndex + 1 }} / {{ images.length }}</span>
            </span>

            <span
              v-if="currentImage.category"
              class="hidden sm:inline-flex px-3 py-1 rounded-full text-xs font-medium bg-emerald-950/70 text-emerald-200 border border-emerald-800/50"
            >
              {{ getCategoryName(currentImage.category) }}
            </span>
          </div>

          <!-- Close Button -->
          <button
            ref="closeButtonRef"
            type="button"
            class="pointer-events-auto p-2.5 rounded-full bg-white/10 hover:bg-white/20 text-white border border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400"
            aria-label="Kapat (ESC)"
            @click="closeModal"
          >
            <X class="w-5 h-5" />
          </button>
        </div>

        <!-- Previous Button -->
        <button
          v-if="canPrev"
          type="button"
          class="absolute left-2 sm:left-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 z-20"
          aria-label="Önceki Görsel (Sol Ok)"
          @click.stop="prevImage"
        >
          <ChevronLeft class="w-6 h-6" />
        </button>

        <!-- Main Image Container -->
        <div class="relative max-w-5xl max-h-[82vh] w-full flex flex-col items-center justify-center p-2 z-10">
          <img
            :key="currentImage.id"
            :src="currentImage.imageUrl"
            :alt="currentImage.altText || currentImage.title"
            class="max-w-full max-h-[72vh] object-contain rounded-2xl shadow-2xl border border-white/10 transition-all duration-300 select-none animate-in fade-in zoom-in-95"
            draggable="false"
          >

          <!-- Caption -->
          <div class="mt-4 text-center max-w-2xl px-4">
            <h3 class="font-serif text-base sm:text-lg font-bold text-white tracking-wide drop-shadow-sm">
              {{ currentImage.title }}
            </h3>
            <p v-if="currentImage.altText && currentImage.altText !== currentImage.title" class="text-xs sm:text-sm text-slate-300 font-light mt-1">
              {{ currentImage.altText }}
            </p>
          </div>
        </div>

        <!-- Next Button -->
        <button
          v-if="canNext"
          type="button"
          class="absolute right-2 sm:right-6 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/10 hover:bg-white/25 text-white border border-white/20 transition-all focus:outline-none focus:ring-2 focus:ring-emerald-400 z-20"
          aria-label="Sonraki Görsel (Sağ Ok)"
          @click.stop="nextImage"
        >
          <ChevronRight class="w-6 h-6" />
        </button>

        <!-- Bottom Keyboard/Swipe Hint (Mobile & Desktop) -->
        <div class="absolute bottom-3 inset-x-0 text-center pointer-events-none">
          <p class="text-[11px] text-slate-400/80 font-light">
            <span class="hidden sm:inline">Klavye ok tuşları veya ESC ile kontrol edebilirsiniz.</span>
            <span class="sm:hidden">Görseller arasında geçiş için sağa/sola kaydırın.</span>
          </p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>
