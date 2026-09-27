export default defineEventHandler((event) => {
  // Simple server request logger in development
  if (process.env.NODE_ENV === 'development') {
    const method = getMethod(event)
    const path = getRequestPath(event)
    // Only log API routes to keep console clean
    if (path.startsWith('/api')) {
      console.log(`[API Request] ${method} ${path}`)
    }
  }
})
