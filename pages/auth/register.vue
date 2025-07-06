<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Daftar Akaun Baharu
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Sudah ada akaun?
          <NuxtLink to="/auth/login" class="font-medium text-blue-600 hover:text-blue-500">
            Log masuk di sini
          </NuxtLink>
        </p>
      </div>

      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Nama Penuh</label>
            <input
              id="name"
              v-model="formData.name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Nama Penuh"
            />
          </div>
          <div>
            <label for="email" class="sr-only">Alamat E-mel</label>
            <input
              id="email"
              v-model="formData.email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
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
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Kata Laluan (minimum 8 aksara)"
            />
          </div>
          <div>
            <label for="confirmPassword" class="sr-only">Sahkan Kata Laluan</label>
            <input
              id="confirmPassword"
              v-model="formData.confirmPassword"
              name="confirmPassword"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
              placeholder="Sahkan Kata Laluan"
            />
          </div>
        </div>

        <!-- Password Requirements -->
        <div class="text-sm text-gray-600">
          <p>Kata laluan mesti:</p>
          <ul class="list-disc list-inside space-y-1">
            <li>Sekurang-kurangnya 8 aksara</li>
          </ul>
        </div>

        <!-- reCAPTCHA -->
        <div class="flex justify-center">
          <div id="recaptcha-container" ref="recaptchaContainer"></div>
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

        <!-- Success Message -->
        <div v-if="success" class="rounded-md bg-green-50 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg class="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clip-rule="evenodd" />
              </svg>
            </div>
            <div class="ml-3">
              <h3 class="text-sm font-medium text-green-800">
                {{ success }}
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
            {{ isLoading ? 'Memproses...' : 'Daftar Akaun' }}
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
  title: 'Daftar Akaun - Compare Harga'
})

const authStore = useAuthStore()
const { $recaptcha } = useNuxtApp()
const runtimeConfig = useRuntimeConfig()

// Form data
const formData = ref({
  name: '',
  email: '',
  password: '',
  confirmPassword: ''
})

const error = ref('')
const success = ref('')
const isLoading = ref(false)
const recaptchaContainer = ref<HTMLElement>()
let recaptchaWidgetId: number | null = null

// Validation
const validateForm = () => {
  error.value = ''
  
  if (!formData.value.name.trim()) {
    error.value = 'Nama penuh diperlukan'
    return false
  }
  
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
  
  if (formData.value.password.length < 8) {
    error.value = 'Kata laluan mesti sekurang-kurangnya 8 aksara'
    return false
  }
  
  if (formData.value.password !== formData.value.confirmPassword) {
    error.value = 'Kata laluan tidak sepadan'
    return false
  }
  
  // Validate reCAPTCHA
  const recaptchaResponse = $recaptcha.getResponse(recaptchaWidgetId)
  if (!recaptchaResponse) {
    error.value = 'Sila sahkan bahawa anda bukan robot'
    return false
  }
  
  return true
}

const handleRegister = async () => {
  if (!validateForm()) return
  
  isLoading.value = true
  error.value = ''
  success.value = ''
  
  try {
    // Dapatkan reCAPTCHA response
    const recaptchaToken = $recaptcha.getResponse(recaptchaWidgetId)
    
    const result = await authStore.register({
      name: formData.value.name,
      email: formData.value.email,
      password: formData.value.password,
      recaptchaToken: recaptchaToken
    })
    
    if (result.success) {
      success.value = 'Akaun telah berjaya didaftarkan! Sila semak e-mel untuk pengesahan.'
      formData.value = {
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      }
      // Reset reCAPTCHA
      $recaptcha.reset(recaptchaWidgetId)
    } else {
      error.value = result.error || 'Pendaftaran gagal'
      // Reset reCAPTCHA pada error
      $recaptcha.reset(recaptchaWidgetId)
    }
  } catch (err) {
    error.value = 'Ralat semasa pendaftaran'
    // Reset reCAPTCHA pada error
    $recaptcha.reset(recaptchaWidgetId)
  } finally {
    isLoading.value = false
  }
}

// Redirect jika sudah login
const router = useRouter()
onMounted(async () => {
  if (authStore.isAuthenticated) {
    router.push('/')
    return
  }
  
  // Render reCAPTCHA
  try {
    await $recaptcha.ready()
    if (recaptchaContainer.value) {
      recaptchaWidgetId = $recaptcha.render(recaptchaContainer.value, {
        sitekey: runtimeConfig.public.recaptchaSiteKey,
        theme: 'light',
        size: 'normal'
      })
    }
  } catch (error) {
    console.error('Error rendering reCAPTCHA:', error)
  }
})
</script> 