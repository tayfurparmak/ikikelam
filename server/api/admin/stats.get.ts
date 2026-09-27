import prisma from '~/lib/prisma'
import { requireAdminSession } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  await requireAdminSession(event)

  const [
    totalPosts,
    publishedPosts,
    totalGalleryImages,
    unreadMessages,
    totalActivities,
    activeActivities,
    latestPosts,
    latestMessages,
  ] = await Promise.all([
    prisma.post.count(),
    prisma.post.count({ where: { status: 'PUBLISHED' } }),
    prisma.galleryImage.count(),
    prisma.contactMessage.count({ where: { status: 'UNREAD' } }),
    prisma.category.count(),
    prisma.category.count({ where: { isActive: true } }),
    prisma.post.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
      },
    }),
    prisma.contactMessage.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
    }),
  ])

  return {
    success: true,
    data: {
      stats: {
        totalPosts,
        publishedPosts,
        totalGalleryImages,
        unreadMessages,
        totalActivities,
        activeActivities,
      },
      latestPosts,
      latestMessages,
    },
  }
})
