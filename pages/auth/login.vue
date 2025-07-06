<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Log Masuk ke Akaun
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Belum ada akaun?
          <NuxtLink to="/auth/register" class="font-medium text-blue-600 hover:text-blue-500">
            Daftar di sini
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Alamat E-mel</label>
            <input
              id="email"
              v-model="formData.email"
              name="email"
              type="email"
              autocomplete="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Alamat E-mel"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Kata Laluan</label>
            <input
              id="password"
              v-model="formData.password"
              name="password"
              type="password"
              autocomplete="current-password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Kata Laluan"
            />
          </div>
        </div>

        <div class="flex items-center justify-between">
          <div class="flex items-center">
            <input
              id="remember-me"
              v-model="rememberMe"
              name="remember-me"
              type="checkbox"
              class="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label for="remember-me" class="ml-2 block text-sm text-gray-900">
              Ingat saya
            </label>
          </div>

          <div class="text-sm">
            <NuxtLink to="/auth/forgot-password" class="font-medium text-blue-600 hover:text-blue-500">
              Lupa kata laluan?
            </NuxtLink>
          </div>
        </div>

        <!-- Error Messages -->
        <div v-if="error" class="rounded-md bg-red-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-red-800">
                {{ error }}
              </h3>
            </div>
          </div>
        </div>

        <!-- Account Not Verified Warning -->
        <div v-if="showVerificationWarning" class="rounded-md bg-yellow-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-yellow-800">
                Akaun belum disahkan. Sila semak e-mel untuk pautan pengesahan.
              </h3>
            </div>
          </div>
        </div>

        <div>
          <button
            type="submit"
            :disabled="isLoading"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </span>
            {{ isLoading ? 'Memproses...' : 'Log Masuk' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

// Meta tags untuk SEO
definePageMeta({
  title: 'Log Masuk - Compare Harga'
})

const authStore = useAuthStore()
const router = useRouter()

// Form data
const formData = ref({
  email: '',
  password: ''
})

const rememberMe = ref(false)
const error = ref('')
const isLoading = ref(false)
const showVerificationWarning = ref(false)

// Validation
const validateForm = () => {
  error.value = ''
  
  if (!formData.value.email.trim()) {
    error.value = 'Alamat e-mel diperlukan'
    return false
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(formData.value.email)) {
    error.value = 'Format e-mel tidak sah'
    return false
  }
  
  if (!formData.value.password) {
    error.value = 'Kata laluan diperlukan'
    return false
  }
  
  return true
}

const handleLogin = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  error.value = ''
  showVerificationWarning.value = false
  
  try {
    await authStore.login({
      email: formData.value.email,
      password: formData.value.password
    })
    
    // Jika berjaya, auth store akan redirect ke halaman utama
    
  } catch (err: any) {
    // Handle different types of errors
    if (err.data?.statusCode === 401) {
      error.value = 'E-mel atau kata laluan tidak tepat'
    } else if (err.data?.statusCode === 403) {
      error.value = 'Akaun belum disahkan'
      showVerificationWarning.value = true
    } else {
      error.value = authStore.error || 'Ralat semasa log masuk'
    }
  } finally {
    isLoading.value = false
  }
}

// Redirect jika sudah login
onMounted(() => {
  if (authStore.isAuthenticated) {
    router.push('/')
  }
})

// Clear errors when typing
watch([() => formData.value.email, () => formData.value.password], () => {
  if (error.value) {
    error.value = ''
  }
  if (showVerificationWarning.value) {
    showVerificationWarning.value = false
  }
})
</script> 