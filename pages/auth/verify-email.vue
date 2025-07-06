<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Pengesahan E-mel
        </h2>
      </div>
      
      <div class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="bg-white px-6 py-8 rounded-lg shadow-lg">
            
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center">
              <div class="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto"></div>
              <p class="mt-4 text-gray-600">Mengesahkan e-mel anda...</p>
            </div>

            <!-- Success State -->
            <div v-else-if="isSuccess" class="text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">E-mel Berjaya Disahkan!</h3>
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

            <!-- Error State -->
            <div v-else-if="isError" class="text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-red-100">
                <svg class="h-8 w-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Pengesahan Gagal</h3>
              <p class="mt-2 text-sm text-gray-600">{{ errorMessage }}</p>
              
              <div class="mt-6 space-y-3">
                <button
                  @click="requestNewToken"
                  :disabled="isResending"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span v-if="isResending">
                    <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Menghantar...
                  </span>
                  <span v-else>Hantar Semula E-mel Pengesahan</span>
                </button>
                
                <button
                  @click="goToLogin"
                  class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Kembali ke Log Masuk
                </button>
              </div>
            </div>

            <!-- No Token State -->
            <div v-else class="text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100">
                <svg class="h-8 w-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.863-.833-2.633 0L4.138 15.5c-.77.833.192 2.5 1.732 2.5z"></path>
                </svg>
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">Tiada Token Pengesahan</h3>
              <p class="mt-2 text-sm text-gray-600">
                Pautan pengesahan tidak lengkap. Sila semak e-mel anda untuk pautan yang betul.
              </p>
              <div class="mt-6">
                <button
                  @click="goToLogin"
                  class="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Kembali ke Log Masuk
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

// Meta data untuk halaman
definePageMeta({
  layout: false,
  title: 'Pengesahan E-mel'
})

// State management
const isLoading = ref(false)
const isSuccess = ref(false)
const isError = ref(false)
const isResending = ref(false)
const successMessage = ref('')
const errorMessage = ref('')
const countdown = ref(5)
const countdownInterval = ref(null)

// Router dan route
const router = useRouter()
const route = useRoute()

// Verify email function
const verifyEmail = async (token) => {
  isLoading.value = true
  isError.value = false
  isSuccess.value = false

  try {
    const response = await $fetch('/api/auth/verify-email', {
      method: 'GET',
      query: { token }
    })

    if (response.success) {
      isSuccess.value = true
      successMessage.value = response.message
      startCountdown()
    } else {
      throw new Error(response.message || 'Pengesahan gagal')
    }
  } catch (error) {
    isError.value = true
    errorMessage.value = error.data?.statusMessage || error.message || 'Ralat tidak diketahui'
  } finally {
    isLoading.value = false
  }
}

// Resend verification email
const requestNewToken = async () => {
  // Need to get email from somewhere - we'll prompt user
  const email = prompt('Sila masukkan alamat e-mel anda:')
  
  if (!email) return

  isResending.value = true
  
  try {
    const response = await $fetch('/api/auth/resend-verification', {
      method: 'POST',
      body: { email }
    })

    if (response.success) {
      alert('E-mel pengesahan telah dihantar semula. Sila semak peti masuk anda.')
    } else {
      throw new Error(response.message || 'Gagal menghantar e-mel')
    }
  } catch (error) {
    alert(error.data?.statusMessage || error.message || 'Ralat menghantar e-mel')
  } finally {
    isResending.value = false
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

// Lifecycle hooks
onMounted(() => {
  const token = route.query.token
  
  if (token) {
    verifyEmail(token)
  }
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