import fs from 'node:fs'
import path from 'node:path'
import { PrismaClient } from '@prisma/client'

function getDatabaseUrl(): string | undefined {
  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.includes('localhost:5432')) {
    return process.env.DATABASE_URL
  }
  try {
    const envPath = path.resolve(process.cwd(), '.env')
    if (fs.existsSync(envPath)) {
      const content = fs.readFileSync(envPath, 'utf-8')
      for (const line of content.split('\n')) {
        const trimmed = line.trim()
        if (trimmed.startsWith('DATABASE_URL=')) {
          let val = trimmed.slice('DATABASE_URL='.length).trim()
          if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
            val = val.slice(1, -1)
          }
          process.env.DATABASE_URL = val
          return val
        }
      }
    }
  } catch {
    // fallback to existing env
  }
  return process.env.DATABASE_URL
}

const dbUrl = getDatabaseUrl()

export const prisma = new PrismaClient({
  datasourceUrl: dbUrl,
  log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error'],
})

export default prisma
