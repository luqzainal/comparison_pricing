/**
 * Middleware ini melindungi laluan (routes) yang memerlukan pengesahan.
 * Ia memeriksa status pengesahan pengguna. Jika pengguna tidak disahkan,
 * ia akan menghalakan mereka ke halaman utama untuk log masuk.
 *
 * `to.meta.auth` digunakan untuk menandakan laluan yang dilindungi.
 * Contohnya, dalam `definePageMeta` di halaman profil:
 * definePageMeta({
 *   auth: true
 * })
 */
export default defineNuxtRouteMiddleware((to) => {
  // Hanya jalankan middleware ini pada laluan yang ditanda dengan `auth: true`
  if (to.meta.auth) {
    const { status } = useAuth()

    // Jika pengguna tidak disahkan, halakan ke halaman utama.
    // Halaman utama akan mempunyai logik untuk menunjukkan butang log masuk.
    if (status.value === 'unauthenticated') {
      return navigateTo('/')
    }
  }
}) 