import {
  hashPassword,
  verifyPassword,
  createAuthToken,
  verifyAuthToken,
  recordFailedLogin,
  checkLoginRateLimit,
  resetLoginRateLimit,
} from '../server/utils/auth'

async function runTests() {
  console.log('=====================================================')
  console.log('       İKİ KELAM — STATE 04: AUTH TEST SUITE         ')
  console.log('=====================================================\n')

  let passed = 0
  let failed = 0

  function assert(description: string, condition: boolean) {
    if (condition) {
      console.log(`[PASS] ✅ ${description}`)
      passed++
    } else {
      console.error(`[FAIL] ❌ ${description}`)
      failed++
    }
  }

  // 1. Password Hashing (bcrypt)
  const password = 'GucluAdminSifresi2026!'
  const hash = await hashPassword(password)
  assert('Password hash is generated and is not plain-text', hash.startsWith('$2a$') || hash.startsWith('$2b$'))
  assert('Correct password verifies successfully', await verifyPassword(password, hash) === true)
  assert('Wrong password fails verification', await verifyPassword('YanlisSifre123', hash) === false)

  // 2. JWT Token Generation & Verification
  const payload = {
    id: 'admin_test_123',
    email: 'admin@ikikelam.org.tr',
    name: 'Test Başyönetici',
    role: 'SUPER_ADMIN',
  }
  const token = createAuthToken(payload)
  assert('JWT token generated successfully', typeof token === 'string' && token.split('.').length === 3)

  const verified = verifyAuthToken(token)
  assert('JWT token verifies and extracts payload correctly', verified?.id === payload.id && verified?.email === payload.email)

  const tamperedToken = token.slice(0, -5) + 'xxxxx'
  assert('Tampered/invalid JWT token is rejected', verifyAuthToken(tamperedToken) === null)

  // 3. Brute-force & Rate Limiting Test
  const testIpKey = '127.0.0.1:brute-test@ikikelam.org.tr'
  resetLoginRateLimit(testIpKey)

  for (let i = 1; i <= 4; i++) {
    const res = recordFailedLogin(testIpKey)
    assert(`Attempt ${i} is recorded (remaining: ${res.remainingAttempts})`, res.locked === false)
  }
  const fifthAttempt = recordFailedLogin(testIpKey)
  assert('5th consecutive failed attempt triggers lockout', fifthAttempt.locked === true)

  const limitCheck = checkLoginRateLimit(testIpKey)
  assert('Account is locked out after limit exceeded', limitCheck.isLimited === true)

  resetLoginRateLimit(testIpKey)
  assert('Rate limit resets on successful login', checkLoginRateLimit(testIpKey).isLimited === false)

  // 4. HTTP Endpoint Integration Tests (Against active server on port 3000)
  console.log('\n--- HTTP Endpoint Integration Tests ---')
  const baseUrl = 'http://localhost:3000'

  // Test 4.1: Public API doesn't require auth
  try {
    const res = await fetch(`${baseUrl}/api/health`)
    const data = await res.json()
    assert('Public API (/api/health) is accessible without auth (200 OK)', res.status === 200 && data.status === 'ok')
  } catch (e) {
    console.warn('Dev server test skipped or error:', e)
  }

  // Test 4.2: Protected API (/api/admin/stats) rejects unauthorized requests
  try {
    const res = await fetch(`${baseUrl}/api/admin/stats`)
    assert('Protected API (/api/admin/stats) rejects unauthenticated request (401 Unauthorized)', res.status === 401)
  } catch (e) {
    console.warn('Dev server test skipped or error:', e)
  }

  // Test 4.3: GET /api/auth/me rejects unauthorized request
  try {
    const res = await fetch(`${baseUrl}/api/auth/me`)
    assert('Current session endpoint (/api/auth/me) rejects unauthenticated request (401)', res.status === 401)
  } catch (e) {
    console.warn('Dev server test skipped or error:', e)
  }

  // Test 4.4: Authenticated request with Bearer token to /api/auth/me
  try {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    assert('GET /api/auth/me succeeds with valid token (Session Persistence)', res.status === 200 && data.success === true && data.user.email === payload.email)
  } catch (e) {
    console.warn('Dev server test skipped or error:', e)
  }

  // Test 4.5: Authenticated request to protected API /api/admin/stats
  try {
    const res = await fetch(`${baseUrl}/api/admin/stats`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    const data = await res.json()
    assert('Protected API (/api/admin/stats) succeeds with valid admin token (200 OK)', res.status === 200 && data.success === true)
  } catch (e) {
    console.warn('Dev server test skipped or error:', e)
  }

  // Test 4.6: Authenticated request with Cookie
  try {
    const res = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Cookie: `ikikelam_admin_session=${token}`,
      },
    })
    const data = await res.json()
    assert('HttpOnly Cookie authentication works seamlessly', res.status === 200 && data.success === true)
  } catch (e) {
    console.warn('Dev server test skipped or error:', e)
  }

  // Test 4.7: POST /api/auth/logout clears session
  try {
    const res = await fetch(`${baseUrl}/api/auth/logout`, { method: 'POST' })
    const setCookieHeader = res.headers.get('set-cookie') || ''
    assert('POST /api/auth/logout returns success and clears cookie', res.status === 200 && (setCookieHeader.includes('Max-Age=0') || setCookieHeader.includes('Expires=')))
  } catch (e) {
    console.warn('Dev server test skipped or error:', e)
  }

  console.log(`\n=====================================================`)
  console.log(`Test Results: ${passed} PASSED, ${failed} FAILED`)
  console.log(`=====================================================`)

  if (failed > 0) {
    process.exit(1)
  }
}

runTests().catch((e) => {
  console.error('Test run error:', e)
  process.exit(1)
})
