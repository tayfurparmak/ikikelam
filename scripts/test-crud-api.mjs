const BASE_URL = 'http://localhost:3000'
let authCookie = ''
let testCategoryId = ''
let testPostId = ''
let testGalleryId = ''
let testScheduleId = ''
let testMessageId = ''

let totalTests = 0
let passedTests = 0
let failedTests = 0

function assert(condition, message) {
  totalTests++
  if (condition) {
    passedTests++
    console.log(`  ✅ PASS: ${message}`)
  } else {
    failedTests++
    console.error(`  ❌ FAIL: ${message}`)
  }
}

async function request(path, options = {}) {
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }
  if (authCookie && !options.noAuth) {
    headers['Cookie'] = authCookie
  }

  const response = await fetch(`${BASE_URL}${path}`, {
    ...options,
    headers,
  })

  let body
  const text = await response.text()
  try {
    body = JSON.parse(text)
  } catch {
    body = text
  }

  return {
    status: response.status,
    headers: response.headers,
    body,
  }
}

async function runTests() {
  console.log('====================================================')
  console.log('🚀 İKİ KELAM - STATE 05: BACKEND CRUD API TEST SUITE')
  console.log('====================================================\n')

  // -----------------------------------------------------------------
  // 1. PUBLIC CATEGORIES & AUTH CHECKS (401, 400, 200)
  // -----------------------------------------------------------------
  console.log('--- 1. CATEGORIES API TESTS ---')

  // 1.1 Public GET /api/categories
  const resCatGet = await request('/api/categories')
  assert(resCatGet.status === 200, 'GET /api/categories returns 200 OK')
  assert(Array.isArray(resCatGet.body?.data), 'GET /api/categories returns array of data')

  // 1.2 POST /api/categories without Auth -> Expect 401
  const resCatNoAuth = await request('/api/categories', {
    method: 'POST',
    body: JSON.stringify({ name: 'Yetkisiz Kategori' }),
  })
  assert(resCatNoAuth.status === 401, 'POST /api/categories without token returns 401 Unauthorized')

  // 1.3 POST /api/categories with invalid body -> without Auth returns 401 before validation
  // Now Login as Admin
  console.log('\n--- AUTHENTICATING ADMIN USER ---')
  const resLogin = await request('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      email: 'admin@ikikelam.org.tr',
      password: 'AdminPassword2026!',
    }),
  })
  assert(resLogin.status === 200, 'POST /api/auth/login successful')

  const setCookie = resLogin.headers.get('set-cookie')
  if (setCookie) {
    authCookie = setCookie.split(';')[0]
    console.log('  🔑 Auth cookie captured')
  }

  // 1.4 POST /api/categories with invalid body (Empty name) -> Expect 400
  const resCatBad = await request('/api/categories', {
    method: 'POST',
    body: JSON.stringify({ name: '' }),
  })
  assert(resCatBad.status === 400, 'POST /api/categories with empty name returns 400 Bad Request')

  // 1.5 POST /api/categories with valid data -> Expect 201
  const testSlug = `test-kategori-${Date.now()}`
  const resCatCreate = await request('/api/categories', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Test Kategori',
      slug: testSlug,
      description: 'Test kategorisi açıklaması.',
      isActive: true,
    }),
  })
  assert(resCatCreate.status === 201, 'POST /api/categories creates category (201 Created)')
  testCategoryId = resCatCreate.body?.data?.id
  assert(!!testCategoryId, 'Created category has valid ID')

  // 1.6 POST /api/categories with DUPLICATE SLUG -> Expect 409 Conflict
  const resCatDupSlug = await request('/api/categories', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Çakışan Kategori',
      slug: testSlug,
    }),
  })
  assert(resCatDupSlug.status === 409, 'POST /api/categories with duplicate slug returns 409 Conflict')

  // 1.7 GET /api/categories/[id] -> Expect 200
  const resCatGetOne = await request(`/api/categories/${testCategoryId}`)
  assert(resCatGetOne.status === 200, 'GET /api/categories/[id] returns 200')
  assert(resCatGetOne.body?.data?.slug === testSlug, 'Category slug matches')

  // 1.8 PUT /api/categories/[id] -> Expect 200
  const resCatUpdate = await request(`/api/categories/${testCategoryId}`, {
    method: 'PUT',
    body: JSON.stringify({
      name: 'Güncel Test Kategori',
      description: 'Güncellenmiş açıklama',
    }),
  })
  assert(resCatUpdate.status === 200, 'PUT /api/categories/[id] returns 200 OK')
  assert(resCatUpdate.body?.data?.name === 'Güncel Test Kategori', 'Category name successfully updated')

  // 1.9 GET /api/categories/non-existent-id -> Expect 404
  const resCat404 = await request('/api/categories/non-existent-id-99999')
  assert(resCat404.status === 404, 'GET /api/categories/[invalid-id] returns 404 Not Found')

  // -----------------------------------------------------------------
  // 2. POSTS API TESTS (Filters, Slug Gen, 401, 400, 409, 201, 200)
  // -----------------------------------------------------------------
  console.log('\n--- 2. POSTS API TESTS ---')

  // 2.1 Public GET /api/posts
  const resPostsPublic = await request('/api/posts')
  assert(resPostsPublic.status === 200, 'GET /api/posts returns 200 OK')
  assert(Array.isArray(resPostsPublic.body?.data), 'GET /api/posts returns data array')
  assert(resPostsPublic.body?.meta?.total !== undefined, 'GET /api/posts returns pagination meta')

  // 2.2 POST /api/posts without Auth -> Expect 401
  const resPostNoAuth = await request('/api/posts', {
    method: 'POST',
    noAuth: true,
    body: JSON.stringify({ title: 'Yetkisiz Yazı', content: 'İçerik...' }),
  })
  assert(resPostNoAuth.status === 401, 'POST /api/posts without auth returns 401 Unauthorized')

  // 2.3 POST /api/posts with invalid body (missing content) -> Expect 400
  const resPostBad = await request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({ title: 'Eksik Yazı' }),
  })
  assert(resPostBad.status === 400, 'POST /api/posts without content returns 400 Bad Request')

  // 2.4 POST /api/posts with valid body -> Expect 201
  const postSlug = `makale-test-${Date.now()}`
  const resPostCreate = await request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: 'İlim ve İrfan Üzerine Notlar',
      slug: postSlug,
      excerpt: 'İlmin fazileti hakkında kısa bir mukaddime.',
      content: 'Bismillâhirrahmânirrahîm. İlim amelin rehberidir...',
      status: 'PUBLISHED',
      categoryId: testCategoryId,
      coverImage: 'https://images.unsplash.com/photo-1544717305-2782549b5136',
    }),
  })
  assert(resPostCreate.status === 201, 'POST /api/posts creates post (201 Created)')
  testPostId = resPostCreate.body?.data?.id
  assert(!!testPostId, 'Created post has valid ID')
  assert(resPostCreate.body?.data?.slug === postSlug, 'Created post slug matches')

  // 2.5 POST /api/posts with DUPLICATE SLUG -> Expect 409 Conflict
  const resPostDupSlug = await request('/api/posts', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Aynı Slug Denemesi',
      slug: postSlug,
      content: 'İkinci içerik',
    }),
  })
  assert(resPostDupSlug.status === 409, 'POST /api/posts with duplicate slug returns 409 Conflict')

  // 2.6 GET /api/posts with filters: category, slug, status, search, page, limit
  const resPostFiltered = await request(`/api/posts?slug=${postSlug}&status=PUBLISHED&search=mukaddime&page=1&limit=5`)
  assert(resPostFiltered.status === 200, 'GET /api/posts with query filters returns 200')
  assert(resPostFiltered.body?.data?.length >= 1, 'Filter returns matched post')

  // 2.7 GET /api/posts/[id] -> Expect 200
  const resPostGetOne = await request(`/api/posts/${testPostId}`)
  assert(resPostGetOne.status === 200, 'GET /api/posts/[id] returns 200')
  assert(resPostGetOne.body?.data?.title === 'İlim ve İrfan Üzerine Notlar', 'Post title matches')

  // 2.8 PUT /api/posts/[id] -> Expect 200
  const resPostUpdate = await request(`/api/posts/${testPostId}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: 'İlim ve İrfan Üzerine Notlar (Genişletilmiş)',
      excerpt: 'Güncellenmiş özet.',
    }),
  })
  assert(resPostUpdate.status === 200, 'PUT /api/posts/[id] returns 200')
  assert(resPostUpdate.body?.data?.title === 'İlim ve İrfan Üzerine Notlar (Genişletilmiş)', 'Post updated successfully')

  // -----------------------------------------------------------------
  // 3. GALLERY API TESTS
  // -----------------------------------------------------------------
  console.log('\n--- 3. GALLERY API TESTS ---')

  // 3.1 Public GET /api/gallery
  const resGalGet = await request('/api/gallery')
  assert(resGalGet.status === 200, 'GET /api/gallery returns 200 OK')
  assert(Array.isArray(resGalGet.body?.data), 'GET /api/gallery returns array')

  // 3.2 POST /api/gallery without Auth -> Expect 401
  const resGalNoAuth = await request('/api/gallery', {
    method: 'POST',
    noAuth: true,
    body: JSON.stringify({ title: 'Yetkisiz Resim', imageUrl: 'https://example.com/img.jpg' }),
  })
  assert(resGalNoAuth.status === 401, 'POST /api/gallery without auth returns 401 Unauthorized')

  // 3.3 POST /api/gallery with valid data -> Expect 201
  const resGalCreate = await request('/api/gallery', {
    method: 'POST',
    body: JSON.stringify({
      title: 'Medrese Kütüphanesi',
      imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f',
      storagePath: 'gallery/2026/09/test-library.jpg',
      category: 'LIBRARY',
      altText: 'Kütüphane kitapları',
    }),
  })
  assert(resGalCreate.status === 201, 'POST /api/gallery creates image (201 Created)')
  testGalleryId = resGalCreate.body?.data?.id
  assert(!!testGalleryId, 'Created gallery item has valid ID')

  // 3.4 GET /api/gallery/[id] -> Expect 200
  const resGalGetOne = await request(`/api/gallery/${testGalleryId}`)
  assert(resGalGetOne.status === 200, 'GET /api/gallery/[id] returns 200')

  // 3.5 PUT /api/gallery/[id] -> Expect 200
  const resGalUpdate = await request(`/api/gallery/${testGalleryId}`, {
    method: 'PUT',
    body: JSON.stringify({
      title: 'Medrese Ana Kütüphanesi',
    }),
  })
  assert(resGalUpdate.status === 200, 'PUT /api/gallery/[id] returns 200')

  // 3.6 DELETE /api/gallery/[id] -> Expect 200 (Storage deletion handled safely)
  const resGalDelete = await request(`/api/gallery/${testGalleryId}`, {
    method: 'DELETE',
  })
  assert(resGalDelete.status === 200, 'DELETE /api/gallery/[id] returns 200')

  // -----------------------------------------------------------------
  // 4. WEEKLY SCHEDULE API TESTS
  // -----------------------------------------------------------------
  console.log('\n--- 4. WEEKLY SCHEDULE API TESTS ---')

  // 4.1 Public GET /api/schedule
  const resSchedGet = await request('/api/schedule')
  assert(resSchedGet.status === 200, 'GET /api/schedule returns 200 OK')
  assert(Array.isArray(resSchedGet.body?.data), 'GET /api/schedule returns array')

  // 4.2 POST /api/schedule without Auth -> Expect 401
  const resSchedNoAuth = await request('/api/schedule', {
    method: 'POST',
    noAuth: true,
    body: JSON.stringify({ lessonName: 'Yetkisiz Ders' }),
  })
  assert(resSchedNoAuth.status === 401, 'POST /api/schedule without auth returns 401 Unauthorized')

  // 4.3 POST /api/schedule with valid data -> Expect 201
  const resSchedCreate = await request('/api/schedule', {
    method: 'POST',
    body: JSON.stringify({
      dayOfWeek: 6, // Cumartesi
      startTime: '10:30',
      endTime: '12:00',
      lessonName: 'Usul-i Fıkıh Dersi',
      teacher: 'Hüseyin Avni Hoca',
      targetAudience: 'İlim Talebeleri',
      description: 'Menar şerhi dersleri.',
      isActive: true,
    }),
  })
  assert(resSchedCreate.status === 201, 'POST /api/schedule creates schedule item (201 Created)')
  testScheduleId = resSchedCreate.body?.data?.id
  assert(!!testScheduleId, 'Created schedule item has valid ID')

  // 4.4 GET /api/schedule/[id] -> Expect 200
  const resSchedGetOne = await request(`/api/schedule/${testScheduleId}`)
  assert(resSchedGetOne.status === 200, 'GET /api/schedule/[id] returns 200')

  // 4.5 PUT /api/schedule/[id] -> Expect 200
  const resSchedUpdate = await request(`/api/schedule/${testScheduleId}`, {
    method: 'PUT',
    body: JSON.stringify({
      lessonName: 'Usul-i Fıkıh ve Kavaid Dersi',
    }),
  })
  assert(resSchedUpdate.status === 200, 'PUT /api/schedule/[id] returns 200')

  // 4.6 DELETE /api/schedule/[id] -> Expect 200
  const resSchedDelete = await request(`/api/schedule/${testScheduleId}`, {
    method: 'DELETE',
  })
  assert(resSchedDelete.status === 200, 'DELETE /api/schedule/[id] returns 200')

  // -----------------------------------------------------------------
  // 5. CONTACT & MESSAGES API TESTS
  // -----------------------------------------------------------------
  console.log('\n--- 5. CONTACT & MESSAGES API TESTS ---')

  // 5.1 Public POST /api/contact with invalid email -> Expect 400
  const resContactBad = await request('/api/contact', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Ahmet',
      email: 'invalid-email',
      message: 'Kısa',
    }),
  })
  assert(resContactBad.status === 400, 'POST /api/contact with invalid email returns 400 Bad Request')

  // 5.2 Public POST /api/contact with valid data -> Expect 201
  const resContactCreate = await request('/api/contact', {
    method: 'POST',
    body: JSON.stringify({
      name: 'Mehmet Yılmaz',
      email: 'mehmet@example.com',
      phone: '+90 555 123 4567',
      subject: 'Ders Kaydı Hakkında',
      message: 'Haftalık usul derslerine dinleyici olarak katılabilir miyim?',
      type: 'COURSE_INQUIRY',
    }),
  })
  assert(resContactCreate.status === 201, 'POST /api/contact submits contact message (201 Created)')
  testMessageId = resContactCreate.body?.data?.id
  assert(!!testMessageId, 'Created contact message has ID')

  // 5.3 GET /api/messages without Auth -> Expect 401
  const authBackup = authCookie
  authCookie = ''
  const resMsgNoAuth = await request('/api/messages')
  assert(resMsgNoAuth.status === 401, 'GET /api/messages without auth returns 401 Unauthorized')
  authCookie = authBackup

  // 5.4 GET /api/messages with Auth -> Expect 200
  const resMsgAdmin = await request('/api/messages')
  assert(resMsgAdmin.status === 200, 'GET /api/messages with admin auth returns 200 OK')
  assert(resMsgAdmin.body?.unreadCount !== undefined, 'Returns unreadCount summary')

  // 5.5 GET /api/messages/[id] -> Expect 200
  const resMsgGetOne = await request(`/api/messages/${testMessageId}`)
  assert(resMsgGetOne.status === 200, 'GET /api/messages/[id] returns 200')
  assert(resMsgGetOne.body?.data?.name === 'Mehmet Yılmaz', 'Message content matches')

  // 5.6 PATCH /api/messages/[id] -> Expect 200
  const resMsgPatch = await request(`/api/messages/${testMessageId}`, {
    method: 'PATCH',
    body: JSON.stringify({
      status: 'READ',
    }),
  })
  assert(resMsgPatch.status === 200, 'PATCH /api/messages/[id] returns 200')
  assert(resMsgPatch.body?.data?.status === 'READ', 'Message status updated to READ')

  // 5.7 DELETE /api/messages/[id] -> Expect 200
  const resMsgDelete = await request(`/api/messages/${testMessageId}`, {
    method: 'DELETE',
  })
  assert(resMsgDelete.status === 200, 'DELETE /api/messages/[id] returns 200')

  // -----------------------------------------------------------------
  // 6. CLEANUP & CASCADE / DELETE POSTS & CATEGORIES
  // -----------------------------------------------------------------
  console.log('\n--- 6. CLEANUP & DELETE TESTS ---')

  // 6.1 DELETE /api/posts/[id] -> Expect 200
  const resPostDelete = await request(`/api/posts/${testPostId}`, {
    method: 'DELETE',
  })
  assert(resPostDelete.status === 200, 'DELETE /api/posts/[id] returns 200 OK')

  // 6.2 DELETE /api/categories/[id] with EDITOR role -> Expect 403 Forbidden
  const resLoginEditor = await request('/api/auth/login', {
    method: 'POST',
    noAuth: true,
    body: JSON.stringify({
      email: 'editor@ikikelam.org.tr',
      password: 'EditorPassword2026!',
    }),
  })
  const editorCookie = resLoginEditor.headers.get('set-cookie')?.split(';')[0]

  const resCat403 = await request(`/api/categories/${testCategoryId}`, {
    method: 'DELETE',
    headers: { Cookie: editorCookie },
    noAuth: true,
  })
  assert(resCat403.status === 403, 'DELETE /api/categories/[id] with EDITOR role returns 403 Forbidden')

  // 6.3 DELETE /api/categories/[id] with SUPER_ADMIN -> Expect 200
  const resCatDelete = await request(`/api/categories/${testCategoryId}`, {
    method: 'DELETE',
  })
  assert(resCatDelete.status === 200, 'DELETE /api/categories/[id] returns 200 OK')

  // 6.4 Verify post is really deleted -> GET /api/posts/[id] Expect 404
  const resPostVerify404 = await request(`/api/posts/${testPostId}`)
  assert(resPostVerify404.status === 404, 'GET deleted post returns 404 Not Found')

  // -----------------------------------------------------------------
  // SUMMARY
  // -----------------------------------------------------------------
  console.log('\n====================================================')
  console.log(`TOTAL TESTS:  ${totalTests}`)
  console.log(`PASSED:       ${passedTests}`)
  console.log(`FAILED:       ${failedTests}`)
  console.log('====================================================')

  if (failedTests > 0) {
    process.exit(1)
  }
}

runTests().catch((err) => {
  console.error('Fatal error running tests:', err)
  process.exit(1)
})
