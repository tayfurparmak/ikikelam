import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import type { H3Event } from 'h3'
import prisma from '../../lib/prisma'

export const AUTH_COOKIE_NAME = 'ikikelam_admin_session'
export const TOKEN_EXPIRATION_SECONDS = 7 * 24 * 60 * 60 // 7 days

export interface AdminJWTPayload {
  id: string
  email: string
  name: string
  role: string
}

export interface AdminSessionUser {
  id: string
  email: string
  name: string
  role: string
}

// ---------------------------------------------------------------------------
// Rate Limiter / Brute Force Protection (In-Memory)
// ---------------------------------------------------------------------------
interface RateLimitRecord {
  attempts: number
  lockUntil: number
  firstAttemptAt: number
}

const rateLimitMap = new Map<string, RateLimitRecord>()
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 15 * 60 * 1000 // 15 minutes
const WINDOW_MS = 15 * 60 * 1000 // 15 minutes window

/**
 * Checks if an identifier (IP address + email) is currently rate-limited.
 */
export function checkLoginRateLimit(identifier: string): { isLimited: boolean; remainingSeconds?: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record) {
    return { isLimited: false }
  }

  // Check if locked out
  if (record.lockUntil > now) {
    const remainingSeconds = Math.ceil((record.lockUntil - now) / 1000)
    return { isLimited: true, remainingSeconds }
  }

  // Reset window if expired
  if (now - record.firstAttemptAt > WINDOW_MS) {
    rateLimitMap.delete(identifier)
    return { isLimited: false }
  }

  return { isLimited: false }
}

/**
 * Registers a failed login attempt. Locks the account if threshold exceeded.
 */
export function recordFailedLogin(identifier: string): { locked: boolean; remainingAttempts: number } {
  const now = Date.now()
  const record = rateLimitMap.get(identifier)

  if (!record || now - record.firstAttemptAt > WINDOW_MS) {
    rateLimitMap.set(identifier, {
      attempts: 1,
      lockUntil: 0,
      firstAttemptAt: now,
    })
    return { locked: false, remainingAttempts: MAX_ATTEMPTS - 1 }
  }

  record.attempts += 1
  if (record.attempts >= MAX_ATTEMPTS) {
    record.lockUntil = now + LOCKOUT_MS
    return { locked: true, remainingAttempts: 0 }
  }

  return { locked: false, remainingAttempts: MAX_ATTEMPTS - record.attempts }
}

/**
 * Resets failed attempts after a successful login.
 */
export function resetLoginRateLimit(identifier: string): void {
  rateLimitMap.delete(identifier)
}

// ---------------------------------------------------------------------------
// Password & Token Functions
// ---------------------------------------------------------------------------

export async function hashPassword(plainText: string): Promise<string> {
  const salt = await bcrypt.genSalt(12)
  return bcrypt.hash(plainText, salt)
}

export async function verifyPassword(plainText: string, hash: string): Promise<boolean> {
  return bcrypt.compare(plainText, hash)
}

export function getAuthSecret(): string {
  try {
    const config = useRuntimeConfig()
    return config.authSecret || process.env.AUTH_SECRET || 'ikikelam-default-auth-secret-change-in-production'
  } catch {
    return process.env.AUTH_SECRET || 'ikikelam-default-auth-secret-change-in-production'
  }
}

export function createAuthToken(payload: AdminJWTPayload): string {
  return jwt.sign(payload, getAuthSecret(), {
    expiresIn: TOKEN_EXPIRATION_SECONDS,
  })
}

export function verifyAuthToken(token: string): AdminJWTPayload | null {
  try {
    return jwt.verify(token, getAuthSecret()) as AdminJWTPayload
  } catch {
    return null
  }
}

// ---------------------------------------------------------------------------
// Cookie & Session Management
// ---------------------------------------------------------------------------

export function setAdminSessionCookie(event: H3Event, token: string): void {
  setCookie(event, AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: TOKEN_EXPIRATION_SECONDS,
    path: '/',
  })
}

export function clearAdminSessionCookie(event: H3Event): void {
  deleteCookie(event, AUTH_COOKIE_NAME, {
    path: '/',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  })
}

export function getAdminSessionToken(event: H3Event): string | null {
  // 1. Check HttpOnly cookie
  const cookieToken = getCookie(event, AUTH_COOKIE_NAME)
  if (cookieToken) return cookieToken

  // 2. Check Authorization Bearer header
  const authHeader = getHeader(event, 'authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7).trim()
  }

  return null
}

/**
 * Validates the current session from cookie/header and confirms user in DB.
 */
export async function getAdminSession(event: H3Event): Promise<AdminSessionUser | null> {
  const token = getAdminSessionToken(event)
  if (!token) return null

  const payload = verifyAuthToken(token)
  if (!payload || !payload.id) return null

  // Verify against active DB record (if DB is accessible)
  try {
    const user = await prisma.adminUser.findUnique({
      where: { id: payload.id },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      },
    })
    return user
  } catch (err) {
    // If DB is temporarily unreachable in dev, payload has validated JWT signature
    console.warn('[Auth Warning] Database lookup fallback to token payload:', err)
    return {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role,
    }
  }
}

/**
 * Enforces admin authorization. Throws 401 if unauthenticated.
 */
export async function requireAdminSession(event: H3Event): Promise<AdminSessionUser> {
  const session = await getAdminSession(event)
  if (!session) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
      message: 'Bu işlem için yönetici girişi yapmanız gerekmektedir.',
    })
  }
  return session
}

/**
 * Enforces role-based authorization. Throws 401 if unauthenticated, 403 if forbidden.
 */
export async function requireAdminRole(
  event: H3Event,
  allowedRoles: Array<'SUPER_ADMIN' | 'ADMIN' | 'EDITOR'>,
): Promise<AdminSessionUser> {
  const session = await requireAdminSession(event)
  if (!allowedRoles.includes(session.role as 'SUPER_ADMIN' | 'ADMIN' | 'EDITOR')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden',
      message: 'Bu işlem için yetkiniz bulunmamaktadır.',
    })
  }
  return session
}

