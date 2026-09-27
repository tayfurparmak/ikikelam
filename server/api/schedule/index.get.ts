import prisma from '~/lib/prisma'
import { getAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const session = await getAdminSession(event)

  const whereClause: {
    isActive?: boolean
    dayOfWeek?: number
  } = {}

  // Admin değilse veya admin özellikle isActive filtresi vermemişse sadece aktif olanları getir
  if (!session) {
    whereClause.isActive = true
  } else if (query.isActive !== undefined) {
    whereClause.isActive = query.isActive === 'true'
  }

  if (query.dayOfWeek) {
    const day = Number.parseInt(String(query.dayOfWeek), 10)
    if (!Number.isNaN(day) && day >= 1 && day <= 7) {
      whereClause.dayOfWeek = day
    }
  }

  const schedules = await prisma.weeklySchedule.findMany({
    where: whereClause,
    orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
  })

  return {
    success: true,
    data: schedules,
  }
})
