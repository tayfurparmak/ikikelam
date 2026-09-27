
export interface ToastMessage {
  id: string
  title: string
  message?: string
  type: 'success' | 'error' | 'info' | 'warning'
}

export const useAppToast = () => {
  const toasts = useState<ToastMessage[]>('app_toasts', () => [])

  const show = (toast: Omit<ToastMessage, 'id'>) => {
    const id = Math.random().toString(36).substring(2, 9)
    toasts.value.push({ ...toast, id })

    setTimeout(() => {
      toasts.value = toasts.value.filter((t) => t.id !== id)
    }, 4000)
  }

  return {
    toasts,
    show,
  }
}
