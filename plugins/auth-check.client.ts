export default defineNuxtPlugin(async () => {
  const authStore = useAuthStore()
  
  // Check authentication status saat app dimulakan
  await authStore.checkAuth()
}) 