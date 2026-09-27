import prisma from '~/lib/prisma'
import { getAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const session = await getAdminSession(event)
  const showAll = session && (query.all === 'true' || query.all === '1')

  const activities = await prisma.category.findMany({
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

  // Set Cache-Control: allow client & CDN caching for public, but short revalidation
  if (!showAll) {
    setHeader(event, 'Cache-Control', 'public, max-age=60, s-maxage=120, stale-while-revalidate=300')
  } else {
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate')
  }

  return {
    success: true,
    data: activities,
  }
})
