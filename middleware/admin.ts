export default defineNuxtRouteMiddleware(async (to) => {
  // Yalnızca /admin ile başlayan sayfaları denetle
  if (!to.path.startsWith('/admin')) {
    return
  }

  const { user, isInitialized, fetchUser } = useAdminAuth()

  // Oturum durumu henüz yüklenmemişse sunucu/istemci çereziyle doğrula
  if (!isInitialized.value) {
    await fetchUser()
  }

  const isAuthenticated = !!user.value

  // 1. Zaten giriş yapmış kullanıcı /admin/login sayfasına giderse doğrudan /admin'e yönlendir
  if (to.path === '/admin/login') {
    if (isAuthenticated) {
      return navigateTo('/admin')
    }
    return
  }

  // 2. Giriş yapmamış kullanıcı korumalı bir admin sayfasına girmeye çalışırsa login'e yönlendir
  if (!isAuthenticated) {
    return navigateTo({
      path: '/admin/login',
      query: { redirect: to.fullPath },
    })
  }
})
