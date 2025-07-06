<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Lupa Kata Laluan
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Masukkan alamat e-mel anda untuk menerima pautan tetapan semula kata laluan
        </p>
      </div>

      <div class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm -space-y-px">
          <div class="bg-white px-6 py-8 rounded-lg shadow-lg">
            
            <!-- Success State -->
            <div v-if="isSuccess" class="text-center">
              <div class="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100">
                <svg class="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                </svg>
              </div>
              <h3 class="mt-4 text-lg font-medium text-gray-900">E-mel Telah Dihantar</h3>
              <p class="mt-2 text-sm text-gray-600">{{ successMessage }}</p>
              <p class="mt-2 text-sm text-gray-500">
                Sila semak peti masuk anda dan ikuti arahan untuk menetapkan semula kata laluan.
              </p>
              <div class="mt-6 space-y-3">
                <button
                  @click="resetForm"
                  class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Hantar Semula
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

              <!-- Email Input -->
              <div>
                <label for="email" class="block text-sm font-medium text-gray-700">
                  Alamat E-mel
                </label>
                <div class="mt-1 relative">
                  <input
                    id="email"
                    v-model="form.email"
                    type="email"
                    required
                    class="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    :class="{ 'border-red-300': emailError }"
                    placeholder="nama@contoh.com"
                  />
                  <div v-if="emailError" class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <svg class="h-5 w-5 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                </div>
                <p v-if="emailError" class="mt-2 text-sm text-red-600">
                  {{ emailError }}
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
                  <span v-if="isLoading">Menghantar...</span>
                  <span v-else>Hantar Pautan Reset</span>
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
import { ref, computed } from 'vue'

// Meta data untuk halaman
definePageMeta({
  layout: false,
  title: 'Lupa Kata Laluan'
})

// Router
const router = useRouter()

// Form state
const form = ref({
  email: ''
})

// UI state
const isLoading = ref(false)
const isSuccess = ref(false)
const errorMessage = ref('')
const successMessage = ref('')

// Computed properties
const emailError = computed(() => {
  if (!form.value.email) return ''
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(form.value.email)) {
    return 'Format e-mel tidak sah'
  }
  
  return ''
})

// Form validation
const validateForm = () => {
  if (!form.value.email) {
    errorMessage.value = 'Alamat e-mel diperlukan'
    return false
  }
  
  if (emailError.value) {
    errorMessage.value = emailError.value
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
    const response = await $fetch('/api/auth/forgot-password', {
      method: 'POST',
      body: {
        email: form.value.email
      }
    })
    
    if (response.success) {
      isSuccess.value = true
      successMessage.value = response.message
    } else {
      throw new Error(response.message || 'Permintaan gagal')
    }
  } catch (error) {
    errorMessage.value = error.data?.statusMessage || error.message || 'Ralat tidak diketahui'
  } finally {
    isLoading.value = false
  }
}

// Reset form
const resetForm = () => {
  form.value.email = ''
  isSuccess.value = false
  errorMessage.value = ''
  successMessage.value = ''
}

// Navigation
const goToLogin = () => {
  router.push('/auth/login')
}
</script>

<style scoped>
/* Additional custom styles if needed */
</style> 