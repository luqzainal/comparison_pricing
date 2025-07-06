import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Jika pengguna tidak log masuk, redirect ke halaman login
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }

  // Jika pengguna bukan admin, redirect ke halaman utama
  if (!authStore.isAdmin) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akses ditolak - Perlu kebenaran admin'
    })
  }
}) 