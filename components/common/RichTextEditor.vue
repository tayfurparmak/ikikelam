<script setup lang="ts">
import { ref, watch, onMounted } from 'vue'
import {
  Bold,
  Italic,
  Heading2,
  Heading3,
  Pilcrow,
  List,
  ListOrdered,
  Link as LinkIcon,
  Quote,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Image as ImageIcon,
  RemoveFormatting,
  Code,
} from 'lucide-vue-next'

const props = withDefaults(
  defineProps<{
    modelValue?: string | null
    placeholder?: string
    minHeight?: string
  }>(),
  {
    modelValue: '',
    placeholder: 'İçeriğinizi buraya yazın veya düzenleyin...',
    minHeight: '220px',
  }
)

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const editorRef = ref<HTMLDivElement | null>(null)
const isCodeView = ref(false)
const rawHtml = ref(props.modelValue || '')

// Sync from external modelValue
watch(
  () => props.modelValue,
  (newVal) => {
    const val = newVal || ''
    rawHtml.value = val
    if (editorRef.value && editorRef.value.innerHTML !== val) {
      editorRef.value.innerHTML = val
    }
  }
)

function onInput() {
  if (editorRef.value) {
    const html = editorRef.value.innerHTML
    rawHtml.value = html
    emit('update:modelValue', html)
  }
}

function onRawHtmlChange() {
  emit('update:modelValue', rawHtml.value)
  if (editorRef.value) {
    editorRef.value.innerHTML = rawHtml.value
  }
}

function exec(command: string, value: string | undefined = undefined) {
  if (isCodeView.value) return
  if (typeof document !== 'undefined') {
    document.execCommand(command, false, value)
    onInput()
  }
}

function insertHeading(level: 'h2' | 'h3' | 'p') {
  exec('formatBlock', `<${level}>`)
}

function insertLink() {
  const url = prompt('Bağlantı adresi (URL) girin:', 'https://')
  if (url && url !== 'https://') {
    exec('createLink', url)
  }
}

function insertImage() {
  const url = prompt('Görsel URL adresi girin:', 'https://')
  if (url && url !== 'https://') {
    exec('insertImage', url)
  }
}

function clearFormatting() {
  exec('removeFormat')
  exec('formatBlock', '<p>')
}

onMounted(() => {
  if (editorRef.value) {
    editorRef.value.innerHTML = props.modelValue || ''
  }
})
</script>

<template>
  <div class="rounded-2xl border border-slate-200 overflow-hidden bg-white shadow-xs focus-within:ring-2 focus-within:ring-emerald-700/50 transition-all">
    <!-- Toolbar -->
    <div class="p-2 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center gap-1 text-slate-700 select-none">
      <!-- Text Style -->
      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="Kalın (Bold)"
        @click="exec('bold')"
      >
        <Bold class="w-4 h-4" />
      </button>

      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="İtalik"
        @click="exec('italic')"
      >
        <Italic class="w-4 h-4" />
      </button>

      <div class="w-px h-5 bg-slate-300 mx-1" />

      <!-- Headings -->
      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="Başlık 2 (H2)"
        @click="insertHeading('h2')"
      >
        <Heading2 class="w-4 h-4" />
      </button>

      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="Başlık 3 (H3)"
        @click="insertHeading('h3')"
      >
        <Heading3 class="w-4 h-4" />
      </button>

      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="Paragraf (P)"
        @click="insertHeading('p')"
      >
        <Pilcrow class="w-4 h-4" />
      </button>

      <div class="w-px h-5 bg-slate-300 mx-1" />

      <!-- Lists -->
      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="Madde İşaretli Liste"
        @click="exec('insertUnorderedList')"
      >
        <List class="w-4 h-4" />
      </button>

      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="Numaralı Liste"
        @click="exec('insertOrderedList')"
      >
        <ListOrdered class="w-4 h-4" />
      </button>

      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="Alıntı (Quote)"
        @click="insertHeading('blockquote')"
      >
        <Quote class="w-4 h-4" />
      </button>

      <div class="w-px h-5 bg-slate-300 mx-1" />

      <!-- Alignment -->
      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="Sola Hizala"
        @click="exec('justifyLeft')"
      >
        <AlignLeft class="w-4 h-4" />
      </button>

      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="Ortala"
        @click="exec('justifyCenter')"
      >
        <AlignCenter class="w-4 h-4" />
      </button>

      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="Sağa Hizala"
        @click="exec('justifyRight')"
      >
        <AlignRight class="w-4 h-4" />
      </button>

      <div class="w-px h-5 bg-slate-300 mx-1" />

      <!-- Media & Link -->
      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="Bağlantı Ekle"
        @click="insertLink"
      >
        <LinkIcon class="w-4 h-4" />
      </button>

      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-navy-950 transition-colors"
        title="Görsel Ekle"
        @click="insertImage"
      >
        <ImageIcon class="w-4 h-4" />
      </button>

      <button
        type="button"
        class="p-1.5 rounded-lg hover:bg-slate-200 hover:text-red-700 transition-colors"
        title="Biçimlendirmeyi Temizle"
        @click="clearFormatting"
      >
        <RemoveFormatting class="w-4 h-4" />
      </button>

      <!-- Toggle HTML Source -->
      <div class="ml-auto">
        <button
          type="button"
          class="px-2 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors"
          :class="isCodeView ? 'bg-navy-950 text-white' : 'text-slate-600 hover:bg-slate-200'"
          title="HTML Kaynağı"
          @click="isCodeView = !isCodeView"
        >
          <Code class="w-3.5 h-3.5" />
          <span>{{ isCodeView ? 'Görsel Editör' : 'HTML' }}</span>
        </button>
      </div>
    </div>

    <!-- Editable Canvas Area -->
    <div
      v-show="!isCodeView"
      ref="editorRef"
      contenteditable="true"
      class="prose prose-sm sm:prose max-w-none p-4 text-slate-800 focus:outline-none overflow-y-auto leading-relaxed"
      :style="{ minHeight: minHeight }"
      :data-placeholder="placeholder"
      @input="onInput"
    />

    <!-- Code View Area -->
    <textarea
      v-show="isCodeView"
      v-model="rawHtml"
      rows="10"
      class="w-full p-4 font-mono text-xs text-slate-800 focus:outline-none bg-slate-900 text-emerald-300 resize-y leading-relaxed"
      :style="{ minHeight: minHeight }"
      @input="onRawHtmlChange"
    />
  </div>
</template>

<style scoped>
[contenteditable]:empty:before {
  content: attr(data-placeholder);
  color: #94a3b8;
  cursor: text;
}
</style>
