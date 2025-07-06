<template>
  <div class="bg-gray-50 min-h-screen">
    <div class="container mx-auto px-4 py-8">
      <!-- Loading State -->
      <div v-if="status === 'loading'" class="text-center">
        <p>Loading profile...</p>
      </div>

      <!-- Authenticated State -->
      <div v-else-if="status === 'authenticated' && data?.user" class="max-w-2xl mx-auto">
        <div class="bg-white rounded-lg shadow-md p-6">
          <div class="flex items-center space-x-6">
            <img 
              v-if="data.user.image"
              :src="data.user.image" 
              alt="User Avatar" 
              class="h-24 w-24 rounded-full border-4 border-gray-200"
            >
            <div 
              v-else 
              class="h-24 w-24 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl font-bold"
            >
              {{ data.user.name?.charAt(0).toUpperCase() }}
            </div>
            <div>
              <h1 class="text-3xl font-bold text-gray-900">{{ data.user.name }}</h1>
              <p class="text-md text-gray-600">{{ data.user.email }}</p>
            </div>
          </div>
          <div class="mt-6 border-t pt-6">
            <h2 class="text-xl font-semibold mb-4">Butiran Sesi</h2>
            <div class="text-sm text-gray-600 bg-gray-100 p-4 rounded-lg overflow-x-auto">
              <pre>{{ data }}</pre>
            </div>
          </div>
        </div>
      </div>

      <!-- Unauthenticated State -->
       <div v-else class="text-center">
         <h1 class="text-2xl font-bold mb-4">Akses Dihalang</h1>
        <p class="text-gray-600 mb-6">Sila log masuk untuk melihat halaman ini.</p>
        <button @click="() => signIn('google')" class="btn-primary">
          Log Masuk dengan Google
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({
  middleware: 'auth'
})

const { status, data, signIn } = useAuth()
</script> 