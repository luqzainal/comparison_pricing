<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Tetapan Semula Kata Laluan
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Masukkan kata laluan baru anda
        </p>
      </div>

      <div class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="bg-white px-6 py-8 rounded-lg shadow-lg">
            
            <!-- Success State -->
            <div v-if="isSuccess" class="text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Kata Laluan Berjaya Ditetapkan</h3>
              <p class="mt-2 text-sm text-gray-600">{{ successMessage }}</p>
              <p class="mt-2 text-sm text-gray-500">
                Anda akan dialihkan ke halaman log masuk dalam {{ countdown }} saat...
              </p>
              <div class="mt-6">
                <button
                  @click="goToLogin"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Log Masuk Sekarang
                </button>
              </div>
            </div>

            <!-- No Token State -->
            <div v-else-if="!token" class="text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Pautan Tidak Sah</h3>
              <p class="mt-2 text-sm text-gray-600">
                Pautan tetapan semula kata laluan tidak lengkap atau tidak sah. Sila minta pautan baru.
              </p>
              <div class="mt-6 space-y-3">
                <button
                  @click="goToForgotPassword"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Minta Pautan Baru
                </button>
                <button
                  @click="goToLogin"
                  class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Kembali ke Log Masuk
                </button>
              </div>
            </div>

            <!-- Form State -->
            <form v-else @submit.prevent="submitForm" class="space-y-6">
              
              <!-- Error Alert -->
              <div v-if="errorMessage" class="bg-red-50 border border-red-200 rounded-md p-4">
                <div class="flex">
                  <div class="flex-shrink-0">
                    <svg class="h-5 w-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <div class="ml-3">
                    <p class="text-sm font-medium text-red-800">
                      {{ errorMessage }}
                    </p>
                  </div>
                </div>
              </div>

              <!-- Password Input -->
              <div>
                <label for="password" class="block text-sm font-medium text-gray-700">
                  Kata Laluan Baru
                </label>
                <div class="mt-1 relative">
                  <input
                    id="password"
                    v-model="form.password"
                    :type="showPassword ? 'text' : 'password'"
                    required
                    class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    :class="{ 'border-red-300': passwordError }"
                    placeholder="Masukkan kata laluan baru"
                  />
                  <button
                    type="button"
                    @click="showPassword = !showPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg v-if="showPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                    <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                </div>
                <p v-if="passwordError" class="mt-2 text-sm text-red-600">
                  {{ passwordError }}
                </p>
                <p v-else class="mt-2 text-sm text-gray-500">
                  Kata laluan mesti sekurang-kurangnya 8 aksara
                </p>
              </div>

              <!-- Confirm Password Input -->
              <div>
                <label for="confirmPassword" class="block text-sm font-medium text-gray-700">
                  Sahkan Kata Laluan
                </label>
                <div class="mt-1 relative">
                  <input
                    id="confirmPassword"
                    v-model="form.confirmPassword"
                    :type="showConfirmPassword ? 'text' : 'password'"
                    required
                    class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    :class="{ 'border-red-300': confirmPasswordError }"
                    placeholder="Sahkan kata laluan baru"
                  />
                  <button
                    type="button"
                    @click="showConfirmPassword = !showConfirmPassword"
                    class="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <svg v-if="showConfirmPassword" class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path>
                    </svg>
                    <svg v-else class="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
                    </svg>
                  </button>
                </div>
                <p v-if="confirmPasswordError" class="mt-2 text-sm text-red-600">
                  {{ confirmPasswordError }}
                </p>
              </div>

              <!-- Submit Button -->
              <div>
                <button
                  type="submit"
                  :disabled="isLoading"
                  class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isLoading" class="absolute left-0 inset-y-0 flex items-center pl-3">
                    <svg class="animate-spin h-5 w-5 text-blue-300" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  </span>
                  <span v-if="isLoading">Menetapkan...</span>
                  <span v-else>Tetapkan Kata Laluan</span>
                </button>
              </div>

              <!-- Back to Login -->
              <div class="text-center">
                <button
                  type="button"
                  @click="goToLogin"
                  class="text-sm text-blue-600 hover:text-blue-500"
                >
                  Kembali ke Log Masuk
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'

// Meta data untuk halaman
definePageMeta({
  layout: false,
  title: 'Tetapan Semula Kata Laluan'
})

// Router dan route
const router = useRouter()
const route = useRoute()

// Token from URL
const token = ref('')

// Form state
const form = ref({
  password: '',
  confirmPassword: ''
})

// UI state
const isLoading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')
const successMessage = ref('')
const showPassword = ref(false)
const showConfirmPassword = ref(false)
const countdown = ref(5)
const countdownInterval = ref(null)

// Computed properties
const passwordError = computed(() => {
  if (!form.value.password) return ''
  
  if (form.value.password.length < 8) {
    return 'Kata laluan mesti sekurang-kurangnya 8 aksara'
  }
  
  return ''
})

const confirmPasswordError = computed(() => {
  if (!form.value.confirmPassword) return ''
  
  if (form.value.password !== form.value.confirmPassword) {
    return 'Kata laluan tidak sepadan'
  }
  
  return ''
})

// Form validation
const validateForm = () => {
  if (!form.value.password) {
    errorMessage.value = 'Kata laluan diperlukan'
    return false
  }
  
  if (passwordError.value) {
    errorMessage.value = passwordError.value
    return false
  }
  
  if (!form.value.confirmPassword) {
    errorMessage.value = 'Pengesahan kata laluan diperlukan'
    return false
  }
  
  if (confirmPasswordError.value) {
    errorMessage.value = confirmPasswordError.value
    return false
  }
  
  return true
}

// Submit form
const submitForm = async () => {
  errorMessage.value = ''
  
  if (!validateForm()) return
  
  isLoading.value = true
  
  try {
    const response = await $fetch('/api/auth/reset-password', {
      method: 'POST',
      body: {
        token: token.value,
        password: form.value.password,
        confirmPassword: form.value.confirmPassword
      }
    })
    
    if (response.success) {
      isSuccess.value = true
      successMessage.value = response.message
      startCountdown()
    } else {
      throw new Error(response.message || 'Tetapan semula gagal')
    }
  } catch (error) {
    errorMessage.value = error.data?.statusMessage || error.message || 'Ralat tidak diketahui'
  } finally {
    isLoading.value = false
  }
}

// Countdown timer
const startCountdown = () => {
  countdownInterval.value = setInterval(() => {
    countdown.value--
    if (countdown.value <= 0) {
      goToLogin()
    }
  }, 1000)
}

// Navigation
const goToLogin = () => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
  router.push('/auth/login')
}

const goToForgotPassword = () => {
  router.push('/auth/forgot-password')
}

// Lifecycle hooks
onMounted(() => {
  token.value = route.query.token || ''
})

onUnmounted(() => {
  if (countdownInterval.value) {
    clearInterval(countdownInterval.value)
  }
})
</script>

<style scoped>
/* Additional custom styles if needed */
</style> 