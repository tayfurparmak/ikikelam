export interface AdminUserClient {
  id: string
  email: string
  name: string
  role: string
}

export const useAdminAuth = () => {
  const user = useState<AdminUserClient | null>('admin_auth_user', () => null)
  const isInitialized = useState<boolean>('admin_auth_initialized', () => false)
  const isLoading = useState<boolean>('admin_auth_loading', () => false)

  const isAuthenticated = computed(() => !!user.value)

  /**
   * Fetches current session from /api/auth/me
   */
  const fetchUser = async (): Promise<AdminUserClient | null> => {
    isLoading.value = true
    try {
      const response = await $fetch<{ success: boolean; user: AdminUserClient }>('/api/auth/me')
      if (response && response.success && response.user) {
        user.value = response.user
      } else {
        user.value = null
      }
    } catch {
      user.value = null
    } finally {
      isLoading.value = false
      isInitialized.value = true
    }
    return user.value
  }

  /**
   * Login with email & password
   */
  const login = async (email: string, password: string): Promise<AdminUserClient> => {
    isLoading.value = true
    try {
      const response = await $fetch<{ success: boolean; user: AdminUserClient }>('/api/auth/login', {
        method: 'POST',
        body: { email, password },
      })

      if (response && response.success && response.user) {
        user.value = response.user
        return response.user
      }

      throw new Error('Giriş başarısız oldu.')
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Logout and clear local auth state
   */
  const logout = async (): Promise<void> => {
    isLoading.value = true
    try {
      await $fetch('/api/auth/logout', { method: 'POST' }).catch(() => {})
      user.value = null
      await navigateTo('/admin/login')
    } finally {
      isLoading.value = false
    }
  }

  return {
    user,
    isAuthenticated,
    isLoading,
    isInitialized,
    fetchUser,
    login,
    logout,
  }
}
