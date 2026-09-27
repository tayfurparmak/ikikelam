import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const path = getRequestPath(event)

  // Sadece /api/admin/ ile başlayan rotaları zorunlu koruma altına al
  if (path.startsWith('/api/admin')) {
    await requireAdminSession(event)
  }
})
