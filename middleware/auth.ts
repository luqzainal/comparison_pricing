import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware((to, from) => {
  const authStore = useAuthStore()

  // Jika pengguna tidak log masuk, redirect ke halaman login
  if (!authStore.isAuthenticated) {
    return navigateTo('/auth/login')
  }
}) 