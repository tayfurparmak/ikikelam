import prisma from '~/lib/prisma'
import { getAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const session = await getAdminSession(event)
  const showAll = session && (query.all === 'true' || query.all === '1')

  const categories = await prisma.category.findMany({
    where: showAll ? undefined : { isActive: true },
    orderBy: [{ sortOrder: 'asc' }, { name: 'asc' }],
    include: {
      _count: {
        select: {
          posts: true,
        },
      },
    },
  })

  return {
    success: true,
    data: categories,
  }
})
