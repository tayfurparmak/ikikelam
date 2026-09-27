import {
  MAX_FILE_SIZE_BYTES,
  uploadToSupabaseStorage,
} from '~/server/utils/storage'
import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  // 0. Server-side Authentication Guard
  await requireAdminSession(event)

  // 1. Content-Type doğrulaması
  const contentType = getHeader(event, 'content-type') || ''
  if (!contentType.includes('multipart/form-data')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'İstek "multipart/form-data" formatında olmalıdır.',
    })
  }

  // 2. Multipart form verilerini ayrıştırma
  const formData = await readMultipartFormData(event)
  if (!formData || formData.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Form verisi veya dosya bulunamadı.',
    })
  }

  // 3. Form alanlarını ayıklama
  let fileData: { buffer: Buffer; filename?: string; type?: string } | null = null
  let folder = 'gallery'
  let altText = ''

  for (const field of formData) {
    if (field.name === 'file' && field.data) {
      fileData = {
        buffer: field.data,
        filename: field.filename,
        type: field.type,
      }
    } else if (field.name === 'folder' && field.data) {
      folder = field.data.toString('utf-8').trim()
    } else if (field.name === 'altText' && field.data) {
      altText = field.data.toString('utf-8').trim()
    }
  }

  // 4. Dosya varlık kontrolü
  if (!fileData || !fileData.buffer || fileData.buffer.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'Yüklenmek üzere herhangi bir dosya ("file") seçilmedi.',
    })
  }

  // 5. Boyut kontrolü (413 Payload Too Large)
  if (fileData.buffer.length > MAX_FILE_SIZE_BYTES) {
    throw createError({
      statusCode: 413,
      statusMessage: 'Payload Too Large',
      message: 'Dosya boyutu maksimum 10 MB sınırını aşamaz.',
    })
  }

  // 6. Supabase Storage Yükleme (Doğrulama, Magic Bytes, Benzersiz İsim ve Yol)
  try {
    const result = await uploadToSupabaseStorage({
      buffer: fileData.buffer,
      originalFilename: fileData.filename,
      clientMimeType: fileData.type,
      folder,
      altText,
    })

    return {
      success: true,
      url: result.url,
      path: result.path,
      filename: result.filename,
      altText: result.altText,
      folder: result.folder,
      size: result.size,
      mimeType: result.mimeType,
    }
  } catch (err: unknown) {
    // createError ile fırlatılan bilinen hataları olduğu gibi ilet
    if (typeof err === 'object' && err !== null && 'statusCode' in err) {
      throw err
    }

    const message = err instanceof Error ? err.message : 'Bilinmeyen bir hata oluştu.'
    console.error('[Upload Endpoint Error]:', err)

    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      message: `Dosya yükleme işlemi başarısız: ${message}`,
    })
  }
})
