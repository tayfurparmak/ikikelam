import bcrypt from 'bcryptjs'
import { PrismaClient, AdminRole } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  const args = process.argv.slice(2)
  const argMap: Record<string, string> = {}

  for (const arg of args) {
    if (arg.startsWith('--')) {
      const [key, value] = arg.substring(2).split('=')
      if (key && value) {
        argMap[key] = value
      }
    }
  }

  const email = (argMap.email || process.env.ADMIN_EMAIL || process.env.SEED_ADMIN_EMAIL || '').trim().toLowerCase()
  const password = argMap.password || process.env.ADMIN_PASSWORD || process.env.SEED_ADMIN_PASSWORD || ''
  const name = argMap.name || process.env.ADMIN_NAME || 'İki Kelam Yöneticisi'
  const roleInput = (argMap.role || 'SUPER_ADMIN').toUpperCase()
  const role = roleInput === 'ADMIN' ? AdminRole.ADMIN : roleInput === 'EDITOR' ? AdminRole.EDITOR : AdminRole.SUPER_ADMIN

  if (!email || !password) {
    console.error('❌ Hata: E-posta ve şifre zorunludur!')
    console.log('Kullanım: npx tsx scripts/create-admin.ts --email=admin@ikikelam.org.tr --password="GucluSifre2026!" --name="Başyönetici"')
    process.exit(1)
  }

  if (password.length < 8) {
    console.error('❌ Hata: Şifre en az 8 karakter olmalıdır!')
    process.exit(1)
  }

  console.log(`🔐 Şifre bcrypt ile tuzlanarak güvenli hash'leniyor...`)
  const passwordHash = await bcrypt.hash(password, 12)

  const admin = await prisma.adminUser.upsert({
    where: { email },
    update: {
      name,
      passwordHash,
      role,
    },
    create: {
      email,
      name,
      passwordHash,
      role,
    },
  })

  console.log(`✅ Yönetici hesabı başarıyla oluşturuldu / güncellendi:`)
  console.log(`   ID:    ${admin.id}`)
  console.log(`   Email: ${admin.email}`)
  console.log(`   İsim:  ${admin.name}`)
  console.log(`   Rol:   ${admin.role}`)
}

main()
  .catch((e) => {
    console.error('❌ Hata:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
