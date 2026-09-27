import { clearAdminSessionCookie } from '~/server/utils/auth'

export default defineEventHandler((event) => {
  clearAdminSessionCookie(event)
  return {
    success: true,
    message: 'Oturum başarıyla sonlandırıldı.',
  }
})
