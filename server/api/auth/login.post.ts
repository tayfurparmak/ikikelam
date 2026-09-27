import prisma from '~/lib/prisma'
import {
  verifyPassword,
  createAuthToken,
  setAdminSessionCookie,
  checkLoginRateLimit,
  recordFailedLogin,
  resetLoginRateLimit,
} from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody<{ email?: string; password?: string }>(event).catch(() => ({}))
  const email = body?.email?.trim().toLowerCase()
  const password = body?.password

  if (!email || !password) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Bad Request',
      message: 'E-posta adresi ve şifre zorunludur.',
    })
  }

  // 1. Rate Limiting / Brute-force Koruması
  const clientIp = getRequestIP(event, { xForwardedFor: true }) || 'unknown-ip'
  const rateLimitKey = `${clientIp}:${email}`
  const rateLimitStatus = checkLoginRateLimit(rateLimitKey)

  if (rateLimitStatus.isLimited) {
    throw createError({
      statusCode: 429,
      statusMessage: 'Too Many Requests',
      message: `Çok fazla başarısız giriş denemesi yapıldı. Lütfen ${rateLimitStatus.remainingSeconds} saniye sonra tekrar deneyiniz.`,
    })
  }

  // 2. Veritabanından Kullanıcıyı Bulma
  const user = await prisma.adminUser
    .findUnique({
      where: { email },
    })
    .catch((dbError) => {
      console.error('[Auth Database Error]:', dbError)
      throw createError({
        statusCode: 500,
        statusMessage: 'Internal Server Error',
        message: 'Veritabanı bağlantısı sırasında bir hata oluştu.',
      })
    })

  // Kullanıcı yoksa veya şifre eşleşmiyorsa
  if (!user) {
    const { remainingAttempts } = recordFailedLogin(rateLimitKey)
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: `Geçersiz e-posta veya şifre. Kalan deneme hakkı: ${remainingAttempts}`,
    })
  }

  // 3. Şifre Doğrulama (bcrypt)
  const isPasswordValid = await verifyPassword(password, user.passwordHash)
  if (!isPasswordValid) {
    const { locked, remainingAttempts } = recordFailedLogin(rateLimitKey)
    if (locked) {
      throw createError({
        statusCode: 429,
        statusMessage: 'Too Many Requests',
        message: 'Maksimum başarısız deneme sayısına ulaşıldı. Hesabınız 15 dakika kilitlendi.',
      })
    }
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: `Geçersiz e-posta veya şifre. Kalan deneme hakkı: ${remainingAttempts}`,
    })
  }

  // 4. Başarılı Giriş: Sayacı sıfırla, JWT üret ve HttpOnly Cookie ayarla
  resetLoginRateLimit(rateLimitKey)

  const tokenPayload = {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }

  const token = createAuthToken(tokenPayload)
  setAdminSessionCookie(event, token)

  return {
    success: true,
    user: tokenPayload,
  }
})
