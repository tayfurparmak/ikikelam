export type {
  AdminUser,
  Category,
  Post,
  GalleryImage,
  WeeklySchedule,
  ContactMessage,
  AdminRole,
  PostStatus,
  ContactType,
  MessageStatus,
  GalleryCategory,
} from '@prisma/client'

export interface NavItem {
  label: string
  to: string
  icon?: string
}

export interface ActivityItem {
  id: string
  title: string
  slug: string
  summary: string
  content?: string
  category: string
  date: string
  imageUrl?: string
}

export interface WeeklyScheduleItem {
  id: string
  day: string
  time: string
  lesson: string
  instructor: string
}
