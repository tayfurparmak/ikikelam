const BASE = 'http://localhost:3000'

async function run() {
  console.log('=== TEST SUITE: STATE 11 ADMIN PANEL ===\n')

  let passed = 0
  let failed = 0

  function check(cond, msg) {
    if (cond) {
      passed++
      console.log(`  ✅ PASS: ${msg}`)
    } else {
      failed++
      console.error(`  ❌ FAIL: ${msg}`)
    }
  }

  // 1. SSR Admin Pages
  console.log('--- 1. Testing Admin Pages SSR ---')
  const pages = [
    '/admin/login',
    '/admin',
    '/admin/posts',
    '/admin/categories',
    '/admin/gallery',
    '/admin/schedule',
    '/admin/messages',
    '/admin/settings',
  ]

  for (const p of pages) {
    const res = await fetch(`${BASE}${p}`)
    check(res.status === 200, `Page ${p} returns HTTP 200`)
  }

  // 2. Server-side Security Verification (401 without cookie)
  console.log('\n--- 2. Testing Server-side Auth Security (401 Unauthorized) ---')
  const unauthTests = [
    { url: '/api/admin/stats', method: 'GET' },
    { url: '/api/posts', method: 'POST', body: { title: 'No Auth' } },
    { url: '/api/categories', method: 'POST', body: { name: 'No Auth' } },
    { url: '/api/gallery', method: 'POST', body: { title: 'No Auth' } },
    { url: '/api/schedule', method: 'POST', body: { lessonName: 'No Auth' } },
    { url: '/api/messages', method: 'GET' },
  ]

  for (const t of unauthTests) {
    const res = await fetch(`${BASE}${t.url}`, {
      method: t.method,
      headers: { 'Content-Type': 'application/json' },
      body: t.body ? JSON.stringify(t.body) : undefined,
    })
    check(res.status === 401, `Unauthenticated ${t.method} ${t.url} is blocked with 401`)
  }

  // 3. Admin Authentication (Login & Session)
  console.log('\n--- 3. Testing Admin Authentication ---')
  const loginRes = await fetch(`${BASE}/api/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email: 'admin@ikikelam.org.tr',
      password: 'AdminPassword2026!',
    }),
  })
  check(loginRes.status === 200, 'POST /api/auth/login successful')

  const setCookie = loginRes.headers.get('set-cookie')
  const authCookie = setCookie ? setCookie.split(';')[0] : ''
  check(Boolean(authCookie), 'Admin JWT session cookie captured')

  const meRes = await fetch(`${BASE}/api/auth/me`, {
    headers: { Cookie: authCookie },
  })
  const meJson = await meRes.json()
  check(meRes.status === 200 && (meJson.user?.email === 'admin@ikikelam.org.tr' || meJson.data?.user?.email === 'admin@ikikelam.org.tr'), 'GET /api/auth/me returns authenticated admin')

  // 4. Authenticated Admin Stats
  console.log('\n--- 4. Testing Admin Stats with Auth ---')
  const statsRes = await fetch(`${BASE}/api/admin/stats`, {
    headers: { Cookie: authCookie },
  })
  const statsJson = await statsRes.json()
  check(statsRes.status === 200 && statsJson.data?.stats?.totalPosts >= 0, 'GET /api/admin/stats returns real database stats')

  // 5. Authenticated CRUD Operations
  console.log('\n--- 5. Testing Real Admin CRUD Operations ---')

  // 5.1 Category CRUD
  const catSlug = `admin-test-cat-${Date.now()}`
  const catCreateRes = await fetch(`${BASE}/api/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: authCookie },
    body: JSON.stringify({
      name: 'Yönetim Test Kategorisi',
      slug: catSlug,
      description: 'Yönetim paneli testi',
      isActive: true,
    }),
  })
  const catCreateJson = await catCreateRes.json()
  const createdCatId = catCreateJson.data?.id
  check(catCreateRes.status === 201 && createdCatId, 'POST /api/categories creates category')

  // 5.2 Post CRUD
  const postSlug = `admin-test-post-${Date.now()}`
  const postCreateRes = await fetch(`${BASE}/api/posts`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: authCookie },
    body: JSON.stringify({
      title: 'Yönetim Test Makalesi',
      slug: postSlug,
      excerpt: 'Yönetim paneli test özeti',
      content: '<p>Yönetim paneli test içeriği.</p>',
      categoryId: createdCatId,
      status: 'DRAFT',
    }),
  })
  const postCreateJson = await postCreateRes.json()
  const createdPostId = postCreateJson.data?.id
  check(postCreateRes.status === 201 && createdPostId, 'POST /api/posts creates post')

  // Post Update (Draft -> Published)
  const postUpdateRes = await fetch(`${BASE}/api/posts/${createdPostId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: authCookie },
    body: JSON.stringify({
      status: 'PUBLISHED',
      publishedAt: new Date().toISOString(),
    }),
  })
  check(postUpdateRes.status === 200, 'PUT /api/posts/[id] updates status to PUBLISHED')

  // Post Delete
  const postDeleteRes = await fetch(`${BASE}/api/posts/${createdPostId}`, {
    method: 'DELETE',
    headers: { Cookie: authCookie },
  })
  check(postDeleteRes.status === 200, 'DELETE /api/posts/[id] deletes post')

  // Category Delete
  const catDeleteRes = await fetch(`${BASE}/api/categories/${createdCatId}`, {
    method: 'DELETE',
    headers: { Cookie: authCookie },
  })
  check(catDeleteRes.status === 200, 'DELETE /api/categories/[id] deletes category')

  // 5.3 Schedule CRUD
  const schedCreateRes = await fetch(`${BASE}/api/schedule`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Cookie: authCookie },
    body: JSON.stringify({
      dayOfWeek: 2,
      startTime: '10:00',
      endTime: '12:00',
      lessonName: 'Test Akaid Dersi',
      teacher: 'Test Müderris',
      targetAudience: 'Talebeler',
      description: 'Yönetim paneli test dersi',
      isActive: true,
    }),
  })
  const schedCreateJson = await schedCreateRes.json()
  const createdSchedId = schedCreateJson.data?.id
  check(schedCreateRes.status === 201 && createdSchedId, 'POST /api/schedule creates schedule item')

  const schedDeleteRes = await fetch(`${BASE}/api/schedule/${createdSchedId}`, {
    method: 'DELETE',
    headers: { Cookie: authCookie },
  })
  check(schedDeleteRes.status === 200, 'DELETE /api/schedule/[id] deletes schedule item')

  // 5.4 Messages Admin View & Status
  const msgListRes = await fetch(`${BASE}/api/messages`, {
    headers: { Cookie: authCookie },
  })
  const msgListJson = await msgListRes.json()
  check(msgListRes.status === 200 && Array.isArray(msgListJson.data), 'GET /api/messages returns list of messages')

  if (msgListJson.data?.length > 0) {
    const firstMsg = msgListJson.data[0]
    const patchRes = await fetch(`${BASE}/api/messages/${firstMsg.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Cookie: authCookie },
      body: JSON.stringify({ status: 'READ' }),
    })
    check(patchRes.status === 200, 'PATCH /api/messages/[id] marks message as READ')
  }

  console.log(`\n====================================================`)
  console.log(`SUMMARY: ${passed} PASSED, ${failed} FAILED`)
  console.log(`====================================================`)

  if (failed > 0) {
    process.exit(1)
  }
}

run().catch((e) => {
  console.error(e)
  process.exit(1)
})
