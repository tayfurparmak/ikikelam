import crypto from 'node:crypto'
import fs from 'node:fs'
import path from 'node:path'
import convert from 'heic-convert'
import { getSupabaseServerClient, getSupabaseStorageBucket } from '../../lib/supabase'

export const MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024 // 10 MB
export const ALLOWED_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'heif'] as const
export const ALLOWED_MIME_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
  'image/heic',
  'image/heif',
  'image/heic-sequence',
  'image/heif-sequence',
  'application/octet-stream',
] as const

export interface UploadOptions {
  buffer: Buffer
  originalFilename?: string
  clientMimeType?: string
  folder?: string
  bucket?: string
  altText?: string
}

export interface UploadResult {
  success: true
  url: string
  path: string
  filename: string
  altText?: string
  folder: string
  bucket: string
  size: number
  mimeType: string
}

export interface FormatValidationResult {
  isValid: boolean
  mimeType: string
  extension: string
  error?: string
}

/**
 * Validates the raw buffer against allowed image formats (JPEG, PNG, WEBP).
 * Inspects binary magic bytes to prevent renamed executables, SVGs, or spoofed headers.
 */
export function validateImageBuffer(
  buffer: Buffer,
  clientMime?: string,
  clientFilename?: string,
): FormatValidationResult {
  // 1. Boş dosya kontrolü
  if (!buffer || buffer.length === 0) {
    return {
      isValid: false,
      mimeType: '',
      extension: '',
      error: 'Yüklenen dosya boş olamaz.',
    }
  }

  // 2. Boyut kontrolü (Maksimum 10 MB)
  if (buffer.length > MAX_FILE_SIZE_BYTES) {
    return {
      isValid: false,
      mimeType: '',
      extension: '',
      error: 'Dosya boyutu 10 MB sınırını aşamaz.',
    }
  }

  // 3. İstemci dosya uzantısı kontrolü (varsa)
  if (clientFilename) {
    const parts = clientFilename.toLowerCase().split('.')
    const ext = parts.length > 1 ? parts[parts.length - 1] : ''

    // Açıkça reddedilen uzantılar (SVG, betikler, çalıştırılabilirler)
    if (ext === 'svg' || ext === 'exe' || ext === 'sh' || ext === 'php' || ext === 'html' || ext === 'js') {
      return {
        isValid: false,
        mimeType: '',
        extension: '',
        error: `".${ext}" formatı güvenlik sebebiyle kabul edilmemektedir. Sadece JPG, PNG, WEBP ve HEIC yükleyebilirsiniz.`,
      }
    }

    if (ext && !ALLOWED_EXTENSIONS.includes(ext as (typeof ALLOWED_EXTENSIONS)[number])) {
      return {
        isValid: false,
        mimeType: '',
        extension: '',
        error: `Geçersiz dosya uzantısı: .${ext}. İzin verilen formatlar: JPG, PNG, WEBP, HEIC.`,
      }
    }
  }

  // 4. İstemci MIME kontrolü (varsa)
  if (clientMime && !ALLOWED_MIME_TYPES.includes(clientMime as (typeof ALLOWED_MIME_TYPES)[number])) {
    return {
      isValid: false,
      mimeType: '',
      extension: '',
      error: `Geçersiz dosya tipi (${clientMime}). Yalnızca JPEG, PNG, WEBP veya HEIC formatı kabul edilir.`,
    }
  }

  // 5. Binary Magic Bytes (Dosya Başlığı İmzası) Kontrolü
  // JPEG: FF D8 FF
  if (buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff) {
    return {
      isValid: true,
      mimeType: 'image/jpeg',
      extension: 'jpg',
    }
  }

  // PNG: 89 50 4E 47 0D 0A 1A 0A
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47 &&
    buffer[4] === 0x0d &&
    buffer[5] === 0x0a &&
    buffer[6] === 0x1a &&
    buffer[7] === 0x0a
  ) {
    return {
      isValid: true,
      mimeType: 'image/png',
      extension: 'png',
    }
  }

  // WEBP: "RIFF" .... "WEBP"
  if (
    buffer.length >= 12 &&
    buffer.subarray(0, 4).toString('ascii') === 'RIFF' &&
    buffer.subarray(8, 12).toString('ascii') === 'WEBP'
  ) {
    return {
      isValid: true,
      mimeType: 'image/webp',
      extension: 'webp',
    }
  }

  // HEIC / HEIF: Box 'ftyp' at offset 4
  if (
    buffer.length >= 12 &&
    buffer.subarray(4, 8).toString('ascii') === 'ftyp'
  ) {
    const brand = buffer.subarray(8, 12).toString('ascii').toLowerCase()
    const headerSnippet = buffer.subarray(8, 36).toString('ascii').toLowerCase()
    const isHeic =
      ['heic', 'heix', 'hevc', 'hevx', 'mif1', 'msf1'].includes(brand) ||
      headerSnippet.includes('heic') ||
      headerSnippet.includes('mif1') ||
      clientFilename?.toLowerCase().endsWith('.heic') ||
      clientFilename?.toLowerCase().endsWith('.heif')

    if (isHeic) {
      return {
        isValid: true,
        mimeType: 'image/heic',
        extension: 'heic',
      }
    }
  }

  // Ekstra HEIC uzantı kontrolü (Eğer ftyp kutusu farklı bir offsette veya varyantta ise)
  if (clientFilename && (clientFilename.toLowerCase().endsWith('.heic') || clientFilename.toLowerCase().endsWith('.heif'))) {
    if (buffer.length >= 12 && (buffer.includes('ftyp') || buffer.includes('heic') || buffer.includes('mif1'))) {
      return {
        isValid: true,
        mimeType: 'image/heic',
        extension: 'heic',
      }
    }
  }

  // Güvenlik: SVG veya HTML/Script içeriği tespiti
  const initialSnippet = buffer.subarray(0, 200).toString('utf8').toLowerCase()
  if (initialSnippet.includes('<svg') || initialSnippet.includes('<?xml') || initialSnippet.includes('<html')) {
    return {
      isValid: false,
      mimeType: '',
      extension: '',
      error: 'Vektörel (SVG) ve betik dosyaları güvenlik sebebiyle yüklenemez.',
    }
  }

  return {
    isValid: false,
    mimeType: '',
    extension: '',
    error: 'Desteklenmeyen veya geçersiz dosya içeriği. Yalnızca gerçek JPG, PNG, WEBP veya HEIC formatı kabul edilir.',
  }
}

/**
 * Sanitizes the folder name to prevent path traversal or invalid characters.
 */
export function sanitizeFolderName(folder?: string): string {
  if (!folder) return 'gallery'
  const sanitized = folder
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9_-]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')

  return sanitized || 'gallery'
}

/**
 * Generates a collision-resistant unique filename and hierarchical date-based path.
 * Format: {folder}/{year}/{month}/{uuid}-{timestamp}.{ext}
 */
export function generateStoragePath(folder: string, extension: string): {
  storagePath: string
  uniqueFilename: string
} {
  const cleanFolder = sanitizeFolderName(folder)
  const now = new Date()
  const year = now.getFullYear().toString()
  const month = String(now.getMonth() + 1).padStart(2, '0')

  const uniqueId = crypto.randomUUID()
  const timestamp = Date.now()
  const uniqueFilename = `${uniqueId}-${timestamp}.${extension}`
  const storagePath = `${cleanFolder}/${year}/${month}/${uniqueFilename}`

  return {
    storagePath,
    uniqueFilename,
  }
}

/**
 * Uploads a validated image buffer to Supabase Storage via Service Role Client.
 */
export async function uploadToSupabaseStorage(options: UploadOptions): Promise<UploadResult> {
  const { buffer, originalFilename, clientMimeType, folder, altText } = options
  const targetBucket = options.bucket || getSupabaseStorageBucket()

  // 1. Doğrulama
  const validation = validateImageBuffer(buffer, clientMimeType, originalFilename)
  if (!validation.isValid) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: validation.error || 'Dosya doğrulaması başarısız oldu.',
    })
  }

  // 1.1 HEIC / HEIF formatını web uyumlu yüksek kaliteli JPEG'e dönüştür
  let processedBuffer = buffer
  let processedMimeType = validation.mimeType
  let processedExtension = validation.extension

  if (validation.extension === 'heic' || validation.extension === 'heif') {
    try {
      const converted = await convert({
        buffer,
        format: 'JPEG',
        quality: 0.92,
      })
      processedBuffer = Buffer.from(converted)
      processedMimeType = 'image/jpeg'
      processedExtension = 'jpg'
    } catch (conversionErr) {
      console.error('[HEIC Conversion Error]:', conversionErr)
      throw createError({
        statusCode: 422,
        statusMessage: 'Unprocessable Entity',
        message: 'HEIC formatındaki görsel JPEG formatına dönüştürülürken bir hata oluştu.',
      })
    }
  }

  // 2. Yol ve dosya adı üretimi
  const cleanFolder = sanitizeFolderName(folder)
  const { storagePath, uniqueFilename } = generateStoragePath(cleanFolder, processedExtension)

  // 3. Supabase Storage Yükleme Denemesi (varsa)
  let uploadUrl: string | null = null
  let useLocalFallback = false

  try {
    const config = useRuntimeConfig()
    const serviceKey = config.supabaseServiceRoleKey || process.env.SUPABASE_SERVICE_ROLE_KEY || ''
    
    // Eğer service role key henüz girilmemişse veya placeholder ise doğrudan yerel depolamaya yönlendir
    if (!serviceKey || serviceKey.startsWith('placeholder') || serviceKey.startsWith('your-')) {
      useLocalFallback = true
    } else {
      const supabase = getSupabaseServerClient()
      let uploadResponse = await supabase.storage.from(targetBucket).upload(storagePath, processedBuffer, {
        contentType: processedMimeType,
        upsert: false,
      })

      // Eğer kova (bucket) henüz mevcut değilse oluşturup tekrar dene
      if (uploadResponse.error && uploadResponse.error.message.toLowerCase().includes('bucket not found')) {
        try {
          await supabase.storage.createBucket(targetBucket, { public: true })
          uploadResponse = await supabase.storage.from(targetBucket).upload(storagePath, processedBuffer, {
            contentType: processedMimeType,
            upsert: false,
          })
        } catch {
          // ignore
        }
      }

      if (uploadResponse.error) {
        console.warn(`[Supabase Storage] Buluta yükleme yapılamadı (${uploadResponse.error.message}), yerel depolama yedeğine aktarılıyor...`)
        useLocalFallback = true
      } else {
        const { data: publicUrlData } = supabase.storage.from(targetBucket).getPublicUrl(storagePath)
        uploadUrl = publicUrlData.publicUrl
      }
    }
  } catch (err) {
    console.warn('[Supabase Storage] İstemci hatası veya ağ erişim sorunu, yerel depolama yedeğine aktarılıyor:', err)
    useLocalFallback = true
  }

  // 4. Yerel Depolama Yedeği (public/uploads/{storagePath})
  if (useLocalFallback || !uploadUrl) {
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads')
    const targetFilePath = path.join(uploadsDir, storagePath)
    fs.mkdirSync(path.dirname(targetFilePath), { recursive: true })
    fs.writeFileSync(targetFilePath, processedBuffer)
    uploadUrl = `/uploads/${storagePath}`
  }

  return {
    success: true,
    url: uploadUrl,
    path: storagePath,
    filename: uniqueFilename,
    altText: altText || originalFilename || '',
    folder: cleanFolder,
    bucket: targetBucket,
    size: processedBuffer.length,
    mimeType: processedMimeType,
  }
}

/**
 * Extracts relative storage path from a Supabase public URL or validates relative path.
 * Returns null if the URL belongs to an external service or is empty.
 */
export function extractStoragePath(urlOrPath?: string | null, bucket?: string): string | null {
  if (!urlOrPath || typeof urlOrPath !== 'string') return null
  const targetBucket = bucket || getSupabaseStorageBucket()
  const trimmed = urlOrPath.trim()
  if (!trimmed) return null

  // Yerel depolama URL kontrolü (/uploads/...)
  if (trimmed.startsWith('/uploads/')) {
    return trimmed.slice('/uploads/'.length)
  }

  if (trimmed.startsWith('http://') || trimmed.startsWith('https://')) {
    if (trimmed.includes('/uploads/')) {
      const parts = trimmed.split('/uploads/')
      return parts[1] || null
    }

    const marker = `/storage/v1/object/public/${targetBucket}/`
    const idx = trimmed.indexOf(marker)
    if (idx !== -1) {
      return decodeURIComponent(trimmed.slice(idx + marker.length))
    }
    // External URL or different bucket
    return null
  }

  // Already a relative storage path
  return trimmed
}

/**
 * Safely removes a file from Supabase Storage by its path or public URL.
 */
export async function deleteFromSupabaseStorage(pathOrUrl?: string | null, bucket?: string): Promise<boolean> {
  const storagePath = extractStoragePath(pathOrUrl, bucket)
  if (!storagePath) return false
  const targetBucket = bucket || getSupabaseStorageBucket()

  let localRemoved = false
  try {
    const uploadsDir = path.resolve(process.cwd(), 'public', 'uploads')
    const localFilePath = path.join(uploadsDir, storagePath)
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath)
      localRemoved = true
    }
  } catch (err) {
    console.warn('[Local Storage] Yerel dosya silinemedi:', err)
  }

  try {
    const supabase = getSupabaseServerClient()
    const { error } = await supabase.storage.from(targetBucket).remove([storagePath])
    if (error) {
      return localRemoved
    }
    return true
  } catch {
    return localRemoved
  }
}
