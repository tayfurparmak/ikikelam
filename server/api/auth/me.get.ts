import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const user = await requireAdminSession(event)
  return {
    success: true,
    user,
  }
})
